"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  HEADLINE_WORD_LIMIT,
  PALETTE_BY_ID,
  type PaletteId,
} from "../../lib/banner-prompt/options";

/** Offsets, not just text: the preview finds the accent with `indexOf`. */
type Word = { text: string; startChar: number; endChar: number };

type AccentSpan = { firstWord: number; lastWord: number };

export function HeadlineField({
  headline,
  accentPhrase,
  paletteId,
  onChange,
}: {
  headline: string;
  accentPhrase: string;
  paletteId: PaletteId;
  onChange: (patch: { headline?: string; accentPhrase?: string }) => void;
}) {
  const fieldId = useId();
  const words = splitWords(headline);
  const span = findSpan(words, headline, accentPhrase);
  const isOverLimit = words.length > HEADLINE_WORD_LIMIT;
  const palette = PALETTE_BY_ID[paletteId];

  const editHeadline = (next: string) => {
    const stale = accentPhrase.trim() && !next.includes(accentPhrase.trim());

    onChange({ headline: next, ...(stale && { accentPhrase: "" }) });
  };

  const toggleWord = (index: number) => {
    const next = spanAfterTapping(span, index);

    onChange({
      accentPhrase: next
        ? headline.slice(
            words[next.firstWord].startChar,
            words[next.lastWord].endChar
          )
        : "",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label className="text-xs sm:text-sm" htmlFor={fieldId}>
          Headline (required)
        </Label>
        <span
          className={cn(
            "font-inter text-[0.625rem] tabular-nums sm:text-xs",
            isOverLimit ? "text-fg-danger" : "text-fg-tertiary"
          )}
        >
          {words.length}/{HEADLINE_WORD_LIMIT} words
        </span>
      </div>

      <Textarea
        aria-required="true"
        className="field-sizing-content max-h-24 min-h-0 resize-none rounded-sm px-3 py-1.5 text-xs sm:text-[0.8125rem]"
        id={fieldId}
        onChange={(event) => editHeadline(event.target.value)}
        placeholder="Frontend engineer building..."
        rows={2}
        value={headline}
      />

      {isOverLimit && (
        <p className="text-fg-danger text-xs">
          The spec cuts long headlines rather than shrinking them.
        </p>
      )}

      {words.length > 0 && (
        <fieldset className="pt-1">
          <legend className="mb-1.5 text-fg-tertiary text-xs">
            Pick the words printed in the accent colour (required). Pick again
            to clear.
          </legend>

          <div className="flex flex-wrap gap-1">
            {words.map((word, index) => {
              const accented = span
                ? index >= span.firstWord && index <= span.lastWord
                : false;

              return (
                <button
                  aria-pressed={accented}
                  className={cn(
                    "cursor-pointer rounded-xs border px-1.5 py-0.5 text-xs transition duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
                    accented
                      ? "border-transparent font-medium"
                      : "border-outline-default/60 bg-bg-default-alt text-fg-secondary hover:bg-bg-accent hover:text-fg-default"
                  )}
                  key={`${word.startChar}-${word.text}`}
                  onClick={() => toggleWord(index)}
                  style={
                    accented
                      ? {
                          backgroundColor: palette.accent,
                          color: palette.field,
                        }
                      : undefined
                  }
                  type="button"
                >
                  {word.text}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}

function splitWords(headline: string): Word[] {
  const words: Word[] = [];

  for (const match of headline.matchAll(WORD)) {
    words.push({
      text: match[0],
      startChar: match.index,
      endChar: match.index + match[0].length,
    });
  }

  return words;
}

function findSpan(
  words: Word[],
  headline: string,
  accentPhrase: string
): AccentSpan | null {
  const phrase = accentPhrase.trim();
  const at = phrase ? headline.indexOf(phrase) : -1;

  if (at === -1) {
    return null;
  }

  const end = at + phrase.length;
  const covered = words.flatMap((word, index) =>
    word.startChar >= at && word.endChar <= end ? index : []
  );

  if (covered.length === 0) {
    return null;
  }

  return { firstWord: covered[0], lastWord: covered[covered.length - 1] };
}

function spanAfterTapping(
  span: AccentSpan | null,
  word: number
): AccentSpan | null {
  if (!span) {
    return { firstWord: word, lastWord: word };
  }

  if (word < span.firstWord) {
    return { firstWord: word, lastWord: span.lastWord };
  }

  if (word > span.lastWord) {
    return { firstWord: span.firstWord, lastWord: word };
  }

  const isLoneWord = span.firstWord === span.lastWord;

  return isLoneWord ? null : { firstWord: word, lastWord: word };
}

const WORD = /\S+/g;
