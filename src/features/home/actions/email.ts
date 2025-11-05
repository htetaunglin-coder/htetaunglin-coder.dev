"use server";

import { Resend } from "resend";

export async function sendEmail(formData: FormData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!(email && message)) {
      return { error: "All fields are required" };
    }

    if (!process.env.RESEND_TO_EMAIL_ADDRESS) {
      return { error: "Missing environment variable: RESEND_TO_EMAIL_ADDRESS" };
    }

    await resend.emails.send({
      from: "Htet <htetaunglin.coder@gmail.com>",
      to: process.env.RESEND_TO_EMAIL_ADDRESS,
      subject: "Got a message from your portfolio",
      text: `
        Email: ${email}
        Message: ${message}
      `,
    });

    return { success: "Email sent successfully" };
  } catch (error: any) {
    if ("message" in error && error.message.includes("Missing API key")) {
      return { error: "Missing environment variable: RESEND_API_KEY" };
    }
    return { error: error.message ?? "Failed to send email" };
  }
}
