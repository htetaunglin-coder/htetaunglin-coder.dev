import type React from "react";
import { myanmarFont } from "@/lib/fonts";

/**
 * Applies the Myanmar face to everything under `/my`. This only makes
 * `--font-noto-sans-myanmar` available to the subtree — pages decide which
 * elements are actually Burmese and mark them with `lang` plus the
 * `font-noto-sans-myanmar` utility.
 */
const BurmeseBlogLayout = ({ children }: { children: React.ReactNode }) => (
  <div className={myanmarFont}>{children}</div>
);

export default BurmeseBlogLayout;
