import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Download or view Htet Aung Lin's resume and professional experience.",
  alternates: {
    canonical: absoluteUrl("/resume"),
  },
  robots: { index: false, follow: true },
};

const Resume = () => (
  <main className="h-screen w-screen">
    <iframe
      className="h-full w-full"
      src={"/HTET_AUNG_LIN_RESUME.pdf"}
      title="Htet Aung Lin Resume"
    />
  </main>
);

export default Resume;
