"use client";

import { motion } from "framer-motion";
import { memo } from "react";

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
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 border-outline-secondary/60 border-t py-1 first:border-none"
        exit={{ opacity: 0, y: 20 }}
        initial={{ opacity: 0, y: 20 }}
        key={suggestedMessage}
        transition={{ delay: 0.05 * index }}
      >
        <button
          className="w-full cursor-pointer rounded-md py-2 text-left text-fg-tertiary hover:bg-bg-secondary/60 sm:px-3"
          onClick={() => sendMessage(suggestedMessage)}
          type="button"
        >
          {suggestedMessage}
        </button>
      </motion.div>
    ))}
  </div>
);

export const SuggestedQuestions = memo(PureSuggestedActions);
