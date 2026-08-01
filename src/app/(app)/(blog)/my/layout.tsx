import type React from "react";
import { myanmarFont } from "@/lib/fonts";

// Only declares `--font-noto-sans-myanmar` for the subtree; pages decide which
// elements claim it via `myanmarFontClass`.
const BurmeseBlogLayout = ({ children }: { children: React.ReactNode }) => (
  <div className={myanmarFont}>{children}</div>
);

export default BurmeseBlogLayout;
