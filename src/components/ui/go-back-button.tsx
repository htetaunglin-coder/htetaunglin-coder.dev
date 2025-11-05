"use client";
import { useRouter } from "next/navigation";

export function GoBackButton({
  onClick,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const router = useRouter();
  return (
    <button
      onClick={(e) => {
        if (window.history.length > 1) router.back();
        else router.push("/");

        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
