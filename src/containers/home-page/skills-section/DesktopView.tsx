import { motion } from "framer-motion";
import skillData from "../_data/skill-data.json";

// ==================================================================

const DesktopView = () => {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.25 }}
        viewport={{ once: true }}
        className="mt-16 flex w-full items-center justify-between"
      >
        {skillData.slice(0, 5).map((data) => (
          <EachSkill key={data.title} data={data} />
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.5 }}
        className="mx-auto mt-16 flex w-full items-center justify-between"
      >
        {skillData.slice(5).map((data) => (
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
