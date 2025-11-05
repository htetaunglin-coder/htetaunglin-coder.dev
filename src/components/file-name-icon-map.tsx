import {
  type IconType,
  SiCss,
  SiDotenv,
  SiEslint,
  SiGitignoredotio,
  SiGnubash,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiMarkdown,
  SiMysql,
  SiNextdotjs,
  SiPrettier,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "@icons-pack/react-simple-icons";

const filenameIconMap: Record<string, IconType> = {
  // Environment & Config
  ".env": SiDotenv,
  ".env.*": SiDotenv,
  ".gitignore": SiGitignoredotio,

  // Web Languages (aligned with your supported languages)
  "*.html": SiHtml5,
  "*.css": SiCss,
  "*.js": SiJavascript,
  "*.mjs": SiJavascript,
  "*.cjs": SiJavascript,
  "*.jsx": SiReact,
  "*.ts": SiTypescript,
  "*.mts": SiTypescript,
  "*.cts": SiTypescript,
  "*.tsx": SiReact,
  "*.json": SiJson,
  "*.md": SiMarkdown,
  "*.markdown": SiMarkdown,
  "readme.md": SiMarkdown,
  "*.sh": SiGnubash,
  "*.bash": SiGnubash,
  "*.sql": SiMysql,
  "*.py": SiPython,

  // Framework & Tool Configs
  "next.config.*": SiNextdotjs,
  "tailwind.config.*": SiTailwindcss,
  ".eslintrc": SiEslint,
  ".eslintrc.*": SiEslint,
  "eslint.config.*": SiEslint,
  "prettier.config.*": SiPrettier,
  ".prettierrc": SiPrettier,
  ".prettierrc.*": SiPrettier,
  "vite.config.*": SiVite,
  "vercel.json": SiVercel,

  // Package files
  "package.json": SiJson,
  "tsconfig.json": SiTypescript,
};

const getIconForFilename = (filename: string): IconType | undefined =>
  Object.entries(filenameIconMap).find(([pattern]) => {
    const regex = new RegExp(
      `^${pattern.replace(/\\/g, "\\\\").replace(/\./g, "\\.").replace(/\*/g, ".*")}$`
    );
    return regex.test(filename);
  })?.[1];

export { getIconForFilename, filenameIconMap };
