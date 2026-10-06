import {
  SiBluesky,
  SiClaude,
  SiDevdotto,
  SiDiscord,
  SiDuckduckgo,
  SiFacebook,
  SiGithub,
  SiGmail,
  SiGoogle,
  SiGooglegemini,
  SiInstagram,
  SiMedium,
  SiMessenger,
  SiOpenai,
  SiPerplexity,
  SiReddit,
  SiSlack,
  SiTelegram,
  SiThreads,
  SiWhatsapp,
  SiX,
  SiYcombinator,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { Globe, Link, Search, Smartphone } from "lucide-react";
import type { ComponentType } from "react";
import { Icons } from "@/components/icons";

type ReferrerIcon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

// One row per site. `hosts` also matches Android package names, because an
// app sends its package (com.linkedin.android) where a browser sends a host.
// The first match wins, so Gmail and Gemini sit above Google.
// Simple Icons dropped LinkedIn and Bing, so those use other icons.
const SITES = [
  {
    source: "linkedin",
    label: "LinkedIn",
    icon: Icons.linkedin,
    hosts: /(^|\.)linkedin\.com$|^lnkd\.in$|^com\.linkedin\./,
  },
  {
    source: "facebook",
    label: "Facebook",
    icon: SiFacebook,
    hosts: /(^|\.)facebook\.com$|^fb\.me$|^com\.facebook\.katana$/,
  },
  {
    source: "messenger",
    label: "Messenger",
    icon: SiMessenger,
    hosts: /(^|\.)messenger\.com$|^m\.me$|^com\.facebook\.orca$/,
  },
  {
    source: "instagram",
    label: "Instagram",
    icon: SiInstagram,
    hosts: /(^|\.)instagram\.com$|^com\.instagram\.android$/,
  },
  {
    source: "threads",
    label: "Threads",
    icon: SiThreads,
    hosts: /(^|\.)threads\.(net|com)$|^com\.instagram\.barcelona$/,
  },
  {
    source: "x",
    label: "X",
    icon: SiX,
    hosts: /^(mobile\.)?(x|twitter)\.com$|^t\.co$|^com\.twitter\.android$/,
  },
  {
    source: "bluesky",
    label: "Bluesky",
    icon: SiBluesky,
    hosts: /^bsky\.app$|^xyz\.blueskyweb\.app$/,
  },
  {
    source: "reddit",
    label: "Reddit",
    icon: SiReddit,
    hosts: /(^|\.)reddit\.com$|^com\.reddit\.frontpage$/,
  },
  {
    source: "hackernews",
    label: "Hacker News",
    icon: SiYcombinator,
    hosts: /^news\.ycombinator\.com$/,
  },
  {
    source: "github",
    label: "GitHub",
    icon: SiGithub,
    hosts: /(^|\.)github\.com$|^com\.github\.android$/,
  },
  {
    source: "devto",
    label: "DEV",
    icon: SiDevdotto,
    hosts: /^dev\.to$/,
  },
  {
    source: "medium",
    label: "Medium",
    icon: SiMedium,
    hosts: /(^|\.)medium\.com$/,
  },
  {
    source: "youtube",
    label: "YouTube",
    icon: SiYoutube,
    hosts: /(^|\.)youtube\.com$|^youtu\.be$|^com\.google\.android\.youtube$/,
  },
  {
    source: "gmail",
    label: "Gmail",
    icon: SiGmail,
    hosts: /^mail\.google\.com$|^com\.google\.android\.gm$/,
  },
  {
    source: "gemini",
    label: "Gemini",
    icon: SiGooglegemini,
    hosts: /^gemini\.google\.com$/,
  },
  {
    source: "google",
    label: "Google",
    icon: SiGoogle,
    hosts:
      /(^|\.)google(\.[a-z]{2,3}){1,2}$|^com\.google\.android\.googlequicksearchbox$/,
  },
  {
    source: "bing",
    label: "Bing",
    icon: Search,
    hosts: /(^|\.)bing\.com$/,
  },
  {
    source: "duckduckgo",
    label: "DuckDuckGo",
    icon: SiDuckduckgo,
    hosts: /(^|\.)duckduckgo\.com$/,
  },
  {
    source: "chatgpt",
    label: "ChatGPT",
    icon: SiOpenai,
    hosts: /^(chatgpt\.com|chat\.openai\.com)$/,
  },
  {
    source: "claude",
    label: "Claude",
    icon: SiClaude,
    hosts: /^claude\.ai$/,
  },
  {
    source: "perplexity",
    label: "Perplexity",
    icon: SiPerplexity,
    hosts: /(^|\.)perplexity\.ai$/,
  },
  {
    source: "telegram",
    label: "Telegram",
    icon: SiTelegram,
    hosts: /^(t\.me|web\.telegram\.org)$|^org\.telegram\./,
  },
  {
    source: "whatsapp",
    label: "WhatsApp",
    icon: SiWhatsapp,
    hosts: /(^|\.)whatsapp\.com$|^wa\.me$|^com\.whatsapp$/,
  },
  {
    source: "discord",
    label: "Discord",
    icon: SiDiscord,
    hosts: /(^|\.)discord(app)?\.com$|^com\.discord$/,
  },
  {
    source: "slack",
    label: "Slack",
    icon: SiSlack,
    hosts: /(^|\.)slack\.com$|^com\.slack$/i,
  },
] as const satisfies readonly {
  source: string;
  label: string;
  icon: ReferrerIcon;
  hosts: RegExp;
}[];

/** An Android package name of an app not in SITES, such as `com.example.app`. */
const APP_PACKAGE = /^(com|org|net|io)\.[\w-]+\.[\w.-]+$/;

export type ReferrerSource =
  | (typeof SITES)[number]["source"]
  | "direct"
  | "app"
  | "other";

/** Names the site a referrer host belongs to. An empty host is a direct visit. */
export function identifyReferrer(host: string): {
  source: ReferrerSource;
  label: string;
} {
  if (host === "") {
    return { source: "direct", label: "Direct" };
  }
  const site = SITES.find((entry) => entry.hosts.test(host));
  if (site) {
    return { source: site.source, label: site.label };
  }
  return { source: APP_PACKAGE.test(host) ? "app" : "other", label: host };
}

export function referrerIcon(source: ReferrerSource): ReferrerIcon {
  if (source === "direct") return Link;
  if (source === "app") return Smartphone;
  return SITES.find((entry) => entry.source === source)?.icon ?? Globe;
}
