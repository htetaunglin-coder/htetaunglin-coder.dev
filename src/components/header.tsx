"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { type RefObject, useRef, useState } from "react";
import {
  type BaseLinkItem,
  MAIN_PAGES,
  OTHER_PAGES,
} from "@/constants/navigation";
import { SOCIAL_LINKS } from "@/constants/social-links";
import { cn } from "@/lib/utils";
import { FadeStaggeredAnimation } from "./animations/fade-animation";
import { CloudinaryImage } from "./cloudinary-image";
import { AnimatedGradientText } from "./decorations/animated-gradient-text";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { NavLink } from "./ui/nav-link";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const Header = ({
  containerRef,
  className,
}: {
  containerRef?: RefObject<HTMLElement | null>;
  className?: string;
}) => (
  <Popover modal>
    <HeaderAutoHideWrapper
      className={cn(
        "pointer-events-none sticky top-0 z-[calc(var(--above-grainy-overlay-z-index)+10)] flex h-[var(--header-height)] w-full items-end justify-end px-6 sm:justify-center",
        className
      )}
      container={containerRef}
    >
      <PopoverAnchor>
        <div className="pointer-events-auto flex w-fit max-w-4xl items-center gap-6 rounded-lg bg-bg-secondary/80 px-2 backdrop-blur-[3px]">
          <div className="flex items-center">
            <FadeStaggeredAnimation
              as="ul"
              className="hidden items-center text-base sm:flex"
              direction="down"
              staggerChildren={0.05}
            >
              {MAIN_PAGES.map((page) => (
                <li key={page.id}>
                  <NavLink
                    className="flex h-12 items-center justify-center px-3 text-fg-tertiary outline-none ring-0 transition duration-300 hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default data-[state=active]:text-fg-default data-[state=active]:underline"
                    href={page.href}
                  >
                    {page.title}
                  </NavLink>
                </li>
              ))}
              <div className="h-8 w-px bg-outline-default" />
              <MorePages />
            </FadeStaggeredAnimation>

            <MobileMenu />
          </div>
        </div>
      </PopoverAnchor>
    </HeaderAutoHideWrapper>
  </Popover>
);

/* -------------------------------------------------------------------------- */

const SCROLL_THRESHOLD = 50;

const HeaderAutoHideWrapper = ({
  children,
  className,
  container,
}: {
  children: React.ReactNode;
  className?: string;
  container?: RefObject<HTMLElement | null>;
}) => {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll({ container });
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    if (Math.abs(difference) > SCROLL_THRESHOLD) {
      setIsHidden(difference > 0);
      lastYRef.current = y;
    }
  });

  return (
    <motion.div
      animate={isHidden ? "hidden" : "visible"}
      className={className}
      onFocusCapture={() => setIsHidden(false)}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      variants={{
        hidden: { y: "-100%" },
        visible: { y: "0%" },
      }}
      whileHover="visible"
    >
      {children}
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */

const MorePages = () => (
  <>
    <PopoverTrigger asChild>
      <button
        className="group hidden h-12 cursor-pointer items-center gap-2 px-3 text-fg-tertiary outline-none ring-0 transition duration-300 hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default data-[state=open]:text-fg-default sm:flex"
        type="button"
      >
        More
        <ChevronDown className="transition duration-300 group-data-[state=open]:rotate-180" />
      </button>
    </PopoverTrigger>
    <PopoverContent
      align="center"
      className="z-[calc(var(--above-grainy-overlay-z-index)_+_10)] hidden h-64 w-full gap-2 rounded-lg bg-bg-secondary/80 p-3 backdrop-blur-[3px] sm:flex"
    >
      {/* ------------------------------- Side Quest ------------------------------- */}
      <div className="flex size-full w-sm flex-col gap-3 rounded-lg bg-bg-default p-3 md:w-md">
        <div>
          <p className="font-medium text-base text-fg-secondary hover:underline">
            <Link href={OTHER_PAGES.sideQuest.href}>
              {OTHER_PAGES.sideQuest.title}
            </Link>
          </p>
          <p className="text-fg-tertiary text-sm">
            {OTHER_PAGES.sideQuest.description}
          </p>
        </div>

        <div className="flex size-full gap-2">
          {OTHER_PAGES.sideQuest.items.map((item) => (
            <NavLink
              className="group/header-link relative aspect-[14/16] w-full overflow-hidden rounded-lg"
              href={item.href}
              key={item.id}
            >
              <div className="absolute inset-0 z-10 rounded-[11px] bg-gradient-to-b from-neutral-900/5 to-neutral-900/65 opacity-100 transition-opacity duration-300 group-hover/header-link:opacity-65 dark:from-neutral-900/35 dark:to-neutral-900/80" />
              <CloudinaryImage
                alt={item.alt}
                aspectRatio={"14:16"}
                className="object-cover object-top transition-transform duration-300 group-hover/header-link:scale-110"
                fill
                src={item.image}
              />
              <div className="absolute inset-x-0 bottom-0 z-20 w-full px-3 py-2">
                <p className="font-medium text-sm text-zinc-200 group-hover/header-link:underline">
                  {item.title}
                </p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ---------------------------------- Links --------------------------------- */}
      <div className="flex size-full max-w-52 flex-col justify-between gap-2 md:max-w-64">
        <div className="flex w-full justify-end">
          <ThemeSwitcher className="border border-outline-secondary" />
        </div>

        <div className="flex w-full flex-col gap-2">
          <NavLink
            className="group relative flex w-full items-center justify-center rounded-full bg-bg-default px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]"
            href="/chat"
          >
            <span
              className={cn(
                "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-[length:300%_100%] bg-gradient-to-r from-[#ff8c00]/50 via-[#9c40ff]/50 to-[#7a1fff]/50 p-[1px]"
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <span className="mr-1.5 opacity-70 dark:opacity-100">💭</span>
            <AnimatedGradientText className="font-medium text-sm">
              Ask AI about Me
            </AnimatedGradientText>
            <ChevronRight className="ml-1.5 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </NavLink>

          {OTHER_PAGES.links.map((link) => (
            <NavLink
              className="group/header-link flex w-full items-center justify-center space-y-1 rounded-lg bg-bg-default p-3 lg:min-w-60"
              href={link.href}
              key={link.id}
            >
              <div className="flex w-full items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-bg-secondary text-base text-fg-tertiary">
                  <link.icon />
                </div>
                <div>
                  <p className="font-medium text-fg-default text-sm group-hover/header-link:underline">
                    {link.title}
                  </p>
                  <p className="text-fg-tertiary text-xs">{link.description}</p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </PopoverContent>
  </>
);

const MobileMenu = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        className="group flex h-9 cursor-pointer items-center gap-1.5 px-2 text-fg-tertiary text-sm outline-none ring-0 transition duration-300 hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default data-[state=open]:text-fg-default sm:hidden"
        type="button"
      >
        <Menu className="mt-0.5 text-base" />
        Menu
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[calc(var(--above-grainy-overlay-z-index)_+_10)] bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in" />
      <DialogContent className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[calc(var(--above-grainy-overlay-z-index)_+_10)] flex flex-col overflow-y-scroll bg-bg-default transition duration-200 ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in">
        <DialogTitle className="sr-only">Menu</DialogTitle>

        <div className="sticky top-0 flex h-16 w-full shrink-0 items-center bg-bg-default px-8 py-6">
          <div className="flex w-full items-center justify-between gap-2">
            <ThemeSwitcher className="border border-outline-secondary" />
            <DialogClose asChild>
              <Button
                className="text-2xl text-fg-tertiary"
                iconOnly
                variant="ghost"
              >
                <X />
              </Button>
            </DialogClose>
          </div>
        </div>

        <nav className="flex h-full flex-col justify-center gap-6">
          <ul className="flex flex-col justify-center gap-12 overflow-y-auto p-8 text-start">
            <MobileNavItems items={[...MAIN_PAGES]} title="Main Pages" />
            <MobileNavItems
              items={[...OTHER_PAGES.sideQuest.items]}
              title={OTHER_PAGES.sideQuest.title}
            />
            <MobileNavItems items={OTHER_PAGES.links} title="Other Pages" />
          </ul>
        </nav>

        <div className="sticky bottom-0 w-full space-y-0.5 bg-bg-default px-8 py-6">
          <div className="flex items-center justify-start gap-1">
            {SOCIAL_LINKS.map((link) => (
              <Button
                asChild
                className="text-fg-tertiary text-lg hover:shadow"
                iconOnly
                key={link.id}
                title={link.title}
                variant="ghost"
              >
                <NavLink href={link.href}>
                  <link.icon />
                  <span className="sr-only">{link.title}</span>
                </NavLink>
              </Button>
            ))}
          </div>

          <p className="text-fg-tertiary/70 text-sm">
            Source code available on{" "}
            <span className="font-medium text-fg-tertiary underline">
              Github
            </span>
          </p>
        </div>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

type NavSectionProps = {
  title: string;
  items: BaseLinkItem[];
};

const MobileNavItems = ({ title, items }: NavSectionProps) => (
  <li className="space-y-4">
    <p className="text-fg-tertiary text-sm">{title}</p>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <DialogClose asChild>
            <NavLink
              className="font-medium text-2xl text-fg-tertiary transition duration-300 hover:text-fg-default data-[state=active]:text-fg-default data-[state=active]:underline"
              href={item.href}
            >
              {item.title}
            </NavLink>
          </DialogClose>
        </li>
      ))}
    </ul>
  </li>
);

export default Header;
