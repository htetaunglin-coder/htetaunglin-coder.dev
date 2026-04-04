"use client";
import type { ChatStatus } from "ai";
import { Loader2Icon, SendIcon, Square } from "lucide-react";
import { type KeyboardEventHandler, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useDebounceCallback, useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";

type PromptAreaProps = {
  status: ChatStatus;
  stop: () => void;
  sendMessage: (input: string) => void;
  maxLength?: number;
  agentSelector?: React.ReactNode;
};

const PromptArea = ({
  status,
  stop,
  sendMessage,
  maxLength,
  agentSelector,
}: PromptAreaProps) => {
  const [input, setInput] = useState("");
  const [draft, setDraft] = useLocalStorage<string>("conversation_draft", "");
  const shouldSaveRef = useRef(true);
  const submitLockRef = useRef(false);

  const isBusy =
    status === "submitted" || status === "streaming" || submitLockRef.current;

  // We only want to run this once as soon as the page load to restore the previous user draft.
  // biome-ignore lint/correctness/useExhaustiveDependencies: off
  useEffect(() => {
    if (draft) {
      setInput(draft);
    }
  }, []);

  useEffect(() => {
    if (status === "ready" || status === "error") {
      submitLockRef.current = false;
    }
  }, [status]);

  const saveDraft = useDebounceCallback((content: string) => {
    if (!shouldSaveRef.current) return;
    setDraft(content);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    shouldSaveRef.current = true;
    setInput(value);
    saveDraft(value);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      if (isBusy) return;
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBusy) return;

    if (maxLength && input.length > maxLength) {
      return;
    }

    if (!input.trim()) return;
    const message = input.trim();
    submitLockRef.current = true;
    sendMessage(message);
    setInput("");
    shouldSaveRef.current = false;
    // Clear draft after successful submission
    setDraft("");
  };

  const charCount = input.length;
  const isNearLimit = maxLength && charCount > maxLength * 0.9;
  const isAtLimit = maxLength && charCount >= maxLength;

  const isSubmitDisabled =
    (!input && status === "ready") ||
    isBusy ||
    !!(maxLength && charCount >= maxLength);

  return (
    <form
      className="relative w-full rounded-xl border bg-bg-default-alt"
      onSubmit={handleSubmit}
    >
      {isAtLimit && (
        <div className="m-1.5 rounded-lg bg-bg-danger-subtle px-4 py-2 text-fg-danger text-sm">
          <span className="font-medium">Character limit exceeded.</span> Please
          reduce your message to {maxLength} characters or less to submit.
        </div>
      )}
      <TextareaAutosize
        autoFocus
        className="w-full resize-none rounded-none border-none bg-transparent p-4 pb-8 text-sm shadow-none outline-none transition-[height] duration-300 dark:bg-transparent"
        maxRows={10}
        minRows={5}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about me!"
        rows={5}
        value={input}
      />

      <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground text-xs">
        <span
          className={`transition-colors ${
            isAtLimit
              ? "font-medium text-fg-danger"
              : isNearLimit
                ? "font-medium text-fg-warning"
                : ""
          }`}
        >
          {charCount}
          {maxLength && ` / ${maxLength}`}
        </span>
      </div>

      <div
        className={`absolute right-3 bottom-3 left-3 flex items-center gap-2 ${
          agentSelector ? "justify-between" : "justify-end"
        }`}
      >
        {agentSelector && <div className="min-w-0">{agentSelector}</div>}
        <Button
          className="shrink-0 gap-1.5 rounded-lg rounded-br-xl"
          disabled={isSubmitDisabled}
          iconOnly
          onClick={() => status === "streaming" && stop()}
          type="submit"
          variant="brand"
        >
          {status === "submitted" && <Loader2Icon className="animate-spin" />}
          {status === "streaming" && <Square className="bg-foreground" />}
          {status !== "streaming" && status !== "submitted" && <SendIcon />}
        </Button>
      </div>
    </form>
  );
};

export { PromptArea };
