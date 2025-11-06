"use client";

import { motion } from "motion/react";
import { FadeStaggeredAnimation } from "@/components/animations/fade-animation";
import { Profile } from "@/components/decorations/profile";
import { Button } from "@/components/ui/button";

const Hero = () => (
  <div className="relative flex h-[36rem] w-full justify-between overflow-hidden">
    <div className="px-6">
      <FadeStaggeredAnimation direction="up">
        <p className="font-mono text-fg-tertiary/80 text-xs sm:text-sm">
          Hey It&apos;s me,{" "}
          <span className="font-medium text-fg-brand text-xs sm:text-sm">
            Frontend Developer
          </span>
        </p>
        <h1 className="mt-1 bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-bold font-inter text-4xl/[1.2] text-transparent tracking-tight sm:mt-0 sm:font-extrabold sm:text-5xl/[1.2] md:text-7xl/[1.2] dark:to-fg-tertiary/80">
          Htet Aung Lin
        </h1>

        <p className="mt-3 max-w-3xl text-base text-fg-tertiary sm:mt-2 sm:text-lg/relaxed">
          I build things for the web with{" "}
          <span className="font-medium text-fg-default">
            React and a bit of design sense
          </span>
          . I enjoy learning, improving, and making videos about what I discover
          along the way.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 sm:mt-6">
          <Button variant="inverse">Download Resume</Button>
          <Button asChild>
            <a href={"#contact-me"}>Contact Me</a>
          </Button>
        </div>
      </FadeStaggeredAnimation>
    </div>

    <motion.div
      animate={{ opacity: 1 }}
      className="absolute right-0 bottom-10 h-[18.25rem] w-[18.25rem] md:h-[26.25rem] md:w-[26.25rem]"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{
        delay: 1,
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <Profile className="size-full" />
    </motion.div>
  </div>
);

export { Hero };

// (
//   <motion.p
//     animate={{ opacity: 1, y: 0 }}
//     className="font-mono text-fg-tertiary/80 text-xs sm:text-sm"
//     exit={{ opacity: 0, y: -30 }}
//     initial={{ opacity: 0, y: 30 }}
//     transition={{ type: "spring", stiffness: 150, damping: 20 }}
//   >
//     Hey It&apos;s me,{" "}
//     <span className="font-medium text-fg-brand text-xs sm:text-sm">
//       Frontend Developer
//     </span>
//   </motion.p>
// ) < motion.h1;
// animate={{ opacity: 1, y: 0 }
// }
//         className="mt-1 bg-gradient-to-br from-fg-default to-fg-tertiary/90 bg-clip-text font-bold font-inter text-4xl/[1.2] text-transparent tracking-tight sm:mt-0 sm:font-extrabold sm:text-5xl/[1.2] md:text-7xl/[1.2] dark:to-fg-tertiary/80"
//         exit=
// {
//   {
//     opacity: 0, y;
//     : -30
//   }
// }
// initial={{ opacity: 0, y: 30 }
// }
//         transition=
// {
//   {
//     type: "spring", stiffness;
//     : 150,
//           damping: 20,
//           delay: 0.05,
//   }
// }
// >
//         Htet Aung Lin
//       </motion.h1>

//       <motion.p
//         animate=
// {
//   {
//     opacity: 1, y;
//     : 0
//   }
// }
// className =
//   "mt-3 max-w-3xl text-base text-fg-tertiary sm:mt-2 sm:text-lg/relaxed";
// exit={{ opacity: 0, y: -30 }
// }
//         initial=
// {
//   {
//     opacity: 0, y;
//     : 30
//   }
// }
// transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.1 }
// }
//       >
//         I build things
// for the web with{" "}
// (
//   <span className="font-medium text-fg-default">
//     React and a bit of design sense
//   </span>
// ).I;
// enjoy;
// learning, improving, and;
// making;
// videos;
// about;
// what;
// I;
// discover;
// along;
// the;
// way.
// </motion.p>

//       <motion.div
//         animate=
// {
//   {
//     opacity: 1, y;
//     : 0
//   }
// }
// className = "mt-4 flex flex-wrap items-center gap-4 sm:mt-6";
// exit={{ opacity: 0, y: -30 }
// }
//         initial=
// {
//   {
//     opacity: 0, y;
//     : 30
//   }
// }
// transition={{
//           type: "spring",
//           stiffness: 150,
//           damping: 20,
//           delay: 0.15,
//         }
// }
//       >
//         <Button variant="inverse">Download Resume</Button>
//         <Button asChild>
//           <a href=
// {
//   ("#contact-me");
// }
// >Contact Me</a>
//         </Button>
//       </motion.div>
