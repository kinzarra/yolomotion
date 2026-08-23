import { defineTemplate } from "../types";
import { DatabaseGuide } from "./DatabaseGuide";
import { databaseGuideSchema } from "./schema";
import { DURATION } from "./timeline";

export const databaseGuide = defineTemplate({
  id: "database-guide",
  name: "Vibe Cloud Database Guide",
  description: "30s vertical Reels guide: what a database is, why an app needs it, and why vibecoders choose Supabase/PostgreSQL.",
  schema: databaseGuideSchema,
  defaultProps: {
    brandName: "Vibe Cloud",
    cta: "Follow for the next guide: Auth and APIs",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: DatabaseGuide,
});
