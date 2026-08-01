import { Languages } from "lucide-react";
import Link from "next/link";
import { myanmarFont } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { myanmarFontClass } from "../lib/blog-locale";

type LanguageSwitchProps = {
  /** The locale this control leads to — never the one being viewed. */
  to: Locale;
  href: string;
  className?: string;
};

/**
 * A link to the counterpart page in the other language.
 *
 * Render it only when that page actually exists. There is deliberately no
 * disabled or "coming soon" variant: a missing translation 404s, so a visible
 * control that leads nowhere would contradict that, and a post nobody intends
 * to translate is not pending. The control's presence is the whole signal;
 * its absence needs no explanation.
 *
 * Styled to read as a link rather than a filter, so it is not mistaken for a
 * third category next to the tabs it sits beside.
 */
export const LanguageSwitch = ({
  to,
  href,
  className,
}: LanguageSwitchProps) => {
  const isBurmeseLabel = to === "my";

  return (
    <Link
      className={cn(
        "inline-flex items-center gap-1.5 text-fg-tertiary text-xs no-underline outline-none transition-colors hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default sm:text-sm",
        "not-italic",
        myanmarFontClass(to) ?? "font-inter",
        // English routes sit outside `/my`, so nothing above them declares
        // `--font-noto-sans-myanmar`. A Burmese label therefore has to carry the
        // font variable on the element itself or it falls back to whatever the
        // reader's OS has, which on some machines is empty boxes.
        isBurmeseLabel && myanmarFont,
        className
      )}
      href={href}
      hrefLang={to}
      lang={to}
    >
      <Languages aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="underline underline-offset-4">
        {LANGUAGE_LABELS[to]}
      </span>
    </Link>
  );
};

// Each language named in its own script, so a reader recognises the one they
// want without having to read the one they don't.
const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "English",
  my: "မြန်မာ",
};
