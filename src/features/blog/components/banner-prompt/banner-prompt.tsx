import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { cn } from "@/lib/utils";
import { BUILDER_ANCHOR_ID } from "../../lib/banner-prompt/preset";
import { RawPrompt } from "./raw-prompt";
import { BannerStepFlow } from "./step-flow";

export function BannerPrompt() {
  return (
    <section
      aria-label="Banner prompt builder"
      className="my-12 scroll-mt-28"
      id={BUILDER_ANCHOR_ID}
      tabIndex={-1}
    >
      <Tabs className="not-prose relative mb-12" defaultValue="raw">
        <DashedDivider
          className={cn(
            "absolute opacity-60 dark:opacity-30",
            "max-lg:mask-none lg:-mx-[4.5rem] inset-x-0 bottom-0"
          )}
        />
        <DashedDivider
          className={cn(
            "absolute opacity-60 dark:opacity-30",
            "max-lg:mask-none lg:-mx-[4.5rem] inset-x-0 top-0"
          )}
        />
        <DashedDivider
          className={cn(
            "absolute opacity-60 dark:opacity-30",
            "max-lg:mask-none lg:-mx-[4.5rem] inset-x-0 top-8"
          )}
        />
        <DashedDivider
          className={cn(
            "absolute opacity-60 dark:opacity-30",
            "-mt-[2rem] -mb-[4rem] inset-y-0 left-0"
          )}
          orientation="vertical"
        />
        <DashedDivider
          className={cn(
            "absolute opacity-60 dark:opacity-30",
            "-mt-[2rem] -mb-[4rem] inset-y-0 right-0"
          )}
          orientation="vertical"
        />

        <TabsList className="inline-flex h-8 w-full items-center border-b-0 p-0">
          <TabsTrigger
            className={
              "flex h-full items-center gap-1 px-3 font-black font-doto text-fg-tertiary text-xs outline-none transition-colors hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default data-[state=active]:bg-fg-default data-[state=active]:text-bg-default sm:px-4 sm:text-sm"
            }
            value="raw"
          >
            Raw prompt
          </TabsTrigger>
          <TabsTrigger
            className={
              "flex h-full items-center gap-1 px-3 font-black font-doto text-fg-tertiary text-xs outline-none transition-colors hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default data-[state=active]:bg-fg-default data-[state=active]:text-bg-default sm:px-4 sm:text-sm"
            }
            value="build"
          >
            Build it
          </TabsTrigger>
        </TabsList>

        <TabsContent
          className="flex flex-col gap-2 p-2 sm:gap-6 sm:p-4"
          value="build"
        >
          <BannerStepFlow />
        </TabsContent>
        <TabsContent
          className="flex h-[min(28rem,60dvh)] flex-col p-2 sm:p-4"
          value="raw"
        >
          <RawPrompt />
        </TabsContent>
      </Tabs>
    </section>
  );
}
