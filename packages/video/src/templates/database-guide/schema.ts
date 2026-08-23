import { z } from "zod";

export const databaseGuideSchema = z.object({
  brandName: z.string().min(1),
  cta: z.string().min(1),
});

export type DatabaseGuideProps = z.infer<typeof databaseGuideSchema>;
