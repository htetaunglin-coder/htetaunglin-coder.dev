import type { ClassValue } from "tailwind-variants";

export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
};

export type ComponentSlots<S extends string> = {
  classNames?: SlotsToClasses<S>;
};
