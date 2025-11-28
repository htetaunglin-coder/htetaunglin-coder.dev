import type { Activity } from "@/components/contribution-graph";

export const GITHUB_USERNAME = "htetaunglin-coder";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export async function getGitHubContributions() {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
    {
      next: { revalidate: 86_400 },
    }
  );
  const data = (await res.json()) as GitHubContributionsResponse;
  return data.contributions;
}
