"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "../actions/email";

const contactSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("message", data.message);

    const result = await sendEmail(formData);

    if (result.success) {
      toast.success("Success", { description: result.success });
      reset();
    } else {
      toast.error("Error", { description: result.error });
    }
  }

  return (
    <div className="w-full">
      <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
        Let&apos;s Connect
      </h2>
      <p className="mt-1 w-full text-base/relaxed text-fg-tertiary sm:max-w-md">
        Have a project in mind or just want to say hi? My inbox is always open,
        I&apos;d love to hear from you.
      </p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label
            className="mb-2 inline-block text-fg-secondary/80 text-sm"
            htmlFor="email"
          >
            Email Address
          </Label>
          <Input
            className="opacity-80"
            id="email"
            placeholder="Enter your email address..."
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-2 text-fg-danger text-sm">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label
            className="mb-2 inline-block text-fg-secondary/80 text-sm"
            htmlFor="message"
          >
            Your message
          </Label>
          <Textarea
            className="opacity-80"
            id="message"
            placeholder="Say hello or share what you have in mind..."
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-2 text-fg-danger text-sm">
              {errors.message.message}
            </p>
          )}
        </div>
        <div className="flex w-full justify-end pt-4">
          <Button
            className="gap-2"
            disabled={isSubmitting}
            loading={isSubmitting}
            type="submit"
            variant="inverse"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export { Contact };
