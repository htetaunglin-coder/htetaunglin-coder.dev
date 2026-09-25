import { BasicMarkdown } from "@/components/basic-markdown-parser";

export function SkillText({ children }: { children: string }) {
  return (
    <BasicMarkdown className="[&_code]:rounded-xs [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:not-italic">
      {children}
    </BasicMarkdown>
  );
}
