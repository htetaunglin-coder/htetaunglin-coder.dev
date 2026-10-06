"use client";

import type { ReactNode } from "react";

type CountryHoverProps = { className?: string; children: ReactNode };

/**
 * Marks every `[data-code]` element that shares the hovered element's code
 * with `data-active`, so a map shape and its list row light up together.
 */
export function CountryHover({ className, children }: CountryHoverProps) {
  return (
    <div
      className={className}
      onPointerLeave={(event) => setActive(event.currentTarget, null)}
      onPointerOver={(event) =>
        setActive(
          event.currentTarget,
          (event.target as Element)
            .closest("[data-code]")
            ?.getAttribute("data-code") ?? null
        )
      }
    >
      {children}
    </div>
  );
}

// The children are server-rendered and never re-render here, so toggling an
// attribute on them directly is safe and avoids shipping the map as props.
function setActive(container: HTMLElement, code: string | null) {
  for (const node of container.querySelectorAll("[data-active]")) {
    node.removeAttribute("data-active");
  }
  if (!code) return;
  for (const node of container.querySelectorAll(
    `[data-code="${CSS.escape(code)}"]`
  )) {
    node.setAttribute("data-active", "");
  }
}
