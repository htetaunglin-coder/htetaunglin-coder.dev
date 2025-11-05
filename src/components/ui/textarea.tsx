import { tv, type VariantProps } from "tailwind-variants";

import type { ComponentSlots } from "./types";

const textareaStyles = tv({
  slots: {
    base: "flex min-h-32 w-full rounded-md border bg-bg-default-alt px-3 py-2 text-sm outline-none transition duration-300 placeholder:text-fg-tertiary focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default disabled:cursor-not-allowed disabled:opacity-50",
  },
});

export type TextAreaVariantProps = VariantProps<typeof textareaStyles>;
export type TextAreaSlots = keyof ReturnType<typeof textareaStyles>;

export { textareaStyles };

/* -------------------------------------------------------------------------- */

type TextareaBaseProps = ComponentSlots<TextAreaSlots> &
  React.ComponentProps<"textarea">;

export type TextareaProps = TextareaBaseProps & TextAreaVariantProps;

const Textarea = ({ className, ...props }: TextareaProps) => {
  const { base } = textareaStyles();
  return <textarea className={base({ className })} {...props} />;
};

export { Textarea };
