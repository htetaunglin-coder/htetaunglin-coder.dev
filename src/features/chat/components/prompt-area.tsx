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
};

const PromptArea = ({ status, stop, sendMessage }: PromptAreaProps) => {
  const [input, setInput] = useState("");
  const [draft, setDraft] = useLocalStorage<string>("conversation_draft", "");
  const shouldSaveRef = useRef(true);

  // We only want to run this once as soon as the page load to restore the previous user draft.
  // biome-ignore lint/correctness/useExhaustiveDependencies: off
  useEffect(() => {
    if (draft) {
      setInput(draft);
    }
  }, []);

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
      // if (isBusy) return;

      e.preventDefault();

      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = input.trim();

    sendMessage(message);

    setInput("");

    shouldSaveRef.current = false;
    // Clear draft after successful submission
    setDraft("");
  };

  const isSubmitDisabled =
    (!input && status === "ready") || status === "submitted";

  return (
    <form
      className="relative w-full overflow-hidden rounded-xl border bg-bg-default-alt"
      onSubmit={handleSubmit}
    >
      <TextareaAutosize
        autoFocus
        className="w-full resize-none rounded-none border-none bg-transparent p-4 text-sm shadow-none outline-none transition-[height] duration-300 dark:bg-transparent"
        maxRows={10}
        minRows={5}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about me!"
        rows={5}
        value={input}
      />

      <Button
        className="absolute right-3 bottom-3 gap-1.5 rounded-lg rounded-br-xl"
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
    </form>
  );
};

export { PromptArea };
