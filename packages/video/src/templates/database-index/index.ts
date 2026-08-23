import { defineTemplate } from "../types";
import { DatabaseIndex } from "./DatabaseIndex";
import { databaseIndexSchema } from "./schema";
import { DURATION } from "./timeline";

export const databaseIndex = defineTemplate({
  id: "database-index",
  name: "VibeCloud — Why Indexes Matter",
  description:
    "30s vertical Short: an app that dies at 100k users, a full table scan, the table-of-contents analogy, CREATE INDEX, and the same query landing instantly.",
  schema: databaseIndexSchema,
  defaultProps: {
    brandName: "VibeCloud",
    chapter: "INDEXES · 101",
    query: "SELECT * FROM users WHERE email = 'alex@vibe.dev'",
    indexStatement: "CREATE INDEX idx_users_email ON users(email);",
    targetEmail: "alex@vibe.dev",
    closingLine: "UNDERSTAND THE CODE YOUR AI WRITES.",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: DatabaseIndex,
});
