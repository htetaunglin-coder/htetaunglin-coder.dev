import SectionTitle from "@/components/sectionTItle/SectionTItle";
import skillData from "./data.json";
import { motion } from "framer-motion";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";

interface EachSkillCardProps {
  data: { imageUrl: string; title: string };
}

export const DesktopSkills = () => {
  const EachSkillCard: React.FC<EachSkillCardProps> = ({ data }) => {
    return (
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
          },
          visible: {
            opacity: 1,
          },
        }}
        transition={{
          duration: 0.78,
          ease: "linear",
        }}
        className="w-full"
        key={data.title}>
        <img
          src={data.imageUrl}
          alt={data.title}
          className="w-1/3 max-w-[3rem] mx-auto select-none brightness-75"
          draggable="false"
          loading="lazy"
        />
        <p className="text-gray-800 dark:text-gray-400 font-semibold text-center mt-2 text-base">{data.title}</p>
      </motion.div>
    );
  };

  return (
    <section id="skills" className="py-24">
      <SectionTitle content="Skills" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.25 }}
        viewport={{ once: true }}
        className="w-full mt-16 flex items-center justify-between">
        {skillData.map((data, idx) => {
          if (idx > 4) return;
          return <EachSkillCard key={data.title} data={data} />;
        })}
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.5 }}
        className="w-full mt-16 flex items-center justify-between mx-auto">
        {skillData.map((data, idx) => {
          if (idx <= 4) return;
          return <EachSkillCard key={data.title} data={data} />;
        })}
      </motion.div>
    </section>
  );
};

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
          <SplideSlide key={`mobile-${data.title}`}>
            <img src={data.imageUrl} loading="lazy" className="brightness-75 w-full px-5 mt-4" />
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
