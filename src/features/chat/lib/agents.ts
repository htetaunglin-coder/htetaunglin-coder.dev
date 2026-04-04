const chatAgents = [
  {
    id: "fast",
    label: "Fast",
    description: "Best for quick portfolio Q&A",
    model: "llama-3.1-8b-instant",
    dailyLimit: 10,
    cooldownSeconds: 3,
    instruction:
      "Prioritize fast, concise answers. Keep responses brief and direct.",
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Better depth with moderate latency",
    model: "openai/gpt-oss-20b",
    dailyLimit: 6,
    cooldownSeconds: 18,
    instruction:
      "Balance clarity and depth. Use practical examples when useful.",
  },
  {
    id: "deep",
    label: "Deep",
    description: "More detailed answers for harder questions",
    model: "llama-3.3-70b-versatile",
    dailyLimit: 3,
    cooldownSeconds: 43,
    instruction:
      "Give deeper reasoning and tradeoffs while staying focused on the question.",
  },
] as const;

type ChatAgent = (typeof chatAgents)[number];
type ChatAgentId = ChatAgent["id"];

const DEFAULT_CHAT_AGENT_ID: ChatAgentId = "fast";
const defaultChatAgent = chatAgents[0];

const chatAgentMap = new Map<ChatAgentId, ChatAgent>(
  chatAgents.map((agent) => [agent.id, agent])
);

const isChatAgentId = (value: unknown): value is ChatAgentId =>
  typeof value === "string" && chatAgentMap.has(value as ChatAgentId);

const resolveChatAgent = (value: unknown) => {
  if (isChatAgentId(value)) {
    return chatAgentMap.get(value) ?? defaultChatAgent;
  }

  return defaultChatAgent;
};

export {
  chatAgents,
  DEFAULT_CHAT_AGENT_ID,
  isChatAgentId,
  resolveChatAgent,
  type ChatAgent,
  type ChatAgentId,
};
