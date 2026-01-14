import { z } from "zod";

export const PageStylesSchema = z.object({
  background: z.object({
    color: z.string().nullable(),
    image: z.string().optional(),
  }),
});

export type PageStyles = z.infer<typeof PageStylesSchema>;
