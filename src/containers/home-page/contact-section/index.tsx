"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import emailjs from "@emailjs/browser";

import { messageSchema } from "./messageSchema";
import AnimatedDiv from "@/components/animation/AnimateDiv";

// =================================================================

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(messageSchema),
  });
  const [loading, setLoading] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = async () => {
    if (!form.current) return;

    setLoading(true);
    emailjs
      .sendForm(
        "service_ag3jteg",
        "template_fqcmgsc",
        form.current,
        "htYCUxDW6IaUYA3i2",
      )
      .then(() => reset())
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const renderTitle = (
    <AnimatedDiv
      duration={0.5}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      className="mb-10 w-full"
    >
      <h3 className=" font-righteous text-3xl text-navy-blue dark:text-light-blue sm:text-5xl">
        CONTACT ME
      </h3>
    </AnimatedDiv>
  );

  const inputElClass = `w-full bg-transparent font-semibold placeholder-pink dark:placeholder-pale-pink text-dark-pink dark:text-pink my-2 border-b  p-3 text-sm sm:text-base ${
    errors.email ? "border-red-500" : "border-zinc-800"
  } ${loading && "pointer-events-none brightness-50"}`;

  const renderForm = (
    <form onSubmit={handleSubmit(sendEmail)} ref={form} autoComplete="true">
      {errors.name && (
        <p className="font-dmSans text-rose-500">{errors?.name.message}</p>
      )}
      <input
        className={inputElClass}
        type="text"
        autoComplete="true"
        placeholder="NAME"
        {...register("name")}
      />
      {errors.email && (
        <p className="font-dmSans text-rose-500">{errors?.email.message}</p>
      )}
      <input
        className={inputElClass}
        type="text"
        placeholder="EMAIL"
        autoComplete="true"
        {...register("email")}
      />

      {errors.message && (
        <p className="font-dmSans text-rose-500">{errors?.message.message}</p>
      )}
      <textarea
        className={inputElClass}
        style={{ maxHeight: "15rem" }}
        placeholder="MESSAGE"
        {...register("message")}
      />

      <button
        className={`mt-2 rounded border border-dark-pink bg-dark-pink p-3 text-sm font-semibold text-gray-300 transition duration-500 hover:bg-transparent hover:text-dark-pink dark:border-pink dark:bg-pink dark:text-zinc-900 dark:hover:text-pink sm:p-5 sm:text-base ${
          loading && "pointer-events-none brightness-50"
        }`}
        type="submit"
      >
        SEND ME A MESSAGE
      </button>
    </form>
  );

  return (
    <section
      id="contact"
      className="mx-auto flex w-5/6 max-w-screen-smd flex-col items-center pb-20 pt-10 md:h-full md:py-48"
    >
      {renderTitle}

      <AnimatedDiv
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        delayTime={0.2}
        duration={0.5}
        className="w-full max-w-4xl border border-zinc-800 p-5 md:mt-0"
      >
        {renderForm}
      </AnimatedDiv>
    </section>
  );
};

export default Contact;
