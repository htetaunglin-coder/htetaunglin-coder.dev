import Navbar from "@/components/navbar/Navbar";
import RightBar from "@/components/rightbar/RightBar";

// =========================================================

export default function IndexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <RightBar />
      {children}
    </>
  );
}
