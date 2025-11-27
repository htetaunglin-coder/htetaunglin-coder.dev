"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Comment = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Giscus
      category="General"
      categoryId="DIC_kwDOK7sW9s4CxjCC"
      emitMetadata="0"
      inputPosition="bottom"
      key={theme}
      lang="en"
      loading="lazy"
      mapping="pathname"
      reactionsEnabled="1"
      repo={"htetaunglin-coder/htetaunglin-coder.dev"}
      repoId={"R_kgDOK7sW9g"}
      theme={theme}
    />
  );
};

export default Comment;
