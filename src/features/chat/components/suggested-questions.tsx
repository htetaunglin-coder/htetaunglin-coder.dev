"use client";

import { memo } from "react";
import { FadeAnimation } from "@/components/animations/fade-animation";

const suggestedMessages = [
  "Can you tell me about yourself and your experience?",
  "What kind of projects have you worked on recently?",
  "How do you approach writing and organizing your code?",
  "What kind of team or project are you looking to join next?",
];

const PureSuggestedActions = ({
  sendMessage,
}: {
  sendMessage: (input: string) => void;
}) => (
  <div className="flex w-full flex-col">
    {suggestedMessages.map((suggestedMessage, index) => (
      <FadeAnimation
        as="div"
        className="flex items-start gap-2 border-outline-secondary/60 border-t py-1 first:border-none"
        delay={0.1 * index + 1.25}
        direction="up"
        key={suggestedMessage}
      >
        <button
          className="w-full cursor-pointer rounded-md py-2 text-left text-fg-tertiary hover:bg-bg-secondary/60 sm:px-3"
          onClick={() => sendMessage(suggestedMessage)}
          type="button"
        >
          {suggestedMessage}
        </button>
      </FadeAnimation>
    ))}
  </div>
);

export const SuggestedQuestions = memo(PureSuggestedActions);
