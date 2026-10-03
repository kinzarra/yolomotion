import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { mcpPalette } from "./palette";
import { YolocoMcpProps } from "./schema";
import { CHAT_SPAN, SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { AgentsScene } from "./scenes/AgentsScene";
import { McpScene } from "./scenes/McpScene";
import { ToolsScene } from "./scenes/ToolsScene";
import { ChatScene } from "./scenes/ChatScene";
import { CtaScene } from "./scenes/CtaScene";

export const YolocoMcp: React.FC<YolocoMcpProps> = ({ query, ctaUrl }) => (
  <Reel
    palette={mcpPalette}
    voiceoverDir="yoloco-mcp"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    captions={{
      activeColor: mcpPalette.primary,
      heroColor: mcpPalette.primary,
      fontFamily: theme.fonts.display,
    }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene />
    </Scene>
    <Scene spec={SCENES.agents} name="02 agents">
      <AgentsScene />
    </Scene>
    <Scene spec={SCENES.mcp} name="03 mcp">
      <McpScene />
    </Scene>
    <Scene spec={SCENES.tools} name="04 tools">
      <ToolsScene />
    </Scene>
    {/* ask + analyze + plan: one continuous chat, three spoken lines */}
    <Scene spec={CHAT_SPAN} name="05-07 chat">
      <ChatScene query={query} />
    </Scene>
    <Scene spec={SCENES.cta} name="08 cta">
      <CtaScene url={ctaUrl} />
    </Scene>
  </Reel>
);
