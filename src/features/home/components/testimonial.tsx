"use client";

import { FadeStaggeredAnimation } from "@/components/animations/fade-animation";
import { CloudinaryAvatar } from "@/components/cloudinary-avatar";
import { DashedLine } from "@/components/decorations/dashed-line";
import { cn } from "@/lib/utils";

type TestimonialData = {
  id: string;
  author: {
    name: string;
    role: string;
    company?: string;
    avatar?: string;
  };
  content: string;
};

const TESTIMONIALS: readonly TestimonialData[] = [
  {
    id: "sann-ko-ko",
    author: {
      name: "Sann Ko Ko",
      role: "Product Owner",
      company: "Praktikon B.V",
      avatar: "sann_ko_ko.jpg",
    },
    content:
      "Working with Htet was a fantastic experience. He has an incredible ability to turn ideas into reality, making the process very enjoyable. It's rare to find someone who can translate concepts into designs so perfectly on the first try.",
  },
  {
    id: "khin-maung-htet",
    author: {
      name: "Khin Maung Htet",
      role: "Software Developer",
      company: "Pico",
      avatar: "khin_mg_htet.jpg",
    },
    content:
      "Working with Htet Aung Lin honestly changed the way I look at teamwork. He's incredibly organized and pays attention to every little detail, not in a rigid way, but in a way that shows how much he truly cares about what he's doing. His determination and consistency are on another level, and his work ethic just pulls me to work harder.",
  },
  {
    id: "wai-yan-phone-aant",
    author: {
      name: "Wai Yan Phone Aant",
      role: "Full Stack Developer",
      company: "Pico",
      avatar: "wai_yan_phone_aant.jpg",
    },
    content:
      "It has been an absolute pleasure collaborating with Htet Aung Lin. He is an incredibly creative front-end developer, and I truly value the quality and aesthetic of the designs he consistently produces. As a backend engineer, I especially appreciate his flexibility and his open approach to discussion and negotiation.",
  },
  {
    id: "aung-khant-kyaw",
    author: {
      name: "Aung Khant Kyaw",
      role: "Software Developer",
    },
    content:
      "Had a phenomenal experience collaborating with Htet Aung Lin on MijnUI React library. Not only is building an entire UI library solo an impressive technical feat, but his constructive and actionable code reviews are just as commendable. Truly a versatile, creative and remarkable developer!",
  },
];

/* -------------------------------------------------------------------------- */

const Testimonial = () => (
  <FadeStaggeredAnimation className="w-full overflow-hidden" direction="up">
    <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
      Testimonials
    </h2>

    <p className="mt-1 max-w-3xl text-balance text-base/relaxed text-fg-tertiary">
      I've had the chance to work with some amazing people. Here's what they
      think about our time building things together.
    </p>

    <div className="relative mt-6 grid w-full grid-cols-1 gap-12 text-fg-default sm:mt-4 sm:grid-cols-2 sm:gap-0">
      <DashedLine className="hidden sm:block" orientation="horizontal" />
      <DashedLine className="hidden sm:block" orientation="vertical" />

      {TESTIMONIALS.map((testimonial, index) => (
        <TestimonialCard
          className={index % 2 === 0 ? "sm:pl-1" : "sm:pr-0"}
          key={testimonial.id}
          testimonial={testimonial}
        />
      ))}
    </div>
  </FadeStaggeredAnimation>
);

export { Testimonial };

/* -------------------------------------------------------------------------- */

const TestimonialCard = ({
  testimonial,
  className,
}: {
  testimonial: TestimonialData;
  className?: string;
}) => {
  const { author, content } = testimonial;

  return (
    <div
      className={cn(
        "flex size-full flex-col justify-center gap-6 p-2 [mask:radial-gradient(85%_85%_at_50%,rgb(0,0,0)_65%,rgba(0,0,0,0)_90%)] sm:p-12 sm:pt-8",
        className
      )}
    >
      <div className="flex gap-6">
        <div className="-rotate-6 size-12 shrink-0 bg-white p-1">
          <CloudinaryAvatar
            className="size-full rounded-none"
            classNames={{
              image: "rounded-none",
              fallback: "rounded-none",
            }}
            name={author.name}
            src={author.avatar}
            width={48}
          />{" "}
        </div>

        <div>
          <h5 className="font-medium text-fg-default text-sm">{author.name}</h5>
          <p className="text-fg-tertiary/80 text-xs">
            {author.role} {author.company && `at ${author.company}`}
          </p>
        </div>
      </div>

      <p className="text-fg-tertiary text-sm">{content}</p>
    </div>
  );
};
