import { FadeStaggeredAnimation } from "@/components/animations/fade-animation";
import Comment from "@/components/comment";

const GuestBook = () => (
  <main className="pt-24 pb-28 md:pt-32">
    <section className="mx-auto w-full max-w-4xl">
      <div className="px-6 lg:px-0">
        <FadeStaggeredAnimation className="max-w-xl" direction="up">
          <h1 className="bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-extrabold font-inter text-4xl/[1.2] text-transparent tracking-tight sm:text-5xl/[1.2] dark:to-fg-tertiary/80">
            Guest Book
          </h1>
          <p className="mt-2 text-base text-fg-tertiary sm:text-lg">
            Write anything you&apos;d like — feedback, appreciation, or a quick
            hello.
          </p>
        </FadeStaggeredAnimation>
        <div className="mt-8 mb-16 h-px w-full select-none bg-outline-accent sm:mt-12 sm:mb-20" />
      </div>

      <div className="min-h-[28rem]">
        <Comment />
      </div>
    </section>
  </main>
);

export default GuestBook;
