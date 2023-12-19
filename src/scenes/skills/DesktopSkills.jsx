import skillData from "../../assets/skills/skillImages";
import { motion } from "framer-motion";
import SectionTitle from "../../components/SectionTitle";

const DesktopSkills = () => {
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

const EachSkillCard = ({ data }) => {
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
        src={data.image}
        alt={data.title}
        className="w-1/3 max-w-[3rem] mx-auto select-none brightness-75"
        draggable="false"
        loading="lazy"
      />
      <p className="text-gray-800 dark:text-gray-400 font-semibold text-center mt-2 text-base">
        {data.title}
      </p>
    </motion.div>
  );
};

export default DesktopSkills;
