import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import AnimatedDiv from "../components/animation/AnimateDiv";

const userSchema = yup.object({
  name: yup
    .string()
    .required("Please enter your name")
    .min(3, "Name should be between 3 and 30 characters")
    .max(30, "Name should be between 3 and 30 characters"),
  email: yup
    .string()
    .email("Invalid Email")
    .required("Please enter your email"),
  message: yup
    .string()
    .required("Please enter your message")
    .min(5, "Message should be between 5 and 80 characters")
    .max(80, "Message should be between 5 and 80 characters"),
});

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const [loading, setLoading] = useState(false);

  const form = useRef();

  const sendEmail = async () => {
    setLoading(true);
    emailjs
      .sendForm(
        "service_ag3jteg",
        "template_fqcmgsc",
        form.current,
        "htYCUxDW6IaUYA3i2"
      )
      .then(() => reset())
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const inputElClass = `w-full bg-transparent font-semibold placeholder-dark-pink dark:placeholder-pale-pink text-pink my-2 border-b  p-3 text-sm sm:text-base ${
    errors.email ? "border-red-500" : "border-zinc-800"
  } ${loading && "pointer-events-none brightness-50"}`;

  return (
    <section
      id="contact"
      className="flex flex-col items-center pt-10 pb-20 md:py-48">
      {/* HEADINGS */}
      <AnimatedDiv
        duration={0.5}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        className="w-full mb-10">
        <h3 className=" font-righteous text-3xl sm:text-5xl text-navy-blue dark:text-light-blue">
          CONTACT ME
        </h3>
      </AnimatedDiv>

      {/* FORM & IMAGE */}
      <AnimatedDiv
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        delayTime={0.2}
        duration={0.5}
        className="w-full max-w-4xl border border-zinc-800 p-5 md:mt-0">
        <form onSubmit={handleSubmit(sendEmail)} ref={form} autoComplete="true">
          {errors.name && (
            <p className="text-rose-500 font-dmSans">{errors?.name.message}</p>
          )}
          <input
            className={inputElClass}
            type="text"
            name="name"
            autoComplete="true"
            placeholder="NAME"
            {...register("name")}
          />
          {errors.email && (
            <p className="text-rose-500 font-dmSans">{errors?.email.message}</p>
          )}
          <input
            className={inputElClass}
            type="text"
            placeholder="EMAIL"
            name="email"
            autoComplete="true"
            {...register("email")}
          />

          {errors.message && (
            <p className="text-rose-500 font-dmSans">
              {errors?.message.message}
            </p>
          )}
          <textarea
            className={inputElClass}
            name="message"
            style={{ maxHeight: "15rem" }}
            placeholder="MESSAGE"
            rows="4"
            cols="50"
            {...register("message")}
          />

          <button
            className={`p-3 sm:p-5 text-gray-300 dark:text-zinc-900 font-semibold mt-2 transition duration-500 border border-dark-pink dark:border-pink bg-dark-pink dark:bg-pink rounded hover:bg-transparent hover:text-dark-pink dark:hover:text-pink text-sm sm:text-base ${
              loading && "pointer-events-none brightness-50"
            }`}
            type="submit">
            SEND ME A MESSAGE
          </button>
        </form>
      </AnimatedDiv>
    </section>
  );
};

export default Contact;
