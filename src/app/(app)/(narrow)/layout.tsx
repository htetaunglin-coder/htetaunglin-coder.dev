import type { ReactNode } from "react";
import { Footer } from "@/components/footer";

export default function NarrowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="[--content-max-width:var(--container-3xl)]">
      {children}

      <Footer className="mx-auto max-w-(--content-max-width) px-6 lg:px-0" />
    </div>
  );
}
