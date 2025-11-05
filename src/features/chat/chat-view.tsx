"use client";

import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";
import { toast } from "sonner";
import { useStickToBottom } from "use-stick-to-bottom";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PreviewMessage, ThinkingMessage } from "./components/message";
import { PromptArea } from "./components/prompt-area";
import { SuggestedQuestions } from "./components/suggested-questions";

const ChatView = () => {
  const { scrollRef, contentRef, isAtBottom, scrollToBottom } =
    useStickToBottom({
      initial: "smooth",
      resize: "smooth",
    });

  const { sendMessage, messages, status, stop } = useChat({
    onError: (error) => {
      let errorMessage = "An error occurred, please try again later.";

      try {
        const parsed = JSON.parse(error.message);
        errorMessage = parsed.error || errorMessage;
      } catch {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage, {
        richColors: true,
      });
    },
    // onData: (dataPart) => {
    //   if (dataPart.type === "data-rate-limit") {
    //     setRatelimitInfo(dataPart.data as RatelimitInfo);
    //   }
    // },
  });

  return (
    <>
      <Header className="fixed inset-x-0 top-0" container={scrollRef} />

      <div className="relative h-svh w-full">
        <div
          className="flex size-full flex-1 overflow-y-auto font-inter"
          ref={scrollRef}
        >
          <div
            className="size-full pt-[calc(var(--header-height))]"
            ref={contentRef}
          >
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 pt-12 pb-64 sm:gap-4">
              {messages.length > 0 ? (
                messages.map((message, i) => (
                  <PreviewMessage
                    isLast={i === messages.length - 1}
                    key={message.id || i}
                    message={message}
                    status={status}
                  />
                ))
              ) : (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
                  <div className="-mt-[calc(var(--header-height)_+_2rem)] w-full max-w-2xl space-y-2 sm:space-y-4">
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="sm:px-3"
                      exit={{ opacity: 0, y: 20 }}
                      initial={{ opacity: 0, y: 20 }}
                    >
                      <h1 className="pointer-events-auto bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-semibold text-3xl/[1.2] text-transparent tracking-tight sm:mt-0 sm:text-4xl/[1.2] dark:to-fg-tertiary/80">
                        Ask Me Anything!
                      </h1>
                    </motion.div>
                    <div className="pointer-events-auto w-full">
                      <SuggestedQuestions
                        sendMessage={(msg) => sendMessage({ text: msg })}
                      />
                    </div>
                  </div>
                </div>
              )}
              {status === "submitted" && (
                <div className="px-4">
                  <ThinkingMessage />
                </div>
              )}
            </div>
          </div>

          <Button
            className={cn(
              "absolute bottom-4 left-1/2 translate-x-1/2 rounded-full transition-all duration-300 ease-in-out",
              isAtBottom
                ? "pointer-events-none translate-y-4 opacity-0"
                : "pointer-events-auto opacity-100",
              "-translate-x-1/2 absolute bottom-44 left-1/2 z-30"
            )}
            iconOnly
            onClick={() => scrollToBottom()}
            type="button"
          >
            <ArrowDownIcon className="size-4" />
          </Button>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 w-full shrink-0">
          <div className="flex justify-center bg-bg-default p-4 pt-0 pb-8">
            <div className="relative w-full max-w-3xl">
              <PromptArea
                sendMessage={(msg) => sendMessage({ text: msg })}
                status={status}
                stop={stop}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ChatView };
