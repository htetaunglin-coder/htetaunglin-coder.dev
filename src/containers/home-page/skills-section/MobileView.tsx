import skillData from "../_data/skill-data.json";

// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";
import Image from "next/image";

// ====================================================================

const MobileView = () => {
  return (
    <Splide
      options={{
        perPage: 3,
        arrows: false,
        gap: "0.5rem",
        breakpoints: {
          680: {
            perPage: 3,
          },
        },
      }}
      className="mx-auto mt-3 max-w-sm pb-10"
    >
      {skillData.map((data) => (
        <SplideSlide key={`mobile-${data.title}`}>
          <div className="flex w-full flex-col items-center justify-center">
            <Image
              width={40}
              height={40}
              alt={data.title}
              src={data.imageUrl}
              loading="lazy"
              className={`mt-4 w-full max-w-11 brightness-75 ${data.title === "Nextjs" && "dark:invert"}`}
            />
            <p className="w-full max-w-11 pt-2 text-center font-dmSans text-xs font-medium text-gray-800 dark:font-normal dark:text-gray-200">
              {data.title}
            </p>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default MobileView;
