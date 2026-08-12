import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { highlight } from "fumadocs-core/highlight";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { FULL_SPEC } from "../../lib/banner-prompt/spec";
import { BannerStepFlow } from "./step-flow";

// Hoisted so the highlight runs once per process rather than once per render.
const highlightedSpec = highlight(FULL_SPEC, {
  lang: "md",
  themes: { light: "github-light", dark: "github-dark" },
  components: { pre: Pre },
});

export async function BannerPrompt() {
  const rendered = await highlightedSpec;

  return (
    <div className="my-12">
      <Tabs className="not-prose relative" defaultValue="build">
        {/* horizontal */}
        <DashedDivider className="-mx-[6rem] absolute inset-x-0 bottom-0 opacity-40 dark:opacity-30" />
        <DashedDivider className="-mx-[6rem] absolute inset-x-0 top-0 opacity-40 dark:opacity-30" />
        <DashedDivider className="-mx-[6rem] absolute inset-x-0 top-8 opacity-40 dark:opacity-30" />
        {/* verfical */}
        <DashedDivider
          className="-mt-[1.6rem] -mb-[4rem] absolute inset-y-0 left-0 opacity-40 dark:opacity-30"
          orientation="vertical"
        />
        <DashedDivider
          className="-mt-[1.6rem] -mb-[4rem] absolute inset-y-0 right-0 opacity-40 dark:opacity-30"
          orientation="vertical"
        />

        <TabsList className="inline-flex h-8 w-full items-center border-b-0 p-0">
          <TabsTrigger
            className="flex h-full items-center gap-1 px-3 font-black font-doto text-fg-tertiary text-xs outline-none transition-colors hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default data-[state=active]:bg-fg-default data-[state=active]:text-bg-default sm:px-4 sm:text-sm"
            value="raw"
          >
            Raw prompt
          </TabsTrigger>
          <TabsTrigger
            className="flex h-full items-center gap-1 px-3 font-black font-doto text-fg-tertiary text-xs outline-none transition-colors hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default data-[state=active]:bg-fg-default data-[state=active]:text-bg-default sm:px-4 sm:text-sm"
            value="build"
          >
            Build it
          </TabsTrigger>
        </TabsList>

        <TabsContent className="flex flex-col gap-6 p-4" value="build">
          <div className="w-full">
            <CloudinaryImage
              alt="A LinkedIn post showing a banner image of a woman in a business"
              height={242}
              src="linkedin-example-1_tclxdv"
              width={728}
            />
          </div>
          <BannerStepFlow />
        </TabsContent>
        <TabsContent className="p-4" value="raw">
          <CodeBlock className="m-0!" title="prompt.md">
            {rendered}
          </CodeBlock>
        </TabsContent>
      </Tabs>
    </div>
  );
}
