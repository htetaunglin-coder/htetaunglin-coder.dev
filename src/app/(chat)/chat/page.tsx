import type { Metadata } from "next";
import { ChatView } from "@/features/chat/chat-view";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with AI assistant powered by Htet Aung Lin's portfolio.",
  alternates: {
    canonical: absoluteUrl("/chat"),
  },
  robots: { index: false, follow: true },
};

const ChatPage = () => <ChatView />;

export default ChatPage;
