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
import { ChevronDown, Menu, Monitor, Moon, Sun, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTheme } from "next-themes";
import { type RefObject, useEffect, useRef, useState } from "react";
import {
  type BaseLinkItem,
  MAIN_PAGES,
  OTHER_PAGES,
} from "@/constants/navigation";
import { PROFILE_LINKS } from "@/constants/social-links";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FadeStaggeredAnimation } from "./animations/fade-animation";
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
  <Popover>
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
              childAs="li"
              className="hidden items-center text-base sm:flex"
              direction="down"
              staggerChildren={STAGGER.tight}
            >
              {MAIN_PAGES.map((page) => (
                <NavLink
                  className="flex h-12 items-center justify-center px-3 text-fg-tertiary outline-none ring-0 transition duration-300 hover:text-fg-default focus-visible:ring-2 focus-visible:ring-outline-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default data-[state=active]:text-fg-default data-[state=active]:underline"
                  href={page.href}
                  key={page.id}
                  matchPrefix={page.href !== "/"}
                >
                  {page.title}
                </NavLink>
              ))}
              <span
                aria-hidden="true"
                className="block h-8 w-px bg-outline-default"
              />
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

/* Revealing deliberately costs more than hiding. Matching the two would put the
   header back over the text on every small correction-scroll while reading. */
const HIDE_AFTER_SCROLLING_DOWN = 50;
const REVEAL_AFTER_SCROLLING_UP = 150;
const ALWAYS_VISIBLE_ABOVE = 100;

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
    if (y < ALWAYS_VISIBLE_ABOVE) {
      setIsHidden(false);
      lastYRef.current = y;
      return;
    }

    const difference = y - lastYRef.current;

    if (difference > HIDE_AFTER_SCROLLING_DOWN) {
      setIsHidden(true);
      lastYRef.current = y;
    } else if (difference < -REVEAL_AFTER_SCROLLING_UP) {
      setIsHidden(false);
      lastYRef.current = y;
    }
  });

  return (
    <motion.div
      animate={isHidden ? "hidden" : "visible"}
      className={className}
      onFocusCapture={() => setIsHidden(false)}
      transition={{ duration: DURATION.fast, ease: EASE.inOut }}
      variants={{
        hidden: { transform: "translateY(-100%)" },
        visible: { transform: "translateY(0%)" },
      }}
      whileHover="visible"
    >
      {children}
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */

const AskAiLink = () => (
  <NavLink
    className="group relative flex w-full shrink-0 items-center justify-center rounded-full bg-bg-default px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-300 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]"
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
    <span className="mr-1.5 text-sm opacity-70 dark:opacity-100">💭</span>
    <AnimatedGradientText className="font-medium text-sm">
      Ask AI about Me
    </AnimatedGradientText>
  </NavLink>
);

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
      className="z-[calc(var(--above-grainy-overlay-z-index)_+_10)] hidden w-full gap-2 rounded-2xl bg-bg-secondary/80 p-2 backdrop-blur-[3px] sm:flex"
    >
      {/* -------------------------------- Workshop -------------------------------- */}
      <div className="flex w-sm flex-col gap-3 rounded-lg bg-bg-default p-3.5 md:w-112">
        <p className="font-medium text-base text-fg-secondary">
          {OTHER_PAGES.workshop.title}
        </p>

        <div className="flex flex-1 gap-2.5">
          {OTHER_PAGES.workshop.items.map((item) => (
            <NavLink
              className="group/header-link relative flex min-h-44 flex-1 flex-col overflow-hidden rounded-md bg-bg-default-alt p-4 transition-colors duration-300"
              href={item.href}
              key={item.id}
            >
              <item.illustration className="pointer-events-none absolute inset-0 h-full w-full text-fg-tertiary opacity-70 transition-opacity duration-300 group-hover/header-link:opacity-95 dark:opacity-60 dark:group-hover/header-link:opacity-90" />

              <div className="relative flex flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-fg-default text-sm group-hover/header-link:underline">
                    {item.title}
                  </p>
                </div>
                <p className="text-fg-tertiary text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ---------------------------------- Links --------------------------------- */}
      <div className="flex w-full max-w-52 flex-col gap-2 md:max-w-60">
        <ThemeSwitcher className="self-end border border-outline-secondary" />

        <AskAiLink />

        {/* Rows split the leftover height evenly, so the card stays level with
            the Workshop card whatever the tile copy does to it. */}
        <div className="flex flex-1 flex-col rounded-lg bg-bg-default p-1.5">
          {[...OTHER_PAGES.links, OTHER_PAGES.sideQuest].map((link) => (
            <NavLink
              className="group/header-link flex flex-1 items-center gap-2 rounded-md px-2 outline-none transition-colors duration-300 hover:bg-bg-default-alt focus-visible:ring-2 focus-visible:ring-outline-brand"
              href={link.href}
              key={link.id}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-bg-default-alt text-fg-tertiary transition-colors duration-300 group-hover/header-link:bg-bg-accent">
                <link.icon />
              </span>
              <span>
                <span className="block font-medium text-[0.8125rem] text-fg-default group-hover/header-link:underline">
                  {link.title}
                </span>
                <span className="block text-fg-tertiary/80 text-xs">
                  {link.description}
                </span>
              </span>
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
      <DialogContent className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[calc(var(--above-grainy-overlay-z-index)_+_10)] flex flex-col overflow-y-auto overscroll-contain bg-bg-default transition duration-300 ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in">
        <DialogTitle className="sr-only">Menu</DialogTitle>

        <div className="sticky top-0 flex w-full shrink-0 items-center bg-bg-default px-8 py-6">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MobileThemePopover />
              <NavLink
                className="group relative flex items-center gap-1"
                href="/chat"
              >
                <span className="mr-0.5 text-sm opacity-70 dark:opacity-100">
                  💭
                </span>
                <AnimatedGradientText className="font-medium text-xs">
                  Ask AI about Me
                </AnimatedGradientText>
              </NavLink>
            </div>

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

        <nav className="flex flex-1 flex-col justify-center">
          <ul className="flex flex-col gap-10 p-8 text-start">
            <MobileNavItems items={[...MAIN_PAGES]} title="Main Pages" />
            <MobileNavItems
              items={[...OTHER_PAGES.workshop.items]}
              title={OTHER_PAGES.workshop.title}
            />
            <MobileNavItems
              items={[...OTHER_PAGES.links, OTHER_PAGES.sideQuest]}
              title="Other Pages"
            />
          </ul>
        </nav>

        <div className="sticky bottom-0 w-full space-y-0.5 bg-bg-default px-8 py-6">
          <div className="flex items-center justify-start gap-1">
            {PROFILE_LINKS.map((link) => (
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

const MobileThemePopover = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        aria-label="Choose color theme"
        className="group h-8 rounded-full border border-outline-secondary bg-bg-default px-3 text-fg-tertiary text-xs hover:text-fg-default data-[state=open]:text-fg-default"
        type="button"
        variant="ghost"
      >
        Theme
        <ChevronDown className="ml-1 size-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      className="z-[calc(var(--above-grainy-overlay-z-index)_+_50)] w-40 rounded-lg border border-outline-secondary bg-bg-default p-1 shadow-none"
      sideOffset={8}
    >
      <MobileThemeOptions />
    </PopoverContent>
  </Popover>
);

const mobileThemeOptions = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
] as const;

const MobileThemeOptions = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-w-28 flex-col gap-1">
      {mobileThemeOptions.map((option) => {
        const isActive = theme === option.key;
        const Icon = option.icon;

        return (
          <button
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors duration-300",
              isActive
                ? "bg-bg-secondary font-medium text-fg-default"
                : "text-fg-tertiary hover:bg-bg-secondary/70 hover:text-fg-default"
            )}
            key={option.key}
            onClick={() => setTheme(option.key)}
            type="button"
          >
            <Icon className="size-4 shrink-0" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

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
