/* biome-ignore-all lint/performance/noImgElement: off */
/* biome-ignore-all lint/suspicious/useAwait:off */
/* biome-ignore-all lint/a11y/noSvgWithoutTitle:off */
import { ImageResponse } from "next/og";
import { getCldImageUrl } from "next-cloudinary";

const avatarUrl = getCldImageUrl({
  src: "htet_aung_lin.jpg",
  width: 80,
  height: 80,
});

// I might need to generate OG images at build time,
// since the free tier on Vercel could hit its limits later.
// But right now, I don't have the mental bandwidth for that.
// Maybe something to revisit in the future.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const imageUrl = searchParams.get("img_url");
  const isBlogPost = searchParams.get("blog") === "true";

  const coverImage = getCldImageUrl({
    src: imageUrl ? imageUrl : "htet_aung_lin.jpg",
    width: 360,
  });

  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-between bg-[#151515] p-16">
      <img
        alt="logo"
        height="630"
        src={coverImage}
        style={{
          objectFit: "cover",
          top: "0",
          right: "0",
          width: "360px",
          height: "630px",
        }}
        tw="absolute right-0"
        width="360"
      />

      <div
        style={{
          width: "360px",
          height: "630px",
          position: "absolute",
          background: "linear-gradient(to right, #151515, #15151533)",
          top: "0",
          right: "0",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "1200px",
          height: "630px",
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      <div style={{ gap: 12 }} tw="flex max-w-2xl flex-col">
        <div tw="font-semibold text-5xl text-neutral-100 tracking-[-0.03em]">
          {title}
        </div>
        {description && (
          <p
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            tw="text-balance font-medium text-[36px] text-neutral-400 tracking-tight"
          >
            {description}
          </p>
        )}
      </div>

      <div style={{ gap: 12 }} tw="flex items-center">
        {isBlogPost && (
          <img
            alt="logo"
            height="80"
            src={avatarUrl}
            tw="size-20 rounded-full"
            width="80"
          />
        )}

        <div tw="flex flex-col">
          {isBlogPost && (
            <div tw="font-medium text-neutral-200 text-xl">Htet Aung Lin</div>
          )}

          <div
            style={{
              display: "flex",
            }}
            tw={isBlogPost ? "w-16 h-12" : "w-32 h-18"}
          >
            <svg
              fill="none"
              height="246"
              style={{
                width: "100%",
                height: "100%",
              }}
              viewBox="0 0 439 246"
              width="439"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.00058 107.343C21.6672 111.01 66.9006 117.243 98.5006 112.843C130.101 108.443 266.667 72.343 331.001 54.843C352.334 48.5096 400.401 31.343 422.001 13.343"
                stroke="#8F8BB4"
                strokeLinecap="round"
                strokeWidth={isBlogPost ? "10" : "8"}
              />
              <path
                d="M64.5006 57.843C75.3339 107.01 97.2006 208.443 98.0006 220.843C99.0006 236.343 107.501 259.843 111.501 223.843C111.834 215.176 112.301 196.143 111.501 189.343C112.001 180.176 116.101 160.343 128.501 154.343C130.834 152.51 135.601 154.343 136.001 176.343C137.167 187.343 143.201 211.643 158.001 220.843C165.501 223.843 183.201 224.943 194.001 205.343C200.001 193.176 204.001 158.343 203.501 118.843C203.001 79.343 204.301 32.743 191.501 18.343C186.501 11.1763 177.101 5.84296 179.501 41.843C181.258 64.343 188.001 112.343 194.001 126.343C200.501 142.676 210.501 164.343 215.001 173.343C219.501 182.343 234.501 195.843 248.501 173.843C257.334 157.843 271.601 120.843 258.001 100.843C254.334 97.5096 246.601 95.143 245.001 112.343C242.334 126.843 241.301 160.343 258.501 178.343C261.501 181.51 269.401 185.243 277.001 174.843C282.501 165.176 294.401 143.043 298.001 131.843C304.667 103.01 314.501 37.343 300.501 5.34296C298.501 0.842961 294.701 -0.25704 295.501 31.343C295.667 60.1763 297.801 120.643 305.001 131.843C311.167 143.51 332.001 162.68 366.001 161.343C395.667 160.176 450.401 150.243 432.001 119.843"
                stroke="#8F8BB4"
                strokeLinecap="round"
                strokeWidth={isBlogPost ? "10" : "8"}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 628,
    }
  );
}
