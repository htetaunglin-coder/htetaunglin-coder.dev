import { defineCollections, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform((value, context) => {
        try {
          return new Date(value);
        } catch {
          context.addIssue({
            code: "custom",
            message: "Invalid date",
          });
          return z.NEVER;
        }
      }),
    tags: z.array(z.string()).optional(),
    image: z.object({
      url: z.string(),
      author_name: z.string(),
      author_link: z.url(),
    }),
    draft: z.boolean().optional().default(false),
    series: z
      .array(z.enum(["technology", "thoughts"]))
      .min(1)
      .max(2),
  }),
});
