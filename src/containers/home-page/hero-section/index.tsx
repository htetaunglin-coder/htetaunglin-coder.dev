"use client";

import AnimatedDiv from "@/components/animation/AnimateDiv";
import useMediaQuery from "@/hooks/useMediaQuery";
import TextReveal from "@/components/animation/TextReveal";
import Image from "next/image";

const HeroSection = () => {
  const isSmallSize = useMediaQuery("(max-width: 38.6875rem)");
  return (
    <section className="w-full h-full">
      <div className="text-center">
        {/* Title */}
        {!isSmallSize ? (
          // for desktop

          <TextReveal delay={0}>
            <div className="flex gap-4 text-center text-clamp-title font-righteous">
              <h2 className="text-stroke-black dark:text-stroke-white">HI, My Name is </h2>
              <h2 className="text-navy-blue dark:text-light-blue">Htet Aung Lin </h2>
            </div>
          </TextReveal>
        ) : (
          // for mobile
          <AnimatedDiv
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            duration={3}
            className="flex flex-col text-start text-clamp-title font-righteous">
            <h2 className="text-stroke-black dark:text-stroke-white">HI, My Name is </h2>
            <h2 className="text-navy-blue dark:text-light-blue ml-[20%] -mt-2">Htet Aung Lin </h2>
          </AnimatedDiv>
        )}

        {/* sub title */}
        <AnimatedDiv
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          delayTime={2.75}
          duration={0.5}>
          <h3 className="mb-4 mr-10 -mt-1 font-sans text-sm font-bold underline text-navy-blue dark:text-light-blue text-start ss:no-underline ss:text-base sm:text-xl md:text-2xl ss:text-end">
            Junior Frontend Developer
          </h3>
        </AnimatedDiv>

        {/* description */}
        <div>
          <AnimatedDiv
            delayTime={1.75}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            duration={0.5}>
            <h3 className="my-4 text-clamp-sm leading-5 ss:leading-normal -mt-1 font-dmSans text-dark-pink dark:text-pink text-start font-[500] dark:font-normal">
              {isSmallSize ? (
                <>
                  I'm passionate about building visually stunning websites with intuitive and functional user
                  interfaces.
                </>
              ) : (
                <>
                  {" "}
                  I'm passionate about <br /> building visually stunning websites <br />
                  with intuitive and functional user interfaces.
                </>
              )}
            </h3>
          </AnimatedDiv>
        </div>

        {/* call to action */}
        <AnimatedDiv
          className="flex justify-start"
          delayTime={2.3}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          duration={0.5}>
          <a
            className="py-3 text-sm font-bold transition duration-500 border rounded-sm bg-dark-pink dark:bg-pink border-pink text-flat-black px-7 font-dmSans xs:text-md sm:text-lg hover:bg-transparent hover:text-dark-pink dark:hover:text-pink"
            href="#contact">
            Contact Me
          </a>
        </AnimatedDiv>

        {/* profile image */}
        <span className="absolute bottom-0 right-0 w-3/5">
          <Image
            src={"/assets/images/profile.svg"}
            width={715}
            height={620}
            alt="Htet Aung Lin"
            className="w-full select-none"
            draggable="false"
            loading="lazy"
          />
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
