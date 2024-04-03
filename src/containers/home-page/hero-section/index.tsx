"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import Image from "next/image";

import AnimatedDiv from "@/components/animation/AnimateDiv";
import TextReveal from "@/components/animation/TextReveal";

// =============================================================

const HeroSection = () => {
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  const renderTitle = isDesktop ? (
    <TextReveal delay={0}>
      <div className="text-clamp-title flex gap-4 text-center font-righteous">
        <h2 className="text-stroke-black dark:text-stroke-white">
          HI, My Name is{" "}
        </h2>
        <h2 className="text-navy-blue dark:text-light-blue">Htet Aung Lin </h2>
      </div>
    </TextReveal>
  ) : (
    <AnimatedDiv
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      duration={3}
      className="text-clamp-title flex flex-col text-start font-righteous"
    >
      <h2 className="text-stroke-black dark:text-stroke-white">
        HI, My Name is{" "}
      </h2>
      <h2 className="-mt-2 ml-[20%] text-navy-blue dark:text-light-blue">
        Htet Aung Lin{" "}
      </h2>
    </AnimatedDiv>
  );

  const renderSubTitle = (
    <AnimatedDiv
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      delayTime={2.75}
      duration={0.5}
    >
      <h3 className="-mt-1 mb-4 mr-10 text-start font-sans text-sm font-bold text-navy-blue underline dark:text-light-blue ss:text-end ss:text-base ss:no-underline sm:text-xl md:text-2xl">
        Junior Frontend Developer
      </h3>
    </AnimatedDiv>
  );

  const renderDescription = (
    <div>
      <AnimatedDiv
        delayTime={1.75}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        duration={0.5}
      >
        <h3 className="text-clamp-sm my-4 -mt-1 text-start font-dmSans font-[500] leading-5 text-dark-pink dark:font-normal dark:text-pink ss:leading-normal">
          {!isDesktop ? (
            <>
              I'm passionate about building visually stunning websites with
              intuitive and functional user interfaces.
            </>
          ) : (
            <>
              {" "}
              I'm passionate about <br /> building visually stunning websites{" "}
              <br />
              with intuitive and functional user interfaces.
            </>
          )}
        </h3>
      </AnimatedDiv>
    </div>
  );

  const renderCallToAction = (
    <AnimatedDiv
      className="flex justify-start"
      delayTime={2.3}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      duration={0.5}
    >
      <a
        className="xs:text-md rounded-sm border border-pink bg-dark-pink px-7 py-3 font-dmSans text-sm font-bold text-flat-black transition duration-500 hover:bg-transparent hover:text-dark-pink dark:bg-pink dark:hover:bg-transparent dark:hover:text-pink sm:text-lg"
        href="#contact"
      >
        Contact Me
      </a>
    </AnimatedDiv>
  );

  const renderBackgroundProfileImg = (
    <span className="absolute bottom-0 right-0 w-3/5">
      <Image
        src={"/assets/images/profile.svg"}
        width={715}
        height={620}
        priority={false}
        alt="Htet Aung Lin"
        className="w-full select-none"
        draggable="false"
        loading="lazy"
      />
    </span>
  );

  return (
    <section
      id="home"
      className="scroll-effect relative mx-auto flex min-h-screen w-5/6 max-w-screen-smd items-center justify-center border-b border-b-gray-700 md:items-start md:pt-56"
    >
      <div className="text-center">
        {renderTitle}

        {renderSubTitle}

        {renderDescription}

        {renderCallToAction}

        {renderBackgroundProfileImg}
      </div>
    </section>
  );
};

export default HeroSection;
