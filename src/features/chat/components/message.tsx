"use client";

import type { ChatStatus, UIMessage } from "ai";
import { motion } from "motion/react";
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown/markdown";

type PreviewMessageProps = {
  message: UIMessage;
  status: ChatStatus;
  isLast: boolean;
};

const PurePreviewMessage = ({
  message,
  status,
  isLast,
}: PreviewMessageProps) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isStreaming = isLast && status === "streaming" && isAssistant;
  const isThinking =
    isLast &&
    status === "submitted" &&
    isAssistant &&
    message.parts.length === 0;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex w-full items-start gap-3 px-4",
        isUser && "justify-end",
        isAssistant && "flex-col"
      )}
      data-role={message.role}
      exit={{ opacity: 0, y: -20 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      {isAssistant && <AssistantHeader />}

      <div
        className={cn(
          "flex w-full flex-col gap-3",
          isUser &&
            "w-fit max-w-[calc(var(--chat-view-max-width)*0.7)] items-end"
        )}
      >
        <div className={cn("flex w-full flex-col gap-2", isUser && "gap-0")}>
          {message.parts.map((part, index) => {
            const key = `${message.id}-part-${index}`;

            if (part.type === "text") {
              return isUser ? (
                <UserMessage content={part.text} key={key} />
              ) : (
                <AssistantTextContent content={part.text} key={key} />
              );
            }

            return null;
          })}

          {message && !isStreaming && !isThinking && (
            <div
              className={cn(
                "flex items-center gap-4 py-1",
                isUser &&
                  "justify-end transition duration-300 group-hover:opacity-100 sm:opacity-0"
              )}
            >
              <CopyMessage message={message} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const PreviewMessage = memo(PurePreviewMessage);

const CopyMessage = ({ message }: { message: UIMessage }) => {
  const textFromParts = message.parts
    ?.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();

  return (
    <CopyButton
      className="hover:bg-bg-default-alt [&>svg]:text-fg-secondary/80"
      content={textFromParts}
      size="sm"
      variant="ghost"
    />
  );
};

const UserMessage = ({ content }: { content: string }) => (
  <motion.div
    animate={{ opacity: 1, scale: 1 }}
    className="min-w-fit rounded-xl bg-bg-default-alt px-4 py-3 text-fg-default text-sm"
    initial={{
      opacity: 0,
      scale: 0.95,
    }}
  >
    <p className="whitespace-pre-wrap break-words">{content}</p>
  </motion.div>
);

const AssistantHeader = () => (
  <div className="mb-1 flex items-center gap-2">
    <Avatar size="2xs">
      <AvatarImage
        alt="Htet Aung Lin"
        src={"/images/people/profile-image.jpg"}
      />
      <AvatarFallback>H</AvatarFallback>
    </Avatar>
    <span className="font-medium text-fg-default text-xs">Htet Aung Lin</span>
    <span className="text-fg-tertiary text-xs">•</span>
    <span className="font-medium text-fg-tertiary text-xs">Groq</span>
  </div>
);

const AssistantTextContent = ({ content }: { content: string }) => {
  if (!content.trim()) return null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group/message relative"
      initial={{ opacity: 0 }}
    >
      <div className="prose prose-sm dark:prose-invert w-full max-w-none prose-hr:border-outline-default text-fg-default">
        <Markdown>{content}</Markdown>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2 text-fg-tertiary text-sm"
    initial={{ opacity: 0, y: 5 }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      className="size-3 rounded-full border border-fg-default border-t-transparent text-fg-tertiary"
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
    <span>Thinking...</span>
  </motion.div>
);
