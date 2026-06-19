import { File, Instagram, Mail, Send } from "lucide-react";
import type { ComponentType } from "react";

import { Icons } from "@/components/icons";

export type SocialLinkItem = {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
};

const LINKS = {
  github: {
    id: "github",
    href: "https://github.com/htetaunglin-coder",
    icon: Icons.github,
    title: "Github",
  },
  instagram: {
    id: "instagram",
    href: "https://www.instagram.com/htetaunglin_coder",
    icon: Instagram,
    title: "Instagram",
  },
  linkedin: {
    id: "linkedin",
    href: "https://www.linkedin.com/in/htetaunglin-coder",
    icon: Icons.linkedin,
    title: "LinkedIn",
  },
  email: {
    id: "email",
    href: "mailto:htetaunglin.coder@gmail.com",
    icon: Mail,
    title: "Email",
  },
  telegram: {
    id: "telegram",
    href: "https://t.me/htetaunglin_coder",
    icon: Send,
    title: "Telegram",
  },
  resume: {
    id: "resume",
    href: `${process.env.NEXT_PUBLIC_APP_URL}/resume`,
    icon: File,
    title: "Resume",
  },
} satisfies Record<string, SocialLinkItem>;

// Footer / header: where to find me. Explicit order, no telegram.
export const PROFILE_LINKS: readonly SocialLinkItem[] = [
  LINKS.github,
  LINKS.instagram,
  LINKS.linkedin,
  LINKS.email,
  LINKS.resume,
];

// Contact modal: direct reply channels. No github/resume.
export const CONTACT_LINKS: readonly SocialLinkItem[] = [
  LINKS.instagram,
  LINKS.linkedin,
  LINKS.email,
  LINKS.telegram,
];
