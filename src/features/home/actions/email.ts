"use server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { kv } from "@vercel/kv";
import { headers } from "next/headers";
import { Resend } from "resend";

const MAX_EMAIL_PER_DAY = 3;

Redis.fromEnv();

// Use environment variable for prefix, with fallback
const RATELIMIT_PREFIX = process.env.KV_RATELIMIT_PREFIX || "email-ratelimit";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(MAX_EMAIL_PER_DAY, "1d"),
  prefix: RATELIMIT_PREFIX,
});

type ActionResponse = { success: string } | { error: string };

export async function sendEmail(formData: FormData): Promise<ActionResponse> {
  try {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "127.0.0.1";

    const { success, reset } = await ratelimit.limit(ip);

    if (!success) {
      const hours = Math.ceil((reset - Date.now()) / (1000 * 60 * 60));
      return {
        error: `You've reached your daily limit of ${MAX_EMAIL_PER_DAY} messages. Please try again in ${hours} hour${hours !== 1 ? "s" : ""}.`,
      };
    }
  } catch (error) {
    console.error("Rate limit check failed, allowing request:", error);
    return { error: "Unable to verify rate limit. Please try again." };
  }

  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!(email && message)) {
    return { error: "All fields are required" };
  }

  if (!process.env.RESEND_API_KEY) {
    return { error: "Missing environment variable: RESEND_API_KEY" };
  }

  if (!process.env.RESEND_TO_EMAIL_ADDRESS) {
    return { error: "Missing environment variable: RESEND_TO_EMAIL_ADDRESS" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.RESEND_TO_EMAIL_ADDRESS,
      subject: `[Portfolio] New Contact Form Message from ${email}`,
      text: `You received a new message from your portfolio contact form.

From: ${email}

Message:
${message}

---
Sent via Portfolio Contact Form`,
    });

    return { success: "Email sent successfully" };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { error: "Failed to send email. Please try again later." };
  }
}
