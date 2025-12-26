import type { Metadata } from "next";
import {
  FadeAnimation,
  FadeStaggeredAnimation,
} from "@/components/animations/fade-animation";
import { Footer } from "@/components/footer";
import { BlogPostShowcase } from "@/features/blog/components/blog-post-showcase";
import { blogSource } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Blog posts about psychology, life, and technical topics. Sharing what I'm learning and thinking about.",
  alternates: {
    canonical: absoluteUrl("/blog"),
  },
  openGraph: {
    title: "Blog | Htet Aung Lin",
    description:
      "Blog posts about psychology, life, and technical topics. Sharing what I'm learning and thinking about.",
    url: absoluteUrl("/blog"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog | Htet Aung Lin",
    description:
      "Blog posts about psychology, life, and technical topics. Sharing what I'm learning and thinking about.",
  },
};

export default function Home() {
  const posts = blogSource.getPages();

  return (
    <>
      <main className="pt-16 pb-28 sm:pt-24 md:pt-32">
        <section className="mx-auto w-full max-w-4xl">
          <div className="px-6 lg:px-0">
            <FadeStaggeredAnimation className="max-w-xl" direction="up">
              <h1 className="bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-extrabold font-inter text-4xl/[1.2] text-transparent tracking-tight sm:text-5xl/[1.2] dark:to-fg-tertiary/80">
                Blogs
              </h1>
              <p className="mt-2 text-base text-fg-tertiary sm:text-lg">
                This is my blog. I write about psychology, life, and technical
                topics. Just sharing what I&apos;m learning and thinking about.
              </p>
            </FadeStaggeredAnimation>
            <div className="mt-8 mb-16 h-px w-full select-none bg-outline-accent sm:mt-12 sm:mb-20" />
          </div>

          <div className="space-y-24 px-6 sm:space-y-12 md:space-y-32 lg:px-0">
            {posts.map((post, index) => (
              <FadeAnimation
                as="div"
                delay={index === 0 ? 0.75 : 0}
                direction="up"
                key={post.url}
              >
                <BlogPostShowcase post={post} />
              </FadeAnimation>
            ))}
          </div>
        </section>
      </main>

      <div className="flex w-full justify-center">
        <Footer className="max-w-4xl px-6" />
      </div>
    </>
  );
}
