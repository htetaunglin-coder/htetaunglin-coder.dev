import { RootProvider } from "fumadocs-ui/provider/next";
import type React from "react";

const BlogLayout = ({ children }: { children: React.ReactNode }) => (
  <RootProvider>{children}</RootProvider>
);

export default BlogLayout;
