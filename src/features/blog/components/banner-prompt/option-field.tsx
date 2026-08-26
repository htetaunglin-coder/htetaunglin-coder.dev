"use client";

import { type ReactNode, useId } from "react";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type OptionChoice<Value extends string> = {
  value: Value;
  label: string;
  description?: string;
  /** A thumbnail rendered above the label. */
  accessory?: ReactNode;
};

type OptionFieldProps<Value extends string> = {
  title: string;
  hint?: string;
  value: Value;
  options: OptionChoice<Value>[];
  columns?: 1 | 2 | 3 | 4;
  /** Overrides the grid on the group itself — for a fixed count that opts out
    of the responsive `columns` ramp. Neutralise each breakpoint it sets. */
  columnsClassName?: string;
  hideTitle?: boolean;
  onChange: (value: Value) => void;
};

export function OptionField<Value extends string>({
  title,
  hint,
  value,
  options,
  columns = 2,
  columnsClassName,
  hideTitle = false,
  onChange,
}: OptionFieldProps<Value>) {
  const headingId = useId();
  const selected = options.find((option) => option.value === value);

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
        className={cn(!(hideTitle && !hint) && "mt-3", columnsClassName)}
        columns={columns}
        // Radix hands back a bare string; the option list is what pins it down.
        onValueChange={(next) => onChange(next as Value)}
        value={value}
      >
        {options.map((option) => (
          <RadioGroupCard
            className="border-outline-default/60"
            key={option.value}
            label={
              <span className="block truncate text-xs sm:text-sm">
                {option.label}
              </span>
            }
            media={option.accessory}
            value={option.value}
            variant="media"
          />
        ))}
      </RadioGroup>

      {selected?.description && (
        <p aria-live="polite" className="mt-2 text-fg-tertiary text-xs">
          {selected.description}
        </p>
      )}
    </section>
  );
}

export function CodeLabel({
  code,
  children,
}: {
  code: string;
  children: ReactNode;
}) {
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="hidden shrink-0 font-inter text-fg-tertiary text-xs sm:inline-block">
        {code}
      </span>
      <span className="text-xs sm:text-sm">{children}</span>
    </span>
  );
}
