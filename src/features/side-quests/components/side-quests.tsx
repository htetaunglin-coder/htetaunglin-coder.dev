import {
  FadeAnimation,
  FadeStaggeredAnimation,
} from "@/components/animations/fade-animation";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { ImageViewer, type ImageViewerProps } from "@/components/image-viewer";
import { PageHeroImage } from "@/components/page-hero-image";
import { NavLink } from "@/components/ui/nav-link";

const Views: ImageViewerProps["images"] = [
  {
    id: "1",
    width: 840,
    height: 840,
    alt: "Yangon Thamwe view",
    src: "view_mlpsp9.jpg",
  },
  {
    id: "2",
    width: 480,
    height: 480,
    alt: "Holding a drink near Kyauk Myaung market, Yangon",
    src: "view_ijgvw1.jpg",
  },
  {
    id: "3",
    width: 480,
    height: 480,
    alt: "Morning breakfast with samosa and tea",
    src: "view_vw9iph.jpg",
  },
  {
    id: "4",
    width: 840,
    height: 840,
    alt: "Unfinished building somewhere in Yangon",
    src: "view_oylmi1.jpg",
  },
  {
    id: "5",
    width: 480,
    height: 480,
    alt: "Dog sitting on a car engine - only in Myanmar :3",
    src: "view_ajpomu.jpg",
  },
  // {
  //   id: "6",
  //   width: 840,
  //   height: 840,
  //   alt: "Mandalay pagoda view",
  //   src: "view_vh1gu5.jpg",
  // },
];

const SideQuests = () => (
  <>
    <PageHeroImage
      alt="Shorts"
      imageClassName="object-top"
      imageContainerClassName="-mr-28 w-md md:block hidden"
      src="illustration_dgkvnf.png"
    />

    <div className="mx-auto w-full max-w-4xl px-6 lg:px-0">
      <FadeStaggeredAnimation className="w-full max-w-xl" direction="up">
        <h1 className="bg-gradient-to-br from-black to-fg-tertiary bg-clip-text font-bold font-inter text-3xl/[1.2] text-transparent tracking-tight sm:text-4xl/[1.2] md:font-extrabold md:text-5xl/[1.2] dark:from-fg-default dark:to-fg-tertiary/80">
          SideQuests
        </h1>
        <p className="mt-2 font-medium text-base text-neutral-900/80 tracking-tight sm:max-w-xl sm:text-lg/normal dark:text-fg-tertiary">
          Just hobbies and small habits that keep me growing, curious, and
          balanced. Some of them started as escape, some as passion — but all of
          them helped me understand myself a little more.
        </p>
      </FadeStaggeredAnimation>
    </div>

    <div className="relative mt-12 w-full sm:mt-16">
      <DashedDivider className="absolute inset-x-0 top-0 opacity-40 dark:opacity-20" />

      <div className="blog mx-auto w-full max-w-4xl px-6 sm:pt-4 lg:px-0">
        <div className="prose dark:prose-invert max-w-none">
          <FadeAnimation as="div" direction="up">
            <section className="py-12 sm:py-16" id="why-i-added-this-page">
              <h2 className="!mt-0">
                <NavLink href="#why-i-added-this-page">
                  Why I Added This Page
                </NavLink>
              </h2>
              <p>
                I added this page to give my website a bit more personality, a
                place to show what my life really looks like beyond projects and
                skills.
              </p>
              <p>
                These days, AI can make anything sound perfect, but sometimes
                this perfection hide the person who write it. I want to do the
                opposite, write things myself. You might notice the writing is a
                little rough, because I wrote it by myself.
              </p>
              <p>
                It may or may not be good, but at least it's something that I
                put in effort to write it on my own.
              </p>
            </section>
          </FadeAnimation>

          <FadeAnimation as="div" direction="up">
            <section className="py-12 sm:py-16" id="gym">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-8">
                <div className="flex-grow">
                  <h2 className="mt-0">
                    <NavLink href="#gym">
                      GYM{" "}
                      <span className="font-gloria-hallelujah font-normal text-fg-tertiary/80 italic tracking-normal">
                        / WorkingOut
                      </span>
                    </NavLink>
                  </h2>
                  <p>
                    I started going to the gym when I was 17 with a few friends.
                    Back then, I was really skinny, around 85 lbs. I
                    couldn&apos;t even do a single push-up at first.
                  </p>
                  <p>
                    But I kept going. Over time, I started eating a bit more and
                    training regularly. Now I&apos;m 115 lbs, and I can do
                    one-arm push-ups for reps. It might not sound like much to
                    some people, but I&apos;m really proud of it. It reminds me
                    how small, consistent steps can slowly change you, both
                    physically and mentally.
                  </p>
                  <p>
                    And here is a video of me doing one-arm push-ups. It&apos;s
                    still far from perfect, but it shows how far I&apos;ve come.
                  </p>
                </div>
                <div className="relative aspect-[33.75/60] w-72 shrink-0 overflow-hidden rounded-lg bg-bg-tertiary">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 size-full border-0 outline-none"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src="https://www.youtube.com/embed/nF0QQPmnd10?si=7_QJIVixkiMI9hYA"
                    title="YouTube video player"
                  />
                </div>
              </div>
            </section>
          </FadeAnimation>

          <FadeAnimation as="div" direction="up">
            <section className="py-12 sm:py-16" id="guitar">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-8">
                <div className="flex-grow">
                  <h2 className="mt-0">
                    <NavLink href="#guitar">
                      Guitar{" "}
                      <span className="font-gloria-hallelujah font-normal text-fg-tertiary/80 italic tracking-normal">
                        / Singing
                      </span>
                    </NavLink>
                  </h2>
                  <p>
                    My dad used to be a singer when he was young. Because of
                    life&apos;s circumstances, he had to give up that dream, but
                    he still sings as a hobby now. Every time he sings, I listen
                    and can&apos;t help but wish I could sing like him.
                  </p>
                  <p>
                    When I was 16, on my birthday, after a few small talks, he
                    bought me my first guitar and taught me the basic chords.
                    From that moment, I fell in love with it. Being able to play
                    what I want and sing along felt magical.
                  </p>
                  <p>
                    But honestly… my voice is pretty unpleasant to hear 😅, so
                    instead of singing, I started learning fingerstyle guitar,
                    playing melody and chords together. Now I can play songs
                    like{" "}
                    <NavLink
                      className="text-fg-brand italic"
                      href="https://www.youtube.com/watch?v=JYuyWrkwpok&list=RDJYuyWrkwpok&start_radio=1"
                      rel="noopener"
                      target="_blank"
                    >
                      Fly Me to the Moon
                    </NavLink>
                    , and I still feel the same joy every time I touch the
                    strings.
                  </p>
                </div>

                <div className="relative aspect-[33.75/60] w-72 shrink-0 overflow-hidden rounded-lg bg-bg-tertiary">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 size-full border-0 outline-none"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src="https://www.youtube.com/embed/YhGbuhJ3Ipg?si=UxRfavyGlE3hzYsR"
                    title="Fly Me To The Moon Guitar Fingerstyle"
                  />
                </div>
              </div>
            </section>
          </FadeAnimation>

          <FadeAnimation as="div" direction="up">
            <section className="py-12 sm:py-16" id="nature">
              <div className="flex flex-col gap-4">
                <div className="flex-grow">
                  <h2 className="mt-0">
                    <NavLink href="#nature">
                      Touch Grass{" "}
                      <span className="font-gloria-hallelujah font-normal text-fg-tertiary/80 italic tracking-normal">
                        / Nature
                      </span>
                    </NavLink>
                  </h2>
                  <p>
                    To be honest, I&apos;m probably one of the nerdiest people
                    you&apos;ll ever meet. I barely go outside, except for the
                    gym or work. Most of the time, I&apos;m coding, doing
                    housework, playing chess, or working out. That&apos;s my
                    whole life.
                  </p>
                  <p>
                    But it reached a point where I started feeling burned out
                    and empty. Sometimes, I lost all motivation, like nothing
                    mattered anymore.
                  </p>
                  <p>
                    Then last year (2024), I watched a talk by{" "}
                    <NavLink
                      className="font-gloria-hallelujah text-fg-brand italic tracking-normal"
                      href="https://www.youtube.com/watch?v=W5SKxUwvJN0"
                      rel="noopener"
                      target="_blank"
                    >
                      Dr. K (HealthyGamerGG){" "}
                    </NavLink>{" "}
                    about loneliness. It completely changed how I see being
                    alone. After that, I started going outside more, just
                    walking, looking around, and appreciating small things like
                    trees and sky.
                  </p>
                  <p>
                    I still feel lonely sometimes, but hey, the good thing is
                    that at least I don&apos;t feel that way all the time,
                    right?
                  </p>
                  <p>By the way, here are some photos I took!</p>
                </div>
                <ImageViewer images={Views} />
              </div>
            </section>
          </FadeAnimation>

          <FadeAnimation as="div" direction="up">
            <section className="py-12 sm:py-16" id="whats-next">
              <div className="flex-grow">
                <h2 className="mt-0">
                  <NavLink href="#whats-next">
                    What&apos;s Next?{" "}
                    <span className="font-gloria-hallelujah font-normal text-fg-tertiary/80 italic tracking-normal">
                      / Future Plans
                    </span>
                  </NavLink>
                </h2>
                <p>
                  Obviously, as you can see, my English isn&apos;t perfect yet,
                  but I&apos;m working on improving all four skills. It&apos;s
                  funny because I&apos;ve been learning English my whole life
                  and I&apos;m still not that good at it. If you ever notice
                  something in my writing that could be improved, please let me
                  know, I&apos;d really appreciate it. One day, I hope to
                  communicate confidently and fluently.
                </p>
                <p>
                  Also, a big thanks to{" "}
                  <NavLink
                    className="font-gloria-hallelujah text-fg-brand italic tracking-normal"
                    href="https://chatgpt.com"
                  >
                    ChatGPT{" "}
                  </NavLink>{" "}
                  for helping me check my writing. I still make mistakes, but
                  using it helps me get better and feel more confident.
                </p>
                <p>
                  Looking ahead, I want to work with more people on challenging
                  web development projects to gain experience and grow. I also
                  hope to share more about technologies, life lessons, and the
                  things that keep me going.
                </p>
              </div>
            </section>
          </FadeAnimation>
        </div>
      </div>
    </div>
  </>
);

export { SideQuests };

//  <div className="-z-1 absolute inset-x-0 bottom-24 flex h-112 w-full items-center justify-center overflow-hidden bg-black">
//   {/* <div className="relative h-full w-full"> */}
//   <div className="relative h-full w-lg">
//     <Image
//       alt="Shorts"
//       className="object-cover object-top"
//       fill
//       src="/d011e436-eb6a-4070-9078-1e1b7c7ae018-Photoroom.png"
//       style={{
//         maskImage: "linear-gradient(to right, #000 65%, transparent)",
//         WebkitMaskImage: "linear-gradient(to right, #000 65%, transparent)",
//       }}
//     />
//     {/* </div> */}
//   </div>

//   <div className="absolute inset-x-0 top-0 h-112 w-full bg-gradient-to-t from-10% from-bg-default/5 to-100% to-bg-default" />
// </div>;
