import skillData from "../_data/skill-data.json";

// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";

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
          <img
            src={data.imageUrl}
            loading="lazy"
            className="mt-4 w-full px-5 brightness-75"
          />
          <p className="pt-2 text-center font-dmSans text-xs font-medium text-gray-800 dark:font-normal dark:text-gray-200">
            {data.title}
          </p>
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default MobileView;
