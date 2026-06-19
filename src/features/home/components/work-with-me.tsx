"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "@/components/animations/expandable-screen";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { CONTACT_LINKS } from "@/constants/social-links";
import { cn } from "@/lib/utils";
import { sendEmail } from "../actions/email";
import { WorkWithMeIllustration } from "./work-with-me-illustration";

const WorkWithMe = () => {
  return (
    <ExpandableScreen
      contentRadius="24px"
      layoutId="work-with-me-contact"
      triggerRadius="20px"
    >
      {/* Collapsed: pitch on the page */}
      <h2 className="mb-8 font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
        Work with me
      </h2>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
        <div className="relative hidden md:col-span-4 md:flex md:items-center">
          <WorkWithMeIllustration />
        </div>

        <div className="md:col-span-8">
          <blockquote className="border-fg-tertiary/30 border-l-2 pl-4 font-gloria-hallelujah text-base text-fg-tertiary/60 italic tracking-normal sm:pl-6 sm:text-lg/snug">
            <p>
              &ldquo;He who works with his hands is a laborer. He who works with
              his hands and his head is a craftsman. He who works with his hands
              and his head and his heart is an artist.&rdquo;
            </p>
            <footer className="mt-3 font-inter text-fg-tertiary/60 text-sm not-italic tracking-normal">
              Francis of Assisi
            </footer>
          </blockquote>

          <p className="mt-8 text-base text-fg-tertiary sm:text-base/relaxed">
            AI writes the code. It doesn&apos;t care how the thing feels to use,
            or whether it&apos;ll still make sense in six months. I do.
          </p>

          <p className="mt-4 text-base text-fg-tertiary sm:text-base/relaxed">
            That&apos;s most of the job, really. The taste to make it good and
            the judgment to keep it simple.
          </p>

          <p className="mt-4 text-base text-fg-tertiary sm:text-base/relaxed">
            If that&apos;s what you&apos;re missing, let&apos;s talk.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ExpandableScreenTrigger>
              <Button size="sm" variant="inverse">
                Get in touch
              </Button>
            </ExpandableScreenTrigger>

            <NavLink
              className="font-medium text-fg-tertiary text-sm hover:text-fg-default"
              href="/projects"
            >
              See recent work →
            </NavLink>
          </div>
        </div>
      </div>

      {/* Expanded: full-screen contact panel with inverted colors */}
      <ExpandableScreenContent
        className="bg-[#1e1e1e] dark:bg-bg-inverse"
        closeButtonClassName="bg-white/10 text-zinc-200 hover:bg-white/20 dark:bg-fg-inverse/10 dark:text-fg-inverse dark:hover:bg-fg-inverse/20"
        dialogLabel="Get in touch"
      >
        <div className="flex h-full w-full flex-col justify-center overflow-y-auto px-6 py-20 sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto mb-12 grid w-full max-w-5xl grid-cols-1 items-center gap-2 lg:mb-16 lg:grid-cols-2 lg:gap-12">
            <h3 className="w-full font-inter font-medium text-2xl text-[#ebeaea] md:text-3xl lg:text-5xl dark:text-fg-inverse">
              Got something? Let&apos;s get into it.
            </h3>

            <p className="max-w-md text-[#ebeaea]/80 text-base/relaxed md:text-lg/relaxed lg:mt-6 lg:text-xl/relaxed dark:text-fg-inverse/80">
              Tell me what you&apos;re building, or just send a quick note. I
              read everything, and usually reply within a couple of days.
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-12">
            <div className="hidden pb-16 lg:mt-auto lg:block">
              <p className="font-black font-doto text-xs text-zinc-500 uppercase tracking-wider dark:text-fg-inverse/50">
                Other ways to reach me
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-3">
                {CONTACT_LINKS.map((link, idx) => (
                  <li key={link.id}>
                    <NavLink
                      className={cn(
                        "rounded-md px-2 py-0.75 text-[#ebeaea]/80 text-base outline-none transition duration-300 hover:text-zinc-400 hover:underline focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:bg-bg-brand/70 dark:text-fg-inverse dark:focus-visible:ring-offset-bg-inverse dark:hover:text-fg-inverse/70",
                        idx === 0 && "-ml-2"
                      )}
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <InverseContactForm />
          </div>
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
};

export { WorkWithMe };

/* -------------------------------------------------------------------------- */

const contactSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const fieldClass = cn(
  "w-full rounded-md border border-zinc-800 bg-white/5 px-3 py-2 text-[#ebeaea] text-sm",
  "outline-none transition-colors placeholder:text-zinc-600",
  "focus:border-outline-brand focus:bg-white/10",
  "disabled:opacity-50",
  "dark:border-fg-inverse/20 dark:bg-fg-inverse/5 dark:text-fg-inverse dark:focus:border-fg-inverse/40 dark:focus:bg-fg-inverse/10 dark:placeholder:text-fg-inverse/40"
);

const InverseContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: { email: "", message: "" },
    mode: "onChange",
    resolver: zodResolver(contactSchema),
  });

  const isSubmitDisabled = isSubmitting || !isValid;

  async function onSubmit(data: ContactFormData) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("message", data.message);

    const result = await sendEmail(formData);

    if ("success" in result) {
      toast.success("Message sent.", {
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      reset();
    } else {
      toast.error("Error", { description: result.error });
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          className="mb-2 block font-black font-doto text-xs text-zinc-500 uppercase tracking-wider dark:text-fg-inverse/60"
          htmlFor="work-with-me-email"
        >
          Your email
        </label>
        <input
          className={fieldClass}
          id="work-with-me-email"
          placeholder="you@example.com"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-2 text-fg-danger text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block font-black font-doto text-xs text-zinc-500 uppercase tracking-wider dark:text-fg-inverse/60"
          htmlFor="work-with-me-message"
        >
          Your message
        </label>
        <textarea
          className={cn(fieldClass, "min-h-32 resize-none")}
          id="work-with-me-message"
          placeholder="A line about the project, or just hi."
          rows={5}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-2 text-fg-danger text-sm">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          className="bg-[#ebeaea] px-5 text-[#1e1e1e] ring-offset-bg-inverse! hover:bg-[#ebeaea]/90 dark:bg-fg-inverse dark:text-bg-inverse dark:hover:bg-fg-inverse/90"
          disabled={isSubmitDisabled}
          type="submit"
          variant="default"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
};
