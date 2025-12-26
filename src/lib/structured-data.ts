import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/utils";

export type PersonStructuredData = {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  url: string;
  image?: string;
  jobTitle?: string;
  sameAs?: string[];
  description?: string;
};

export type WebSiteStructuredData = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
};

export type ArticleStructuredData = {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Person";
    name: string;
    url?: string;
  };
  publisher: {
    "@type": "Person";
    name: string;
    url?: string;
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  keywords?: string | string[];
};

export type BreadcrumbListStructuredData = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
};

export function getPersonStructuredData(): PersonStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.title,
    url: siteConfig.url as string,
    jobTitle: "Frontend Developer",
    description: siteConfig.description,
    sameAs: [
      "https://github.com/htetaunglin-coder",
      "https://www.linkedin.com/in/htetaunglin-coder",
      "https://www.youtube.com/@htetaunglin-coder",
      "https://x.com/htetaunglin_cdr",
      "https://www.facebook.com/htetaunglin.coder",
    ],
  };
}

export function getWebSiteStructuredData(): WebSiteStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    url: siteConfig.url as string,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getArticleStructuredData({
  title,
  description,
  image,
  datePublished,
  dateModified,
  url,
  tags,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: Date;
  dateModified?: Date;
  url: string;
  tags?: string[];
}): ArticleStructuredData {
  const authorUrl = siteConfig.url as string;
  const articleUrl = absoluteUrl(url);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image ? absoluteUrl(image) : undefined,
    datePublished: datePublished.toISOString(),
    dateModified: dateModified?.toISOString() || datePublished.toISOString(),
    author: {
      "@type": "Person",
      name: siteConfig.title,
      url: authorUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.title,
      url: authorUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: tags?.join(", "),
  };
}

export function getBreadcrumbStructuredData(
  items: Array<{ name: string; url?: string }>
): BreadcrumbListStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? absoluteUrl(item.url) : undefined,
    })),
  };
}
