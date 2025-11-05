import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { buttonStyles } from "./ui/button";

type LangSwitcherProps = {
  className?: ComponentProps<typeof Link>["className"];
};

export const LangSwitcher = ({ className }: LangSwitcherProps) => {
  const locale = useLocale();

  return (
    <Link
      className={cn(
        buttonStyles().base({ variant: "ghost", iconOnly: true }),
        className
      )}
      href={locale === "en" ? "/pl" : "/en"}
    >
      {locale === "en" ? "PL" : "EN"}
    </Link>
  );
};
