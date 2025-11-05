import type React from "react";
import { Footer } from "@/components/footer";
import Header from "@/components/header";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default RootLayout;
