import { Splide, SplideSlide } from "@splidejs/react-splide";
import skillData from "../../assets/skills/skillImages";

import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";

import SectionTitle from "../../components/SectionTitle";

const MobileSkills = () => {
  return (
    <section id="skills" className="py-16">
      <SectionTitle content={"Skills"} />

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
        className="pb-10 mx-auto max-w-sm mt-3">
        {skillData.map((data) => (
          <SplideSlide key={data.title}>
            <img
              src={data.image}
              loading="lazy"
              className="brightness-75 w-full px-5 mt-4"
            />
            <p className="text-gray-800 dark:text-gray-200 text-center font-dmSans pt-2 text-xs font-medium dark:font-normal">
              {data.title}
            </p>
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
};

export default MobileSkills;
