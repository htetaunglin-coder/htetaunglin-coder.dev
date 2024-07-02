"use client";

import { useRef, useState } from "react";

import { useForm } from "react-hook-form";

import emailjs from "@emailjs/browser";
import { yupResolver } from "@hookform/resolvers/yup";

import { messageSchema } from "./messageSchema";

// Environment variables
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID as string;

const ContactForm = () => {
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
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, USER_ID)
      .then(() => reset())
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const inputElClass = `w-full bg-transparent font-semibold placeholder-pink dark:placeholder-pale-pink text-dark-pink dark:text-pink my-2 border-b p-3 text-sm sm:text-base ${
    errors.email ? "border-red-500" : "border-zinc-800"
  } ${loading && "pointer-events-none brightness-50"}`;

  return (
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
        className={`mt-2 rounded border border-dark-pink bg-dark-pink p-3 text-sm font-semibold text-gray-300 transition duration-500 hover:bg-transparent hover:text-dark-pink dark:border-pink dark:bg-pink dark:text-zinc-900 dark:hover:bg-transparent dark:hover:text-pink sm:p-5 sm:text-base ${
          loading && "pointer-events-none brightness-50"
        }`}
        type="submit"
      >
        SEND ME A MESSAGE
      </button>
    </form>
  );
};

export default ContactForm;
