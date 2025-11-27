import type React from "react";
import Header from "@/components/header";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
  </>
);

export default AppLayout;
