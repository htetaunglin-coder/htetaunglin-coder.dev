import { DotGrid } from "./dot-grid";
import {
  DESIGN_SYSTEM_SKETCH,
  SKILLS_SKETCH,
  type SketchLayer,
} from "./workshop-sketch-art";

type WorkshopIllustrationProps = {
  className?: string;
};

/* Offsets are viewBox units, right- and down-positive. `fadeCentre` does not
   follow them — leave it behind and the mask crops the side the art drifts to. */
export type Placement = {
  offsetX: number;
  offsetY: number;
  fadeCentre: string;
};

type Fit = "cover" | "contain";

const ASPECT: Record<Fit, string> = {
  cover: "xMidYMax slice",
  contain: "xMidYMid meet",
};

const VIEW_BOX = "0 0 180 176";

const STROKE_WIDTH = 0.95;

const PORTRAIT_INK = "#8f8bb4";

/* Whatever sits behind the drawing. Anything else and the fills that hide the
   layers below show as slabs. */
const DEFAULT_SURFACE = "var(--color-bg-default-alt)";

const PLACEMENT: Record<"skills" | "designSystem", Placement> = {
  skills: { fadeCentre: "50% 72%", offsetX: 20, offsetY: 10 },
  designSystem: { fadeCentre: "50% 68%", offsetX: 40, offsetY: -2 },
};

export function SkillsIllustration({ className }: WorkshopIllustrationProps) {
  return (
    <SketchDrawing
      className={className}
      layers={SKILLS_SKETCH}
      placement={PLACEMENT.skills}
    />
  );
}

export function DesignSystemIllustration({
  className,
}: WorkshopIllustrationProps) {
  return (
    <SketchDrawing
      className={className}
      layers={DESIGN_SYSTEM_SKETCH}
      placement={PLACEMENT.designSystem}
    />
  );
}

export function SketchDrawing({
  layers,
  placement,
  fit = "cover",
  surface = DEFAULT_SURFACE,
  className,
}: {
  layers: SketchLayer[];
  placement: Placement;
  fit?: Fit;
  surface?: string;
  className?: string;
}) {
  const { offsetX, offsetY, fadeCentre } = placement;

  return (
    <span className={className}>
      {/* Brighter than DotGrid's default because the tile dims this whole layer. */}
      <DotGrid
        className="opacity-40 dark:opacity-30"
        fade={radialFade(fadeCentre, "30%", "78%")}
      />

      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio={ASPECT[fit]}
        style={maskStyle(radialFade(fadeCentre, "42%", "82%"))}
        viewBox={VIEW_BOX}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(${offsetX} ${offsetY})`}
        >
          {layers.map((layer) => (
            <SketchPath key={layer.id} layer={layer} surface={surface} />
          ))}
        </g>
      </svg>
    </span>
  );
}

function SketchPath({
  layer,
  surface,
}: {
  layer: SketchLayer;
  surface: string;
}) {
  if (layer.kind === "surface") {
    return <path d={layer.path} fill={surface} />;
  }

  if (layer.kind === "wash") {
    return (
      <path d={layer.path} fill={PORTRAIT_INK} fillOpacity={layer.opacity} />
    );
  }

  return (
    <path
      d={layer.path}
      stroke={PORTRAIT_INK}
      strokeDasharray={layer.dash}
      strokeOpacity={layer.opacity}
      strokeWidth={STROKE_WIDTH}
    />
  );
}

const radialFade = (centre: string, opaqueTo: string, clearAt: string) =>
  `radial-gradient(circle at ${centre}, black ${opaqueTo}, transparent ${clearAt})`;

const maskStyle = (image: string) => ({
  WebkitMaskImage: image,
  maskImage: image,
});
