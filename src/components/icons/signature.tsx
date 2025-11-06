import { cn } from "@/lib/utils";

export const Signature = ({
  className,
  animate = false,
  ...props
}: React.HTMLAttributes<SVGElement> & { animate?: boolean }) => (
  <>
    {animate && (
      <style>
        {`       
          #signature-path-1 {
            stroke-dasharray: 437;
            stroke-dashoffset: 437;
            animation: sign-animation 0.25s ease 1.25s forwards;
          }

          @keyframes sign-animation {
            to {
              stroke-dashoffset: 0;
            }
          }

          #signature-path-2 {
            stroke-dasharray: 1482;
            stroke-dashoffset: 1482;
            animation: sign-animation-bounce 1.5s ease forwards;
          }

          @keyframes sign-animation-bounce {
            0% {
              stroke-dashoffset: 1482;
            }

            4% {
              stroke-dashoffset: 1450;
            }

            8% {
              stroke-dashoffset: 1380;
            }

            10% {
              stroke-dashoffset: 1370;
            }

            12% {
              stroke-dashoffset: 1320;
            }

            16% {
              stroke-dashoffset: 1280;
            }

            20% {
              stroke-dashoffset: 1200;
            }

            24% {
              stroke-dashoffset: 1180;
            }

            28% {
              stroke-dashoffset: 1120;
            }

            36% {
              stroke-dashoffset: 1080;
            }

            46% {
              stroke-dashoffset: 1050;
            }

            64% {
              stroke-dashoffset: 800;
            }

            76% {
              stroke-dashoffset: 500;
            }

            100% {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    )}
    <svg
      className={cn("signature h-auto w-full", className)}
      fill="none"
      height={246}
      viewBox="0 0 439 246"
      width={439}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Signature</title>
      <path
        d="M3.00058 107.343C21.6672 111.01 66.9006 117.243 98.5006 112.843C130.101 108.443 266.667 72.343 331.001 54.843C352.334 48.5096 400.401 31.343 422.001 13.343"
        id={animate ? "signature-path-1" : ""}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={6}
      />
      <path
        d="M64.5006 57.843C75.3339 107.01 97.2006 208.443 98.0006 220.843C99.0006 236.343 107.501 259.843 111.501 223.843C111.834 215.176 112.301 196.143 111.501 189.343C112.001 180.176 116.101 160.343 128.501 154.343C130.834 152.51 135.601 154.343 136.001 176.343C137.167 187.343 143.201 211.643 158.001 220.843C165.501 223.843 183.201 224.943 194.001 205.343C200.001 193.176 204.001 158.343 203.501 118.843C203.001 79.343 204.301 32.743 191.501 18.343C186.501 11.1763 177.101 5.84296 179.501 41.843C181.258 64.343 188.001 112.343 194.001 126.343C200.501 142.676 210.501 164.343 215.001 173.343C219.501 182.343 234.501 195.843 248.501 173.843C257.334 157.843 271.601 120.843 258.001 100.843C254.334 97.5096 246.601 95.143 245.001 112.343C242.334 126.843 241.301 160.343 258.501 178.343C261.501 181.51 269.401 185.243 277.001 174.843C282.501 165.176 294.401 143.043 298.001 131.843C304.667 103.01 314.501 37.343 300.501 5.34296C298.501 0.842961 294.701 -0.25704 295.501 31.343C295.667 60.1763 297.801 120.643 305.001 131.843C311.167 143.51 332.001 162.68 366.001 161.343C395.667 160.176 450.401 150.243 432.001 119.843"
        id={animate ? "signature-path-2" : ""}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={6}
      />
    </svg>
  </>
);
