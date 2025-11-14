import { RootProvider } from "fumadocs-ui/provider/next";
import type React from "react";
import Header from "@/components/header";

const BlogLayout = ({ children }: { children: React.ReactNode }) => (
  <RootProvider>
    <Header />
    {children}
  </RootProvider>
);

export default BlogLayout;
