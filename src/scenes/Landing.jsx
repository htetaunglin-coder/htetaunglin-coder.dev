import useMediaQuery from "../hooks/useMediaQuery";
import AnimatedDiv from "../components/animation/AnimateDiv";
import profile from "../assets/profile1.svg";
import { Reveal as TextReval } from "../components/animation/Reveal";

const Landing = () => {
  const isSmallSize = useMediaQuery("(max-width: 38.6875rem)");
  return (
    <section className="w-full h-full">
      <div className="text-center">
        {/* Title */}
        {!isSmallSize ? (
          // for desktop

          <TextReval>
            <div className="text-center text-clamp-title font-righteous flex gap-4">
              <h2 className="text-stroke-black dark:text-stroke-white">
                HI, My Name is{" "}
              </h2>
              <h2 className="text-navy-blue dark:text-light-blue">
                Htet Aung Lin{" "}
              </h2>
            </div>
          </TextReval>
        ) : (
          // for mobile
          <AnimatedDiv
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            duration={3}
            className="text-start text-clamp-title font-righteous flex flex-col">
            <h2 className="text-stroke-black dark:text-stroke-white">
              HI, My Name is{" "}
            </h2>
            <h2 className="text-navy-blue dark:text-light-blue ml-[20%] -mt-2">
              Htet Aung Lin{" "}
            </h2>
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
          <h3 className="font-sans text-sm font-bold -mt-1 mr-10 mb-4 text-navy-blue dark:text-light-blue text-start underline ss:no-underline ss:text-base sm:text-xl md:text-2xl ss:text-end">
            A Junior Frontend Developer
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
                  I'm passionate about building visually stunning websites with
                  intuitive and functional user interfaces.
                </>
              ) : (
                <>
                  {" "}
                  I'm passionate about <br /> building visually stunning
                  websites <br />
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
            className="bg-dark-pink dark:bg-pink border border-pink text-flat-black rounded-sm py-3 px-7 font-bold font-dmSans text-sm xs:text-md sm:text-lg hover:bg-transparent hover:text-dark-pink dark:hover:text-pink transition duration-500"
            href="#contact">
            Contact Me
          </a>
        </AnimatedDiv>

        {/* profile image */}
        <span className="absolute bottom-0 right-0 w-3/5">
          <img
            src={profile}
            alt="Htet Aung Lin"
            className="select-none w-full"
            draggable="false"
            loading="lazy"
          />
        </span>
      </div>
    </section>
  );
};

export default Landing;
