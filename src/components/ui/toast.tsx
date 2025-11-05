"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group z-50"
      position="top-right"
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast font-inter group-[.toaster]:bg-bg-default group-[.toaster]:text-fg-default group-[.toaster]:border-outline-secondary rounded-sm group-[.toaster]:shadow-lg px-4 py-2.5 flex items-center gap-2 w-80 border",
          title: "text-sm font-medium",
          description: "group-[.toast]:text-fg-tertiary text-sm",
          actionButton:
            "group-[.toast]:bg-bg-brand group-[.toast]:text-on-bg-brand",
          cancelButton:
            "group-[.toast]:bg-bg-tertiary group-[.toast]:text-fg-tertiary",
          icon: "group-data-[type=error]:text-fg-danger group-data-[type=success]:text-green-500 group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-blue-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
