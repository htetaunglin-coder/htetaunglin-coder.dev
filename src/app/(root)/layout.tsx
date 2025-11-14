import type React from "react";
import { Footer } from "@/components/footer";
import Header from "@/components/header";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}

    <div className="flex w-full justify-center px-6 pb-8">
      <Footer className="max-w-4xl px-4 lg:px-6" />
    </div>
  </>
);

export default RootLayout;
