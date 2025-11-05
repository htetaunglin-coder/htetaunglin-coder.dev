"use client";

import { ErrorDisplay } from "@/components/error-display";
import { Signature } from "@/components/icons/signature";

export default function GlobalError() {
  return (
    <html lang="en">
      <body className="flex min-h-svh w-full items-center justify-center">
        <div className="absolute top-5 left-10 flex items-center space-x-2">
          <Signature className="size-16 text-fg-brand" />
        </div>

        <ErrorDisplay
          message="An unrecoverable error occurred. Please reload the page."
          onRetry={() => window.location.reload()}
          title="Something went wrong"
        />
      </body>
    </html>
  );
}
