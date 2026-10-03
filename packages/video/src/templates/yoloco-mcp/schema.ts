import { z } from "zod";

// What a caller may change without editing the template: the demo query and
// the closing chip. Motion, palette and the cartoon stay in the code.
export const yolocoMcpSchema = z.object({
  query: z.string().describe("What the user types into the chat in the demo"),
  ctaUrl: z.string().describe("URL shown on the closing beat"),
});

export type YolocoMcpProps = z.infer<typeof yolocoMcpSchema>;
