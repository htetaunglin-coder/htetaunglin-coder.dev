"use client";

import Giscus, { type Repo } from "@giscus/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Comment = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!(mounted && resolvedTheme)) {
    return null;
  }

  return (
    <Giscus
      category="General"
      categoryId="DIC_kwDOK7sW9s4CxjCC"
      emitMetadata="0"
      inputPosition="bottom"
      key={resolvedTheme}
      lang="en"
      loading="lazy"
      mapping="pathname"
      reactionsEnabled="1"
      repo={(process.env.NEXT_PUBLIC_GISCUS_REPO as Repo) || ""}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
      theme={resolvedTheme}
    />
  );
};

export { Comment };
