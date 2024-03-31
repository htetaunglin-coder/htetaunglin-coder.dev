import Link from "next/link";
import { FaRegFileLines } from "react-icons/fa6";
import { FiFacebook, FiLinkedin, FiGithub } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-secondary pt-8 pb-10">
      <div className="w-4/5 max-w-screen-smd mx-auto flex items-center justify-between gap-4">
        <p className="font-dmSans text-sm sm:text-base text-gray-400">
          Design and Built By <span className="text-pink underline whitespace-nowrap">Htet Aung Lin </span>
        </p>
        <div className="flex gap-4 md:hidden text-white text-lg">
          {" "}
          <a target="_blank" href="https://www.facebook.com/profile.php?id=100083287641210">
            <FiFacebook />
          </a>
          <a
            target="_blank"
            href="https://www.linkedin.com/in/htet-aung-lin-741968291
      ">
            <FiLinkedin />
          </a>
          <a target="_blank" href="https://github.com/HTLA380">
            <FiGithub />
          </a>
          <Link className="text-pink" href="/resume">
            <FaRegFileLines size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
