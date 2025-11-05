"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type ErrorDisplayProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorDisplay({
  title = "Something Went Wrong",
  message,
  onRetry,
  className,
}: ErrorDisplayProps) {
  const repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO_URL;
  return (
    <div
      className={cn(
        "flex aspect-video w-full max-w-lg flex-col items-center justify-center rounded-lg p-8 text-center",
        className
      )}
      role="alert"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-bg-danger/20 text-fg-danger">
        <AlertTriangle />
      </div>
      <h3 className="font-semibold text-danger-emphasis text-lg">{title}</h3>
      <p className="mb-6 text-danger-emphasis/80 text-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          Try Again
        </Button>
      )}
      <p className="mt-6 text-fg-tertiary/80 text-xs">
        If the problem persists, please report it on{" "}
        <a
          className="underline underline-offset-2 transition-colors hover:text-fg-accent"
          href={repoUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
