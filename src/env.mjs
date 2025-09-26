import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_URL: z.url().min(1),
    GITHUB_ID: z.string().min(1),
    GITHUB_SECRET: z.string().min(1),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
  },
});
