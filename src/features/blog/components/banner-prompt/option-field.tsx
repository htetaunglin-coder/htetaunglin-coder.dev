"use client";

import { type ReactNode, useId } from "react";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type OptionChoice = {
  value: string;
  label: string;
  /** The spec's own ID (L1, A3, P2…), shown so the prompt stays legible. */
  code?: string;
  icon?: ReactNode;
  description?: string;
  accessory?: ReactNode;
};

type OptionFieldProps = {
  title: string;
  hint?: string;
  value: string;
  options: OptionChoice[];
  columns?: 1 | 2 | 3;
  hideTitle?: boolean;
  onChange: (value: string) => void;
};

export function OptionField({
  title,
  hint,
  value,
  options,
  columns = 2,
  hideTitle = false,
  onChange,
}: OptionFieldProps) {
  const headingId = useId();

  return (
    <section>
      {/* Hidden, never dropped: this is what names the radio group. */}
      <h4
        className={cn(
          "font-medium text-fg-default text-sm",
          hideTitle && "sr-only"
        )}
        id={headingId}
      >
        {title}
      </h4>
      {hint && <p className="mt-1 text-fg-tertiary text-xs">{hint}</p>}

      <RadioGroup
        aria-labelledby={headingId}
        className={hideTitle && !hint ? undefined : "mt-3"}
        columns={columns}
        onValueChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <RadioGroupCard
            description={option.description}
            key={option.value}
            label={
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {option.icon && (
                  <span aria-hidden="true" className="[&>svg]:size-4">
                    {option.icon}
                  </span>
                )}
                {option.code && (
                  <span className="font-departure-mono text-fg-tertiary text-xs">
                    {option.code}
                  </span>
                )}
                <span>{option.label}</span>
              </span>
            }
            value={option.value}
          >
            {option.accessory}
          </RadioGroupCard>
        ))}
      </RadioGroup>
    </section>
  );
}
