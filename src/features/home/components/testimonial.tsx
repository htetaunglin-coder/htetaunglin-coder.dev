"use client";

import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { CloudinaryAvatar } from "@/components/cloudinary-avatar";
import { DashedLine } from "@/components/decorations/dashed-line";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;
const TRUNCATE_AT = 320;

const truncate = (text: string, max: number) => {
  if (text.length <= max) {
    return text;
  }
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
};

type TestimonialData = {
  id: string;
  author: {
    name: string;
    role: string;
    url: string;
    company?: string;
    avatar?: string;
  };
  content: string;
};

const TESTIMONIALS: readonly TestimonialData[] = [
  // Page 1: strongest, most varied proof. All have photos.
  {
    id: "moe-pwint-phyu",
    author: {
      name: "Moe Pwint Phyu",
      role: "Technical Department Lead",
      company: "TalentOS",
      avatar: "moe_pwint_phyu.png",
      url: "https://www.linkedin.com/in/moe-pwint-phyu",
    },
    content:
      "I worked with Ko Htet Aung Lin (Kelvin) on the TalentOS Employer Dashboard, and he is one of the most detail-oriented developers I've worked with. The interfaces he builds are consistently clean and intuitive. He plans his work effectively, delivers consistently, and maintains a high level of productivity without compromising code quality.",
  },
  {
    id: "wai-yan-phone-aant",
    author: {
      name: "Wai Yan Phone Aant",
      role: "Full Stack Developer",
      company: "Pico",
      avatar: "wai_yan_phone_aant.jpg",
      url: "https://waiyanphoneaant.com",
    },
    content:
      "Htet Aung Lin's creativity in front-end development is truly impressive. He has a great sense of design aesthetics and always ensures a high standard of quality. From a backend perspective, I've always appreciated how easy it is to communicate and negotiate technical solutions with him.",
  },
  {
    id: "zuly-hein",
    author: {
      name: "Zuly Hein",
      role: "Operations",
      company: "TalentOS",
      avatar: "judy.jpg",
      url: "https://www.linkedin.com/in/whoisjudy888",
    },
    content:
      "Kelvin is a reliable collaborator who bridges the gap between technical development and operational efficiency. He played a key role in building and maintaining internal dashboards, helping teams troubleshoot complex technical issues while communicating clearly and patiently with both technical and non-technical stakeholders. What stands out most is his attention to detail and the care he puts into improving the user experience.",
  },
  {
    id: "nadi-aung",
    author: {
      name: "Nadi Aung",
      role: "Hybrid Education Leader",
      avatar: "nadi_aung.jpg",
      url: "https://www.linkedin.com/in/nd-aung-ed",
    },
    content:
      "I highly recommend Kelvin! He has a rare ability to translate complex technical concepts into clear, simple terms. He was incredibly patient while deploying automation systems for our workflows, making our daily operations so much easier. Beyond his strong technical talent, he is attentive, highly enthusiastic, and always cheers the team on. He'd be a fantastic asset to any team looking for both a skilled developer and a positive collaborator!",
  },
  // Page 2: more proof. The photo-less Aung Khant Kyaw lives here until an avatar exists.
  {
    id: "nay-myo-khant",
    author: {
      name: "Nay Myo Khant",
      role: "FullStack Developer",
      company: "TalentOS",
      avatar: "nay_myo_khant.jpg",
      url: "https://github.com/Nmk78",
    },
    content:
      "Htet Aung Lin has an excellent sense of design and a strong ability to turn ideas into clean, well-crafted visuals that feel both intentional and user-focused. Beyond his design skills, he brings a calm, thoughtful presence to every project. He approaches challenges with clarity and patience, which makes problem-solving much more effective.",
  },
  {
    id: "sai-myo-myat",
    author: {
      name: "Sai Myo Myat",
      role: "Full-Stack Developer",
      company: "TalentOS",
      avatar: "sai_myo_myat.webp",
      url: "https://www.linkedin.com/in/sai-myo-myat",
    },
    content:
      "Htet Aung Lin is a highly skilled frontend developer with a strong sense of design and creativity. His work is not only technically solid but also visually impressive and artistic. His portfolio has pushed me to refine my sense of design. He approaches collaboration with a calm and thoughtful mindset, making teamwork smooth and effective.",
  },
  {
    id: "aung-khant-kyaw",
    author: {
      name: "Aung Khant Kyaw",
      role: "Software Developer",
      url: "https://github.com/auung",
    },
    content:
      "Had a phenomenal experience collaborating with Htet Aung Lin on MijnUI React library. Not only is building an entire UI library solo an impressive technical feat, but his constructive and actionable code reviews are just as commendable. Truly a versatile, creative and remarkable developer!",
  },
  {
    id: "khin-maung-htet",
    author: {
      name: "Khin Maung Htet",
      role: "Software Developer",
      company: "Pico",
      avatar: "khin_mg_htet.jpg",
      url: "https://www.linkedin.com/in/khin-maung-htet",
    },
    content:
      "Working with Htet Aung Lin honestly changed the way I look at teamwork. He's incredibly organized and pays attention to every little detail, not in a rigid way, but in a way that shows how much he truly cares about what he's doing. His determination and consistency are on another level, and his work ethic just pulls me to work harder.",
  },
];

/* -------------------------------------------------------------------------- */

const Testimonial = () => {
  const [page, setPage] = React.useState(0);
  const [active, setActive] = React.useState<TestimonialData | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalPages = Math.ceil(TESTIMONIALS.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = TESTIMONIALS.slice(start, start + PAGE_SIZE);

  const next = () => setPage((p) => (p + 1) % totalPages);
  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  const step = React.useCallback((dir: 1 | -1) => {
    setActive((current) => {
      if (!current) {
        return current;
      }
      const i = TESTIMONIALS.findIndex((t) => t.id === current.id);
      const len = TESTIMONIALS.length;
      return TESTIMONIALS[(i + dir + len) % len];
    });
  }, []);

  React.useEffect(() => {
    if (!active) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // native `inert` traps focus + hides the background from AT,
    // same as the contact dialog. Everything except the modal subtree is inert.
    const modalEl = modalRef.current;
    const background = modalEl
      ? [...document.body.children].filter((el) => !el.contains(modalEl))
      : [];
    for (const el of background) {
      el.setAttribute("inert", "");
    }

    const frame = requestAnimationFrame(() => modalRef.current?.focus());

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
      for (const el of background) {
        el.removeAttribute("inert");
      }
      previouslyFocused?.focus();
    };
  }, [active, step]);

  useOutsideClick(modalRef, () => setActive(null));

  const overlay = (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-30 h-full w-full bg-black/40 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="backdrop"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-40 grid place-items-center p-4">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              aria-label={`Testimonial from ${active.author.name}`}
              aria-modal="true"
              className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-bg-default shadow-xl outline-none backdrop-blur"
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
              layout
              ref={modalRef}
              role="dialog"
              tabIndex={-1}
              transition={{ duration: DURATION.fast, ease: EASE.out }}
            >
              <motion.button
                animate={{ opacity: 1 }}
                aria-label="Close testimonial"
                className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-bg-subtle text-fg-tertiary transition-colors hover:text-fg-default"
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                initial={{ opacity: 0 }}
                onClick={() => setActive(null)}
                type="button"
              >
                <XIcon className="size-4" />
              </motion.button>

              <div className="flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 pr-8">
                  <a
                    className="new_tab_cursor flex gap-4"
                    href={active.author.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="-rotate-6 size-12 shrink-0 bg-white/90 p-1">
                      <CloudinaryAvatar
                        className="size-full rounded-none"
                        classNames={{
                          image: "rounded-none",
                          fallback: "rounded-none",
                        }}
                        crop="thumb"
                        gravity="face"
                        height={96}
                        name={active.author.name}
                        src={active.author.avatar}
                        width={96}
                        zoom={0.7}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-fg-default text-sm underline-offset-4 hover:underline">
                        {active.author.name}
                      </h3>
                      <p className="text-fg-tertiary/80 text-xs">
                        {active.author.role}
                        {active.author.company &&
                          ` at ${active.author.company}`}
                      </p>
                    </div>
                  </a>
                </div>

                <motion.p
                  animate={{ opacity: 1 }}
                  className="text-fg-tertiary text-sm/relaxed sm:text-base/relaxed"
                  initial={{ opacity: 0 }}
                  key={active.id}
                  transition={{ duration: DURATION.fast }}
                >
                  {active.content}
                </motion.p>

                <div className="flex items-center justify-end gap-2 border-border border-t pt-4">
                  <CarouselButton
                    ariaLabel="Previous testimonial"
                    onClick={() => step(-1)}
                  >
                    <ArrowLeftIcon className="size-4" />
                  </CarouselButton>
                  <CarouselButton
                    ariaLabel="Next testimonial"
                    onClick={() => step(1)}
                  >
                    <ArrowRightIcon className="size-4" />
                  </CarouselButton>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {mounted && createPortal(overlay, document.body)}

      <div className="w-full overflow-hidden">
        <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
          Testimonials
        </h2>

        <p className="mt-1 max-w-3xl text-balance text-fg-tertiary text-sm/relaxed sm:text-base/relaxed">
          I've had the chance to work with some amazing people. Here's what they
          think about our time building things together.
        </p>

        <div className="relative mt-6 w-full text-fg-default">
          <DashedLine className="hidden sm:block" orientation="horizontal" />
          <DashedLine className="hidden sm:block" orientation="vertical" />

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate="show"
              className="grid w-full grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-0"
              exit="exit"
              initial="hidden"
              key={page}
              variants={{
                hidden: {},
                show: {
                  transition: reduceMotion
                    ? { duration: 0 }
                    : { staggerChildren: STAGGER.tight },
                },
                exit: {
                  transition: reduceMotion
                    ? { duration: 0 }
                    : { staggerChildren: 0.03, staggerDirection: -1 },
                },
              }}
            >
              {visible.map((testimonial, i) => (
                <motion.div
                  className={i % 2 === 0 ? "sm:pl-1" : "sm:pr-0"}
                  key={testimonial.id}
                  variants={{
                    hidden: reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 16 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: reduceMotion
                        ? { duration: 0 }
                        : { duration: DURATION.base, ease: EASE.out },
                    },
                    exit: reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: -8,
                          transition: { duration: 0.3, ease: EASE.in },
                        },
                  }}
                >
                  <TestimonialCard
                    onOpen={() => setActive(testimonial)}
                    testimonial={testimonial}
                  />
                </motion.div>
              ))}
              {Array.from({ length: PAGE_SIZE - visible.length }).map(
                (_, i) => (
                  <div
                    aria-hidden="true"
                    className="invisible min-h-[16rem] sm:hidden"
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable placeholder slot
                    key={`placeholder-${i}`}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="font-mono text-fg-tertiary/80 text-xs tabular-nums">
              {String(page + 1).padStart(2, "0")} /{" "}
              {String(totalPages).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-2">
              <CarouselButton ariaLabel="Previous testimonials" onClick={prev}>
                <ArrowLeftIcon className="size-4" />
              </CarouselButton>
              <CarouselButton ariaLabel="Next testimonials" onClick={next}>
                <ArrowRightIcon className="size-4" />
              </CarouselButton>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { Testimonial };

/* -------------------------------------------------------------------------- */

const CarouselButton = ({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) => (
  <button
    aria-label={ariaLabel}
    className="flex size-9 items-center justify-center rounded-full border border-border text-fg-tertiary transition-colors hover:border-fg-default/40 hover:text-fg-default"
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);

/* -------------------------------------------------------------------------- */

const TestimonialCard = ({
  testimonial,
  onOpen,
  className,
}: {
  testimonial: TestimonialData;
  onOpen: () => void;
  className?: string;
}) => {
  const { author, content } = testimonial;
  const isLong = content.length > TRUNCATE_AT;
  const displayed = isLong ? truncate(content, TRUNCATE_AT) : content;

  return (
    <button
      className={cn(
        "group size-full cursor-pointer rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
        className
      )}
      onClick={onOpen}
      type="button"
    >
      {/* Mask lives here, not on the button, so the focus ring stays visible. */}
      <div className="flex size-full flex-col justify-center gap-4 p-2 [mask:radial-gradient(85%_85%_at_50%,rgb(0,0,0)_65%,rgba(0,0,0,0)_90%)] sm:gap-6 sm:p-12 sm:pt-8">
        <div className="flex gap-6">
          <div className="-rotate-6 size-12 shrink-0 bg-white p-1">
            <CloudinaryAvatar
              className="size-full rounded-none"
              classNames={{
                image: "rounded-none",
                fallback: "rounded-none",
              }}
              crop="thumb"
              gravity="face"
              height={96}
              name={author.name}
              src={author.avatar}
              width={96}
              zoom={0.7}
            />
          </div>

          <div>
            <h3 className="font-medium text-fg-default text-sm">
              {author.name}
            </h3>
            <p className="text-fg-tertiary/80 text-xs">
              {author.role}
              {author.company && ` at ${author.company}`}
            </p>
          </div>
        </div>

        <p className="text-fg-tertiary text-sm/relaxed">
          {displayed}
          {isLong && (
            <span className="ml-1 text-fg-default underline-offset-4 group-hover:underline">
              Read more
            </span>
          )}
        </p>
      </div>
    </button>
  );
};
