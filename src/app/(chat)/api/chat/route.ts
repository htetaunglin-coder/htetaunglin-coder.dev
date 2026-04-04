import { groq } from "@ai-sdk/groq";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { kv } from "@vercel/kv";
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";
import { chatAgents, resolveChatAgent } from "@/features/chat/lib/agents";
import { systemPrompt } from "@/lib/ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const MAX_HISTORY = 5;

const MAX_MESSAGE_LENGTH = 200;

type RatelimitInfo = {
  remaining: number;
  limit: number;
  reset: number;
};

Redis.fromEnv();

const globalRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, "1d"),
  prefix: "chat-ratelimit:global",
});

const agentRatelimits = new Map(
  chatAgents.map((agent) => [
    agent.id,
    new Ratelimit({
      redis: kv,
      limiter: Ratelimit.fixedWindow(agent.dailyLimit, "1d"),
      prefix: `chat-ratelimit:${agent.id}`,
    }),
  ])
);

const getAgentCooldownKey = (ip: string, agentId: string) =>
  `chat-agent-cooldown:${agentId}:${ip}`;

const parseCooldownExpiration = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return undefined;
};

export async function POST(req: Request) {
  // biome-ignore lint/performance/useTopLevelRegex: off
  const ip = req.headers.get("x-forwarded-for")?.split(/, /)[0] || "127.0.0.1";

  let globalRateLimitInfo: RatelimitInfo | undefined;
  let agentRateLimitInfo: RatelimitInfo | undefined;

  try {
    const body = await req.json();
    const { messages, agentId }: { messages: UIMessage[]; agentId?: unknown } =
      body;
    const selectedAgent = resolveChatAgent(agentId);

    if (!(messages && Array.isArray(messages)) || messages.length === 0) {
      return createErrorResponse(
        "No messages provided. Please send at least one message.",
        400
      );
    }

    const lastMessage = messages[messages.length - 1];
    const firstPart = lastMessage?.parts?.[0];

    if (
      lastMessage &&
      lastMessage.role === "user" &&
      firstPart &&
      "text" in firstPart &&
      typeof firstPart.text === "string" &&
      firstPart.text.length > MAX_MESSAGE_LENGTH
    ) {
      const excess = firstPart.text.length - MAX_MESSAGE_LENGTH;
      return createErrorResponse(
        `Your message is too long by ${excess} character${excess !== 1 ? "s" : ""}. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
        422
      );
    }

    const agentRatelimit = agentRatelimits.get(selectedAgent.id);

    if (!agentRatelimit) {
      return createErrorResponse(
        "Selected agent configuration is unavailable. Please try again later.",
        500
      );
    }

    try {
      const { success, remaining, reset, limit } =
        await globalRatelimit.limit(ip);

      globalRateLimitInfo = { remaining, limit, reset };

      if (!success) {
        const hoursUntilReset = Math.ceil(
          (reset - Date.now()) / (1000 * 60 * 60)
        );

        return createErrorResponse(
          `You've reached your daily limit of ${limit} messages. Please try again in ${hoursUntilReset} hour${hoursUntilReset !== 1 ? "s" : ""}.`,
          429
        );
      }
    } catch (ratelimitError) {
      console.error(
        "Global rate limit check failed, allowing request:",
        ratelimitError
      );
    }

    try {
      const cooldownKey = getAgentCooldownKey(ip, selectedAgent.id);
      const cooldownExpirationValue = await kv.get(cooldownKey);
      const cooldownExpiration = parseCooldownExpiration(
        cooldownExpirationValue
      );
      const now = Date.now();

      if (cooldownExpiration && cooldownExpiration > now) {
        const remainingSeconds = Math.max(
          1,
          Math.ceil((cooldownExpiration - now) / 1000)
        );

        return createErrorResponse(
          `Please wait ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""} before using the ${selectedAgent.label} agent again.`,
          429
        );
      }
    } catch (cooldownError) {
      console.error("Cooldown check failed, allowing request:", cooldownError);
    }

    try {
      const { success, remaining, reset, limit } =
        await agentRatelimit.limit(ip);

      agentRateLimitInfo = { remaining, limit, reset };

      if (!success) {
        const hoursUntilReset = Math.ceil(
          (reset - Date.now()) / (1000 * 60 * 60)
        );

        return createErrorResponse(
          `You've reached the ${selectedAgent.label} agent limit of ${limit} messages per day. Please try again in ${hoursUntilReset} hour${hoursUntilReset !== 1 ? "s" : ""}.`,
          429
        );
      }
    } catch (agentRatelimitError) {
      console.error(
        "Agent rate limit check failed, allowing request:",
        agentRatelimitError
      );
    }

    try {
      if (selectedAgent.cooldownSeconds > 0) {
        const cooldownKey = getAgentCooldownKey(ip, selectedAgent.id);
        const cooldownExpiration =
          Date.now() + selectedAgent.cooldownSeconds * 1000;
        await kv.set(cooldownKey, cooldownExpiration, {
          ex: selectedAgent.cooldownSeconds,
        });
      }
    } catch (cooldownWriteError) {
      console.error(
        "Cooldown write failed, continuing without cooldown:",
        cooldownWriteError
      );
    }

    const stream = createUIMessageStream({
      execute: async ({ writer: dataStream }) => {
        // Keep only the last 10 messages (5 user + 5 assistant)
        const limitedMessages = messages.slice(-MAX_HISTORY * 2);
        const modelMessages = await convertToModelMessages(limitedMessages);

        const result = streamText({
          model: groq(selectedAgent.model),
          system: `${systemPrompt}\n\nAgent mode: ${selectedAgent.instruction}`,
          messages: modelMessages,
          experimental_telemetry: {
            isEnabled: false,
          },
          experimental_transform: smoothStream({
            chunking: "word",
          }),
          stopWhen: stepCountIs(2),
          onFinish: () => {
            dataStream.write({
              type: "data-agent-selection",
              data: {
                id: selectedAgent.id,
                label: selectedAgent.label,
                model: selectedAgent.model,
                description: selectedAgent.description,
              },
            });
            dataStream.write({
              type: "data-rate-limit",
              data: {
                global: globalRateLimitInfo,
                agent: agentRateLimitInfo,
              },
            });
            return;
          },
        });

        result.consumeStream();

        dataStream.merge(result.toUIMessageStream());
      },

      onError: (error) => {
        if (error instanceof Error) {
          if (error.message.includes("Rate limit")) {
            return "The AI service is experiencing high demand. Please try again in a moment.";
          }
          if (error.message.includes("timeout")) {
            return "The request took too long. Please try again with a shorter message.";
          }
          if (error.message.includes("context")) {
            return "Your conversation is too long. Please start a new chat.";
          }
        }

        console.error("Stream error:", error);
        return "Something went wrong while processing your message. Please try again.";
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    console.error("Request error:", error);

    if (error instanceof SyntaxError) {
      return createErrorResponse(
        "Invalid request format. Please refresh and try again.",
        400
      );
    }

    return createErrorResponse(
      "An unexpected error occurred. Please try again.",
      500
    );
  }
}

function createErrorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      error: message,
      status,
    },
    { status }
  );
}
