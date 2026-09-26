import type React from "react";
import { Footer } from "@/components/footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}

    <Footer className="mx-auto max-w-3xl px-6 lg:px-0" />
  </>
);

export default MainLayout;
