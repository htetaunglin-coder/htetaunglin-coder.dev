const GITHUB_OWNER = "htetaunglin-coder";
const GITHUB_REPO = "skills";
const GITHUB_BRANCH = "main";
const SKILLS_REPO_SLUG = `${GITHUB_OWNER}/${GITHUB_REPO}`;

const REVALIDATE_SECONDS = 86_400;
const SKILL_FILENAME = "SKILL.md";
const FRONTMATTER_BLOCK_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;

export type RepoSkill = {
  /** The folder name. A SKILL.md at the repo root takes the repo name. */
  slug: string;
  name: string;
  description: string;
  license?: string;
  /** The SKILL.md text without its frontmatter. */
  body: string;
  githubUrl: string;
  /** The folder URL that relative links in `body` resolve against. Ends in `/`. */
  baseUrl: string;
};

type TreeEntry = {
  path: string;
  type: "blob" | "tree" | "commit";
};

/**
 * Every SKILL.md in the skills repo, sorted by name. Responses are cached for
 * a day. When GitHub fails, it logs the error and returns an empty list.
 */
export async function getRepoSkills(): Promise<RepoSkill[]> {
  try {
    const tree = await fetchRepoTree();
    const skills = await Promise.all(
      tree.filter(isSkillFile).map((entry) => fetchRepoSkill(entry))
    );

    return skills.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to load skills from GitHub:", error);
    return [];
  }
}

export async function getRepoSkill(slug: string) {
  const skills = await getRepoSkills();

  return skills.find((skill) => skill.slug === slug);
}

export function skillInstallCommand(slug: string) {
  return `npx skills add ${SKILLS_REPO_SLUG} --skill ${slug}`;
}

const TREE_URL = `https://api.github.com/repos/${SKILLS_REPO_SLUG}/git/trees/${GITHUB_BRANCH}?recursive=1`;

type TreeResponse = {
  tree: TreeEntry[];
};

async function fetchRepoTree() {
  const res = await fetch(TREE_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Skills repo tree request failed with ${res.status}`);
  }

  const { tree } = (await res.json()) as TreeResponse;

  return tree;
}

function isSkillFile(entry: TreeEntry) {
  return (
    entry.type === "blob" &&
    (entry.path === SKILL_FILENAME || entry.path.endsWith(`/${SKILL_FILENAME}`))
  );
}

const TRAILING_SLASH_PATTERN = /\/$/;
const SKILLS_REPO_URL = `https://github.com/${SKILLS_REPO_SLUG}`;

async function fetchRepoSkill(entry: TreeEntry): Promise<RepoSkill> {
  const directory = entry.path
    .slice(0, -SKILL_FILENAME.length)
    .replace(TRAILING_SLASH_PATTERN, "");
  const raw = await fetchRawFile(entry.path);
  const frontmatter = parseFrontmatter(raw);
  const slug = directory.split("/").pop() || GITHUB_REPO;
  const baseUrl = directory
    ? `${SKILLS_REPO_URL}/blob/${GITHUB_BRANCH}/${directory}/`
    : `${SKILLS_REPO_URL}/blob/${GITHUB_BRANCH}/`;

  return {
    slug,
    name: frontmatter.name ?? slug,
    description: frontmatter.description ?? "",
    license: frontmatter.license,
    body: stripFrontmatter(raw),
    githubUrl: directory
      ? `${SKILLS_REPO_URL}/tree/${GITHUB_BRANCH}/${directory}`
      : SKILLS_REPO_URL,
    baseUrl,
  };
}

const RAW_BASE_URL = `https://raw.githubusercontent.com/${SKILLS_REPO_SLUG}/${GITHUB_BRANCH}`;

async function fetchRawFile(path: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${RAW_BASE_URL}/${encodedPath}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Skills repo file request failed with ${res.status}`);
  }

  return res.text();
}

const LINE_BREAK_PATTERN = /\r?\n/;
const FRONTMATTER_LINE_PATTERN = /^([A-Za-z0-9_-]+):\s*(.+)$/;
const SURROUNDING_QUOTES_PATTERN = /^["']|["']$/g;

// Reads single-line values only. A folded YAML description is cut off with no
// error.
function parseFrontmatter(raw: string) {
  const block = raw.match(FRONTMATTER_BLOCK_PATTERN)?.[1];

  if (!block) {
    return {};
  }

  const fields: Record<string, string> = {};

  for (const line of block.split(LINE_BREAK_PATTERN)) {
    const match = line.match(FRONTMATTER_LINE_PATTERN);

    if (match) {
      fields[match[1]] = match[2]
        .trim()
        .replace(SURROUNDING_QUOTES_PATTERN, "");
    }
  }

  return fields;
}

function stripFrontmatter(raw: string) {
  return raw.replace(FRONTMATTER_BLOCK_PATTERN, "").trim();
}
