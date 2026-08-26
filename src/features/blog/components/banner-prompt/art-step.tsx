"use client";

import { useId } from "react";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BannerAnswers } from "../../lib/banner-prompt/compile";
import {
  ART_DIRECTIONS,
  ART_FAMILIES,
  type ArtDirectionId,
  type ArtFamilyId,
  EFFECTS,
  type EffectId,
} from "../../lib/banner-prompt/options";
import { CodeLabel } from "./option-field";
import { GRAIN } from "./visuals";

export function ArtStep({
  answers,
  onPatch,
}: {
  answers: BannerAnswers;
  onPatch: (next: Partial<BannerAnswers>) => void;
}) {
  const selectFamily = (family: ArtFamilyId) => {
    const directions = ART_DIRECTIONS.filter((one) => one.family === family);
    const next = directions.find((one) => one.recommended) ?? directions[0];

    onPatch({ artFamilyId: family, artDirectionId: next.id });
  };

  return (
    <div className="space-y-6">
      {/* The two families are a set the directions belong to, so a tab panel
        draws that boundary — two loose controls read as two questions. */}
      <Tabs
        onValueChange={(value) => selectFamily(value as ArtFamilyId)}
        value={answers.artFamilyId}
        variant="line"
      >
        <TabsList className="gap-2 sm:gap-4">
          {ART_FAMILIES.map((family) => (
            <TabsTrigger
              className="text-xs sm:text-sm"
              key={family.id}
              value={family.id}
            >
              {family.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ART_FAMILIES.map((family) => (
          <TabsContent key={family.id} value={family.id}>
            <DirectionField
              familyId={family.id}
              onChange={(value) => onPatch({ artDirectionId: value })}
              value={answers.artDirectionId}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Outside the tab panels: neither control is family-specific, and inside
        them a family switch unmounts the panel and collapses the disclosure the
        reader just opened. */}
      <ArtTweaks answers={answers} onPatch={onPatch} />
    </div>
  );
}

/**
 * Contained, not cropped: the silhouette is what tells the directions apart, so
 * a head-and-shoulders crop would make standing, seated and winged read alike.
 */
function DirectionArt({ id, src }: { id: ArtDirectionId; src: string }) {
  return (
    <>
      <span
        className={cn(
          "-bottom-16 -right-4 absolute top-4 w-2/3",
          id === "A6" && "-bottom-12"
        )}
      >
        <CloudinaryImage
          alt=""
          className="object-contain object-bottom opacity-60 blur-[1.5px]"
          fill
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 150px"
          src={src}
        />
      </span>
      {/* Solid at both ends where the text sits, a veil through the middle. Uses
        the card's own colour, so it inverts with the theme. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-bg-default-alt/50 via-bg-default-alt/40 to-bg-default-alt"
      />
      {/* Last, so the grain reads as one film over the tile. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: GRAIN }}
      />
    </>
  );
}

/** Both optional refinements to the chosen artwork, behind one disclosure. */
function ArtTweaks({
  answers,
  onPatch,
}: {
  answers: BannerAnswers;
  onPatch: (next: Partial<BannerAnswers>) => void;
}) {
  const noteId = useId();

  return (
    <details className="rounded-sm border border-outline-default/60 bg-bg-default-alt px-3 py-2">
      <summary className="cursor-pointer font-medium text-fg-default text-sm marker:text-fg-tertiary">
        Fine-tune the artwork{" "}
        <span className="font-normal text-fg-tertiary text-xs">optional</span>
      </summary>

      <div className="mt-3 space-y-6">
        <EffectField
          onChange={(value) => onPatch({ effectId: value })}
          value={answers.effectId}
        />

        <div className="space-y-2">
          <Label
            className="font-medium text-fg-default text-sm"
            htmlFor={noteId}
          >
            In your own words
          </Label>
          <Textarea
            className="min-h-16 text-sm"
            id={noteId}
            onChange={(event) => onPatch({ customArtNote: event.target.value })}
            placeholder="Cooler light, a heavier drape, a calmer pose."
            value={answers.customArtNote}
          />
          <p className="text-fg-tertiary text-xs">
            Describe general visual qualities. Naming a living artist or a
            copyrighted work will not work — the prompt tells the model to
            ignore it.
          </p>
        </div>
      </div>
    </details>
  );
}

/** Image tiles: the silhouette carries the choice, so the label and its code
  ride over the art rather than beside it. One group per family, so each keeps a
  distinct heading id for its own tab panel. */
function DirectionField({
  familyId,
  value,
  onChange,
}: {
  familyId: ArtFamilyId;
  value: ArtDirectionId;
  onChange: (value: ArtDirectionId) => void;
}) {
  const headingId = useId();
  const directions = ART_DIRECTIONS.filter((one) => one.family === familyId);

  return (
    <section>
      <h4 className="font-medium text-fg-default text-sm" id={headingId}>
        Pose and framing
      </h4>
      <RadioGroup
        aria-labelledby={headingId}
        // Two across from mobile, three from lg — the image tiles pair fine on a
        // phone, unlike the 1 → 2 → 3 ramp `columns` would give.
        className="mt-3 grid-cols-2 lg:grid-cols-3"
        onValueChange={(next) => onChange(next as ArtDirectionId)}
        value={value}
      >
        {directions.map((direction) => (
          <RadioGroupCard
            className="border-outline-default/60"
            description={direction.description}
            key={direction.id}
            label={<CodeLabel code={direction.id}>{direction.label}</CodeLabel>}
            value={direction.id}
            variant="tile"
          >
            {direction.image && (
              <DirectionArt id={direction.id} src={direction.image.src} />
            )}
          </RadioGroupCard>
        ))}
      </RadioGroup>
    </section>
  );
}

/** Plain cards: no thumbnail, so each description sits inline under its label. */
function EffectField({
  value,
  onChange,
}: {
  value: EffectId;
  onChange: (value: EffectId) => void;
}) {
  const headingId = useId();

  return (
    <section>
      <h4 className="font-medium text-fg-default text-sm" id={headingId}>
        Edge effect
      </h4>
      <p className="mt-1 text-fg-tertiary text-xs">
        How one side of the figure meets the background. The rest stays sharp.
      </p>
      <RadioGroup
        aria-labelledby={headingId}
        className="mt-3"
        columns={3}
        onValueChange={(next) => onChange(next as EffectId)}
        value={value}
      >
        {EFFECTS.map((effect) => (
          <RadioGroupCard
            className="border-outline-default/60"
            description={effect.description}
            key={effect.id}
            label={<CodeLabel code={effect.id}>{effect.label}</CodeLabel>}
            value={effect.id}
          />
        ))}
      </RadioGroup>
    </section>
  );
}
