import { motion } from "framer-motion";
import skillData from "../_data/skill-data.json";

// ==================================================================

const DesktopView = () => {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.15 }}
        viewport={{ once: true }}
        className="mt-16 grid grid-cols-5 items-center justify-between gap-14"
      >
        {skillData.map((data) => (
          <EachSkill key={data.title} data={data} />
        ))}
      </motion.div>
    </>
  );
};

interface EachSkillProps {
  data: { imageUrl: string; title: string };
}

const EachSkill: React.FC<EachSkillProps> = ({ data }) => {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          x: -30,
        },
        visible: {
          x: 0,
          opacity: 1,
        },
      }}
      transition={{
        duration: 0.5,
        ease: "linear",
      }}
      className="w-full"
      key={data.title}
    >
      <img
        src={data.imageUrl}
        alt={data.title}
        className="mx-auto w-1/3 max-w-[3rem] select-none brightness-[0.8]"
        draggable="false"
        loading="lazy"
      />
      <p className="mt-2 text-center text-base font-semibold text-gray-800 dark:text-gray-400">
        {data.title}
      </p>
    </motion.div>
  );
};

export default DesktopView;
