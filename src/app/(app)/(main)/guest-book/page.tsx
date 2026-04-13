import type { Metadata } from "next";
import { FadeStaggeredAnimation } from "@/components/animations/fade-animation";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { Comment } from "@/components/comment";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Guest Book",
  description:
    "Write anything you'd like — feedback, appreciation, or a quick hello.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: absoluteUrl("/guest-book"),
  },
};

const GuestBook = () => (
  <main className="pt-16 pb-52 sm:pt-24 md:pt-28">
    <section className="mx-auto w-full max-w-4xl px-6 text-center lg:px-0">
      <FadeStaggeredAnimation className="mx-auto max-w-xl" direction="up">
        <h1 className="bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-bold font-inter text-3xl/[1.2] text-transparent tracking-tight sm:text-4xl/[1.2] md:font-extrabold md:text-5xl/[1.2]">
          Guest Book
        </h1>
        <p className="mt-2 font-medium text-base text-neutral-900/80 tracking-tight sm:max-w-xl sm:text-lg/normal dark:text-fg-tertiary">
          Write anything you&apos;d like — feedback, appreciation, or a quick
          hello.
        </p>
      </FadeStaggeredAnimation>
      <DashedDivider className="mt-8 mb-16 w-full select-none opacity-40 sm:mt-12 sm:mb-20 dark:opacity-20" />

      <div className="min-h-[28rem]">
        <Comment />
      </div>
    </section>
    <div className="-z-1 -bottom-20 fixed inset-x-0 flex h-[75vh] w-full items-end justify-center overflow-hidden">
      <div className="relative h-2/3 w-120">
        <CloudinaryImage
          alt="Shorts"
          className="mask-b-from-20% mask-b-to-95% object-contain object-top"
          fill
          src="illustration_b7yady.png"
        />
      </div>
    </div>
  </main>
);

export default GuestBook;
