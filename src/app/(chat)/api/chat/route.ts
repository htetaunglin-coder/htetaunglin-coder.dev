import { groq } from "@ai-sdk/groq";
import { Ratelimit } from "@upstash/ratelimit";
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
import { systemPrompt } from "@/lib/ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const MAX_MESSAGE_PER_DAY = 10;
const MAX_HISTORY = 5;

const MAX_MESSAGE_LENGTH = 200;

type RatelimitInfo = {
  remaining: number;
  limit: number;
  reset: number;
};

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(MAX_MESSAGE_PER_DAY, "1d"),
  prefix: "chat-ratelimit",
});

export async function POST(req: Request) {
  // biome-ignore lint/performance/useTopLevelRegex: off
  const ip = req.headers.get("x-forwarded-for")?.split(/, /)[0] || "127.0.0.1";

  let rateLimitInfo: RatelimitInfo | undefined;

  try {
    const { success, remaining, reset, limit } = await ratelimit.limit(ip);

    rateLimitInfo = { remaining, limit, reset };

    if (!success) {
      const hoursUntilReset = Math.ceil(
        (reset - Date.now()) / (1000 * 60 * 60)
      );

      return createErrorResponse(
        `You've reached your daily limit of ${MAX_MESSAGE_PER_DAY} messages. Please try again in ${hoursUntilReset} hour${hoursUntilReset !== 1 ? "s" : ""}.`,
        429
      );
    }
  } catch (ratelimitError) {
    console.error("Rate limit check failed, allowing request:", ratelimitError);
  }

  try {
    const body = await req.json();
    const { messages }: { messages: UIMessage[] } = body;

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

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        // Keep only the last 10 messages (5 user + 5 assistant)
        const limitedMessages = messages.slice(-MAX_HISTORY * 2);

        const result = streamText({
          model: groq("llama-3.1-8b-instant"),
          system: systemPrompt,
          messages: convertToModelMessages(limitedMessages),
          experimental_telemetry: {
            isEnabled: false,
          },
          experimental_transform: smoothStream({
            chunking: "word",
          }),
          stopWhen: stepCountIs(2),
          onFinish: () => {
            dataStream.write({
              type: "data-rate-limit",
              data: rateLimitInfo,
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
