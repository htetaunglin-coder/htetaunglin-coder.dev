import { highlight } from "fumadocs-core/highlight";
import { Pre } from "fumadocs-ui/components/codeblock";
import {
  BANNER_PROMPT_GIST_URL,
  getBannerPromptSpec,
} from "../api/banner-prompt";
import { GistCodeBlock } from "./gist-code-block";

export async function BannerPromptSpec() {
  const spec = await getBannerPromptSpec();

  if (!spec) {
    return (
      <div className="my-6 border border-outline-default bg-bg-secondary p-6">
        <p className="m-0 text-fg-default">
          The spec could not be loaded right now. It lives in a GitHub Gist, and
          you can read and copy the whole thing there.
        </p>
        <a
          className="text-fg-brand underline"
          href={BANNER_PROMPT_GIST_URL}
          rel="noreferrer"
          target="_blank"
        >
          Open the spec on GitHub
        </a>
      </div>
    );
  }

  const rendered = await highlight(spec, {
    lang: "md",
    // Matches what Fumadocs renders for ordinary MDX code fences in a post.
    themes: { light: "github-light", dark: "github-dark" },
    components: { pre: Pre },
  });

  return (
    <GistCodeBlock
      gistUrl={BANNER_PROMPT_GIST_URL}
      title="banner-prompt-spec.md"
    >
      {rendered}
    </GistCodeBlock>
  );
}
