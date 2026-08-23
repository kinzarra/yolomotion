import { defineTemplate } from "../types";
import { RaceCondition } from "./RaceCondition";
import { raceConditionSchema } from "./schema";
import { DURATION } from "./timeline";

export const raceCondition = defineTemplate({
  id: "race-condition",
  name: "VibeCloud — You Sold The Same Ticket Twice",
  description:
    "30s vertical Short: two users buy the last ticket in the same millisecond and both succeed. Names the race condition, then replays it correctly with a transaction and a lock. Deep navy / VibeCloud orange, kinetic type, CS for vibe coders.",
  schema: raceConditionSchema,
  defaultProps: {
    brandName: "VibeCloud",
    chapter: "CONCURRENCY · 101",
    itemLabel: "TICKET",
    closingLine: "IF IT CAN HAPPEN|AT THE SAME TIME —|IT WILL.",
    signOff: "CS for vibe coders.",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: RaceCondition,
});
