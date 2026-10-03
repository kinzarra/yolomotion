import { defineTemplate } from "../types";
import { YolocoMcp } from "./YolocoMcp";
import { yolocoMcpSchema } from "./schema";
import { DURATION } from "./timeline";

export const yolocoMcp = defineTemplate({
  id: "yoloco-mcp",
  name: "Yoloco MCP — Influencer marketing runs on agents",
  description:
    "~50s English TikTok promo: cartoon Philipp snaps his fingers, the chaos desk becomes the agent era, and a Claude chat finds, vets and media-plans Florida fitness creators through the Yoloco MCP server. QR to app.yoloco.io/mcp.",
  schema: yolocoMcpSchema,
  defaultProps: {
    query: "Find me fitness instructors in Florida",
    ctaUrl: "app.yoloco.io/mcp",
  },
  durationInSeconds: DURATION,
  formats: ["reel"],
  component: YolocoMcp,
});
