import { z } from "zod";

export const frontendSecretsSchema = z.object({
  brandName: z.string().min(1),
  chapter: z.string().min(1),
  /** Env-style name of the leaked secret, e.g. OPENAI_API_KEY. */
  secretName: z.string().min(1),
  /** The visible (fake) secret value that leaks through every scene. */
  secretValue: z.string().min(1),
  /** Domain shown in the deployed-app browser chrome. */
  appDomain: z.string().min(1),
  /** Two-line closing statement, split on the pipe. */
  closingLine: z.string().min(1),
  tagline: z.string().min(1),
});

export type FrontendSecretsProps = z.infer<typeof frontendSecretsSchema>;
