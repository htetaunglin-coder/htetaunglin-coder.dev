import RightBar from "@/components/rightbar/RightBar";
import Navbar from "@/components/navbar/Navbar";

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
