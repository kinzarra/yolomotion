import { z } from "zod";

// One film, two cuts. `lang` picks the voiceover, the captions and every
// string on screen; motion, palette and the demo stay in the code.
export const yolocoExplorerSchema = z.object({
  lang: z.enum(["en", "ru"]).describe("Which cut: English (author's voice) or Russian (house clone)"),
});

export type YolocoExplorerProps = z.infer<typeof yolocoExplorerSchema>;
