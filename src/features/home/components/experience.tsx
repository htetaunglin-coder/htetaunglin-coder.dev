"use client";

import { FadeAnimation } from "@/components/animations/fade-animation";
import { cn } from "@/lib/utils";

type TimelineItem = {
  id: string;
  year: string;
  events: {
    id: string;
    month?: string;
    title: string;
    company?: string;
    companyLink?: string;
    description: string;
  }[];
};

const TIMELINE_DATA: readonly TimelineItem[] = [
  {
    id: "2026",
    year: "2026",
    events: [
      {
        id: "event-1",
        month: "Jan - Present",
        title: "Full Stack Developer",
        company: "TalentOS (Full-Time)",
        companyLink: "https://www.linkedin.com/company/talent-os/",
        description:
          "Working as a full stack developer with employers. Creating UI designs and revamping landing pages. Built WhatsApp and AI agent integrations using Twilio for communication between employers and candidates.",
      },
      {
        id: "event-2",
        month: "Jan - Present",
        title: "Full Stack Developer",
        company: "Pico Innovation (Freelance)",
        companyLink: "https://www.linkedin.com/company/picoinno/",
        description:
          "Building an AI-block editor using MijnUI components that integrates with ERP AI agent database. The editor is deployed in Pico SBS for content creation and management.",
      },
    ],
  },
  {
    id: "2025",
    year: "2025",
    events: [
      {
        id: "event-1",
        month: "Oct - Dec",
        title: "Frontend Developer",
        company: "Pico Innovation (Part-Time)",
        companyLink: "https://www.linkedin.com/company/picoinno/",
        description:
          "After nine months full-time at Pico, moved to a part-time role to focus on Pica Chat, a conversational AI assistant built with Next.js. Researched existing AI chat apps and worked on the frontend.",
      },
      {
        id: "event-2",
        month: "Jan - Sep",
        title: "Frontend Developer",
        company: "Pico Innovation (Full-Time)",
        companyLink: "https://www.linkedin.com/company/picoinno/",
        description:
          "Built and documented a shared library of 25+ reusable components, worked on the in-house PDF editor, and added rich-text editing with Tiptap.",
      },
    ],
  },
  {
    id: "2024",
    year: "2024",
    events: [
      {
        id: "event-1",
        month: "May - Dec",
        title: "Frontend Developer",
        company: "Pico Innovation (Internship)",
        companyLink: "https://www.linkedin.com/company/picoinno/",
        description:
          "Started as an intern, researching editor tools like Tiptap and Lexical. The research and component work contributed to the MijnUI design system that followed.",
      },
    ],
  },
  {
    id: "2023",
    year: "2023",
    events: [
      {
        id: "event-1",
        month: "Aug - Dec",
        title: "Frontend Developer",
        company: "Upwork & Local Clients",
        description:
          "Took on small frontend projects to learn from client work. Worked on layouts, responsive design, and how people use interfaces.",
      },
    ],
  },
];

const Experience = () => (
  <div className="w-full">
    <FadeAnimation
      as="h2"
      className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold"
      direction="up"
    >
      Experience
    </FadeAnimation>

    <FadeAnimation
      as="div"
      className="relative mt-4 w-full sm:mt-8 sm:px-4"
      delay={0.25}
      direction="up"
    >
      <div className="flex flex-col space-y-10">
        {TIMELINE_DATA.map((entry, index) => (
          <div
            className="mt-4 flex flex-col items-start gap-2 sm:mt-0 sm:flex-row sm:gap-6"
            key={entry.id}
          >
            <div className="-mt-1 w-auto text-left font-light text-2xl text-fg-tertiary/60 sm:ml-0 sm:text-2xl md:text-2xl lg:text-3xl">
              {entry.year}
            </div>

            <div className="relative flex-1 space-y-6">
              {entry.events.map((event, idx) => {
                const isLastGroup = index === TIMELINE_DATA.length - 1;
                const isLastEvent = idx === entry.events.length - 1;

                return (
                  <div className="relative" key={`${entry.id}-${event.id}`}>
                    <div className="sm:-left-2 absolute top-0 bottom-0 left-0">
                      <div className="-left-1 absolute top-1 h-2 w-2 rounded-full bg-fg-tertiary/70 dark:bg-fg-tertiary dark:brightness-50" />
                      <div
                        className={cn(
                          "-bottom-12 -translate-x-1/2 absolute top-2 left-1/2 w-px transform",
                          isLastGroup && isLastEvent
                            ? "bg-gradient-to-b from-fg-tertiary/70 to-transparent dark:from-fg-tertiary dark:brightness-50"
                            : "bg-fg-tertiary/70 dark:bg-fg-tertiary dark:brightness-50"
                        )}
                      />
                    </div>

                    <div className="ml-3 sm:ml-5">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-base text-fg-secondary leading-5 md:text-lg">
                            {event.title}
                          </h4>
                          {event.companyLink ? (
                            <a
                              className="text-fg-tertiary/80 text-sm underline underline-offset-2 transition-colors hover:text-fg-brand dark:text-fg-tertiary/60"
                              href={event.companyLink}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {event.company}
                            </a>
                          ) : (
                            <span className="text-fg-tertiary/80 text-sm dark:text-fg-tertiary/60">
                              {event.company}
                            </span>
                          )}
                        </div>

                        <p className="mb-1 shrink-0 text-fg-brand text-xs md:text-sm lg:text-sm">
                          {event.month}
                        </p>
                      </div>

                      <p className="mt-2 text-fg-tertiary text-sm lg:text-base">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </FadeAnimation>
  </div>
);

export { Experience };
