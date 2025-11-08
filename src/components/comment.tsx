"use client";

import Giscus, { type Repo } from "@giscus/react";
import { useTheme } from "next-themes";

const Comment = () => {
  const { theme } = useTheme();

  return (
    <Giscus
      category="General"
      emitMetadata="0"
      inputPosition="bottom"
      key={theme}
      lang="en"
      loading="lazy"
      mapping="pathname"
      reactionsEnabled="1"
      repo={(process.env.NEXT_PUBLIC_GISCUS_REPO as Repo) || ""}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
      theme={theme}
    />
  );
};

export default Comment;
