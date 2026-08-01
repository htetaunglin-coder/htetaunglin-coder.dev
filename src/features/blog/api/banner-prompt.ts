/**
 * The banner spec lives in a public Gist rather than in this repo so readers
 * can fork and improve it. The post renders whatever the Gist currently says,
 * which keeps one copy instead of two that drift apart.
 */
export async function getBannerPromptSpec() {
  try {
    const res = await fetch(RAW_SPEC_URL, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error(`Banner prompt gist responded with ${res.status}`);
      return null;
    }

    // The Gist file ends with a newline, which Shiki would render as a stray
    // blank line at the bottom of the code block.
    return (await res.text()).trimEnd();
  } catch (error) {
    // Degrade the post to a link-out instead of failing the build. ISR keeps
    // serving the last good copy through a failed revalidate, so this only
    // surfaces on a cold build while the Gist is unreachable.
    console.error("Failed to fetch the banner prompt gist", error);
    return null;
  }
}

export const BANNER_PROMPT_GIST_URL =
  "https://gist.github.com/htetaunglin-coder/4bac2f2ae7e536addf2a5c04cca0894a";

// Raw URL without a revision SHA, so it always resolves to the latest edit.
const RAW_SPEC_URL =
  "https://gist.githubusercontent.com/htetaunglin-coder/4bac2f2ae7e536addf2a5c04cca0894a/raw/banner-prompt-spec.md";
