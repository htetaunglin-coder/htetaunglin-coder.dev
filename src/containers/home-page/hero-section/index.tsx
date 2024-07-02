import Image from "next/image";

import AnimatedDiv from "@/components/animation/AnimateDiv";
import TextReveal from "@/components/animation/TextReveal";

import heroSectionData from "../_data/hero-section-data.json";

// =============================================================

const HeroSection = () => {
  const { name, position, description, backgroundImageUrl } = heroSectionData;

  return (
    <section
      id="home"
      className="scroll-effect relative mx-auto flex min-h-screen w-5/6 max-w-screen-smd items-center justify-center border-b border-b-gray-700 md:items-start md:pt-56">
      <div className="text-center">
        <Title name={name} />
        <Position content={position} />
        <Description content={description} />
        <BackgroundProfileImg url={backgroundImageUrl} />
        <CallToAction />
      </div>
    </section>
  );
};

interface TitleProps {
  name: string;
}

const Title: React.FC<TitleProps> = ({ name }) => (
  <TextReveal delay={0}>
    <div className="text-clamp-title flex flex-col gap-4 text-start font-righteous sm:flex-row sm:text-center">
      <h2 className="text-stroke-black dark:text-stroke-white">
        HI, My Name is{" "}
      </h2>
      <h2 className="-mt-6 ml-[20%] text-navy-blue dark:text-light-blue sm:m-0">
        {name}
      </h2>
    </div>
  </TextReveal>
);

interface ContentProps {
  content: string;
}

const Position: React.FC<ContentProps> = ({ content }) => (
  <AnimatedDiv
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }}
    delayTime={2.75}
    duration={0.5}>
    <h3 className="-mt-1 mb-4 mr-10 text-start font-sans text-sm font-bold text-navy-blue underline dark:text-light-blue ss:text-end ss:text-base ss:no-underline sm:text-xl md:text-2xl">
      {content}
    </h3>
  </AnimatedDiv>
);

const Description: React.FC<ContentProps> = ({ content }) => (
  <div>
    <AnimatedDiv
      delayTime={1.75}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      duration={0.5}>
      <h3 className="text-clamp-sm my-4 -mt-1 max-w-96 text-start font-dmSans font-[500] leading-5 text-dark-pink dark:font-normal dark:text-pink ss:leading-normal">
        {content}
      </h3>
    </AnimatedDiv>
  </div>
);

interface ImageProps {
  url: string;
}

const BackgroundProfileImg: React.FC<ImageProps> = ({ url }) => (
  <span className="absolute bottom-0 right-0 w-3/5">
    <Image
      src={url}
      width={715}
      height={620}
      priority={false}
      alt="Profile Image"
      className="w-full select-none"
      draggable="false"
      loading="lazy"
    />
  </span>
);

const CallToAction: React.FC = () => (
  <AnimatedDiv
    className="flex justify-start"
    delayTime={2.3}
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }}
    duration={0.5}>
    <a
      className="xs:text-md rounded-sm border border-pink bg-dark-pink px-7 py-3 font-dmSans text-sm font-bold text-flat-black transition duration-500 hover:bg-transparent hover:text-dark-pink dark:bg-pink dark:hover:bg-transparent dark:hover:text-pink sm:text-lg"
      href="#contact">
      Contact Me
    </a>
  </AnimatedDiv>
);

export default HeroSection;
