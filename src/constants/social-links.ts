import { File } from "lucide-react";
import type { ComponentType } from "react";

import { Icons } from "@/components/icons";

export type SocialLinkItem = {
  id: string;
  title: string;
  icon: ComponentType;
  href: string;
};

export const SOCIAL_LINKS: readonly SocialLinkItem[] = [
  {
    id: "github",
    href: "https://github.com/htetaunglin-coder",
    icon: Icons.github,
    title: "Github",
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/htetaunglin.coder",
    icon: Icons.facebook,
    title: "Facebook",
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/htetaunglin-coder",
    icon: Icons.linkedin,
    title: "LinkedIn",
  },
  {
    id: "youtube",
    href: "https://www.youtube.com/@htetaunglin-coder",
    icon: Icons.youtube,
    title: "Youtube",
  },
  {
    id: "resume",
    href: `${process.env.NEXT_PUBLIC_APP_URL}/resume`,
    icon: File,
    title: "Resume",
  },
];
