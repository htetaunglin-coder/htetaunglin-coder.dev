import AnimatedDiv from "@/components/animation/AnimateDiv";

import ContactForm from "./ContactForm";

// =================================================================

const Contact = () => {
  return (
    <section
      id="contact"
      className="mx-auto flex w-5/6 max-w-screen-smd flex-col items-center pb-20 pt-10 md:h-full md:py-48">
      <Title content="CONTACT ME" />
      <AnimatedDiv
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        delayTime={0.2}
        duration={0.5}
        className="w-full max-w-4xl border border-zinc-800 p-5 md:mt-0">
        <ContactForm />
      </AnimatedDiv>
    </section>
  );
};

interface TitleProps {
  content: string;
}

const Title: React.FC<TitleProps> = ({ content }: { content: string }) => (
  <AnimatedDiv
    duration={0.5}
    variants={{
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    }}
    className="mb-10 w-full">
    <h3 className=" font-righteous text-3xl text-navy-blue dark:text-light-blue sm:text-5xl">
      {content}
    </h3>
  </AnimatedDiv>
);

export default Contact;
