import { PHASE_PRODUCTION_BUILD } from "next/constants";

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
  /**
   * The skill's folder in the repo, ending in `/`, or `""` at the repo root.
   * Relative paths in `body` resolve against it through `resolveSkillUrl`.
   */
  folderPath: string;
};

type TreeEntry = {
  path: string;
  type: "blob" | "tree" | "commit";
};

/**
 * Every SKILL.md in the skills repo, sorted by name. Responses are cached for
 * a day. When GitHub fails, it logs the error. A build or dev server then gets
 * an empty list; a production server gets the error.
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

    // A failed ISR revalidation keeps the last good page. An empty list would
    // be cached for a day instead, and every skill page would 404.
    if (isProductionServer()) {
      throw error;
    }

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

const SKILLS_REPO_URL = `https://github.com/${SKILLS_REPO_SLUG}`;
const BLOB_BASE_URL = `${SKILLS_REPO_URL}/blob/${GITHUB_BRANCH}/`;
const RAW_BASE_URL = `https://raw.githubusercontent.com/${SKILLS_REPO_SLUG}/${GITHUB_BRANCH}/`;
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z0-9+.-]*:|^\/\/|^#/i;

/**
 * Resolves a path from a skill's SKILL.md the way GitHub does: against the
 * skill's folder, or against the repo root when it starts with `/`. A link
 * opens the file on GitHub. An image needs the raw file.
 */
export function resolveSkillUrl(
  url: string,
  folderPath: string,
  kind: "link" | "image"
) {
  if (!url || ABSOLUTE_URL_PATTERN.test(url)) {
    return url;
  }

  const repoRoot = kind === "image" ? RAW_BASE_URL : BLOB_BASE_URL;

  // `new URL("/x", base)` drops the base path, so strip the `/` first.
  if (url.startsWith("/")) {
    return new URL(url.slice(1), repoRoot).toString();
  }

  return new URL(url, new URL(folderPath, repoRoot)).toString();
}

function isProductionServer() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD
  );
}

const TREE_URL = `https://api.github.com/repos/${SKILLS_REPO_SLUG}/git/trees/${GITHUB_BRANCH}?recursive=1`;

type TreeResponse = {
  tree: TreeEntry[];
};

async function fetchRepoTree() {
  // Optional. Without it, the API allows 60 requests an hour per IP, and build
  // machines share IPs.
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(TREE_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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

async function fetchRepoSkill(entry: TreeEntry): Promise<RepoSkill> {
  const directory = entry.path
    .slice(0, -SKILL_FILENAME.length)
    .replace(TRAILING_SLASH_PATTERN, "");
  const raw = await fetchRawFile(entry.path);
  const frontmatter = parseFrontmatter(raw);
  const slug = directory.split("/").pop() || GITHUB_REPO;

  return {
    slug,
    name: frontmatter.name || slug,
    description: frontmatter.description ?? "",
    license: frontmatter.license,
    body: stripFrontmatter(raw),
    githubUrl: directory
      ? `${SKILLS_REPO_URL}/tree/${GITHUB_BRANCH}/${directory}`
      : SKILLS_REPO_URL,
    folderPath: directory ? `${directory}/` : "",
  };
}

async function fetchRawFile(path: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${RAW_BASE_URL}${encodedPath}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Skills repo file request failed with ${res.status}`);
  }

  return res.text();
}

const LINE_BREAK_PATTERN = /\r?\n/;
const FRONTMATTER_LINE_PATTERN = /^([A-Za-z0-9_-]+):(.*)$/;
const CONTINUATION_LINE_PATTERN = /^\s+\S/;
const BLOCK_SCALAR_PATTERN = /^[>|][+-]?$/;
const SURROUNDING_QUOTES_PATTERN = /^["']|["']$/g;

// Not a YAML parser. It reads top-level keys and joins indented lines onto the
// key above with spaces, so a `>-` or multi-line description reads as one
// line. A nested map collapses into its key's text.
function parseFrontmatter(raw: string) {
  const block = raw.match(FRONTMATTER_BLOCK_PATTERN)?.[1];

  if (!block) {
    return {};
  }

  const fields: Record<string, string> = {};
  let key: string | undefined;

  for (const line of block.split(LINE_BREAK_PATTERN)) {
    const match = line.match(FRONTMATTER_LINE_PATTERN);

    if (match) {
      key = match[1];
      const value = match[2].trim();
      fields[key] = BLOCK_SCALAR_PATTERN.test(value) ? "" : value;
    } else if (key && CONTINUATION_LINE_PATTERN.test(line)) {
      fields[key] = `${fields[key]} ${line.trim()}`.trimStart();
    }
  }

  return Object.fromEntries(
    Object.entries(fields).map(([name, value]) => [
      name,
      value.replace(SURROUNDING_QUOTES_PATTERN, ""),
    ])
  );
}

function stripFrontmatter(raw: string) {
  return raw.replace(FRONTMATTER_BLOCK_PATTERN, "").trim();
}
