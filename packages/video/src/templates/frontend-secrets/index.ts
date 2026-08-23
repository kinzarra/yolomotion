import { defineTemplate } from "../types";
import { FrontendSecrets } from "./FrontendSecrets";
import { frontendSecretsSchema } from "./schema";
import { DURATION } from "./timeline";

export const frontendSecrets = defineTemplate({
  id: "frontend-secrets",
  name: "VibeCloud — Your API Key Is Not Secret",
  description:
    "30s vertical Short: an API key shipped in frontend code, the app ripped open into DevTools, the leak found in the bundle, and the browser → backend → API fix with the secret locked server-side.",
  schema: frontendSecretsSchema,
  defaultProps: {
    brandName: "VibeCloud",
    chapter: "SECURITY · 101",
    secretName: "OPENAI_API_KEY",
    secretValue: "sk-proj-4f81kQ…Vz2M",
    appDomain: "lumen.app",
    closingLine: "IF THE BROWSER CAN SEE IT,|THE USER CAN SEE IT.",
    tagline: "CS for vibe coders.",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: FrontendSecrets,
});
