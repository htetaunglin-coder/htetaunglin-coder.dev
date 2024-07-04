import Link from "next/link";
import { FaRegFileLines } from "react-icons/fa6";
import { FiFacebook, FiGithub, FiLinkedin } from "react-icons/fi";

// =========================================================

const FOOTER_ITEMS = [
  {
    name: "facebook",
    Icon: FiFacebook,
    url: "https://www.facebook.com/profile.php?id=100083287641210",
  },
  {
    name: "linkedin",
    Icon: FiLinkedin,
    url: "https://www.linkedin.com/in/htetaunglin-coder",
  },
  {
    name: "github",
    Icon: FiGithub,
    url: "https://github.com/HTLA380",
  },
];

const Footer = () => {
  return (
    <footer className="bg-secondary pb-10 pt-8">
      <div className="mx-auto flex w-4/5 max-w-screen-smd items-center justify-between gap-4">
        <p className="font-dmSans text-sm text-gray-400 sm:text-base">
          Design and Built By{" "}
          <a
            href="https://github.com/HTLA380"
            target="_blank"
            className="whitespace-nowrap text-pink underline">
            Htet Aung Lin{" "}
          </a>
        </p>
        <div className="flex gap-4 text-lg text-white md:hidden">
          {FOOTER_ITEMS.map(({ name, url, Icon }) => (
            <a key={name} target="_blank" href={url}>
              <Icon />
            </a>
          ))}

          <Link className="text-pink" href="/resume">
            <FaRegFileLines size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
