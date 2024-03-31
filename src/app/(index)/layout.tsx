import "../css/globals.css";
import "../css/animation.css";
import "../css/fonts.css";
import "../css/util.css";
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
