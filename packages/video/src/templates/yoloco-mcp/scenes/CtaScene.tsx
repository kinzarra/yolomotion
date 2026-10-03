// 08 cta — MCP, powered by Yoloco. QR to the app, the hosts it runs in, the
// public repo and the registry listing, and the author back in frame: his own
// drawing for this beat when delivered (public/footage/yoloco-mcp/philipp-cta.png),
// the thumbs-up phone from the collage until then.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { mcpColors, mcpPalette } from "../palette";
import {
  ClaudeMark,
  Icon,
  IconName,
  Kinetic,
  Label,
  MonoChip,
  PhoneCard,
  QrCode,
  Rise,
  SceneShell,
  YolocoMark,
  YolocoWordmark,
  hasStatic,
  useIn,
} from "../ui";

const CTA_ART = "footage/yoloco-mcp/cut-philipp-cta.png";
const HOSTS: { name: string; icon?: IconName }[] = [{ name: "Claude" }, { name: "Codex", icon: "blossom" }, { name: "Cursor", icon: "cube" }];
const LINKS: { icon: IconName; text: string }[] = [
  { icon: "code", text: "github.com/yoloco/mcp" },
  { icon: "list", text: "mcpservers.org/servers/yoloco/mcp" },
];

export const CtaScene: React.FC<{ url: string }> = ({ url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const me = useIn(6, "smooth");
  const custom = hasStatic(CTA_ART);
  return (
    <SceneShell exit={false}>
      <div style={{ position: "absolute", left: 90, top: 262 }}>
        <Label delay={4}>THE NEW ERA OF INFLUENCER MARKETING</Label>
      </div>
      <div style={{ position: "absolute", left: 84, top: 306 }}>
        <Kinetic text="MCP" size={200} weight={800} delay={2} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 530 }}>
        <Label delay={10} size={22}>POWERED BY</Label>
      </div>
      <div style={{ position: "absolute", left: 90, top: 574, display: "flex", alignItems: "center", gap: 22 }}>
        <YolocoMark size={92} delay={12} />
        <YolocoWordmark delay={16} size={82} />
      </div>

      {/* where it runs */}
      <Rise delay={22} style={{ position: "absolute", left: 90, top: 712, display: "flex", gap: 14, alignItems: "center" }}>
        {HOSTS.map((h) => (
          <div key={h.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: mcpColors.surfaceStrong,
                border: `1px solid ${mcpColors.lineStrong}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {h.icon ? <Icon name={h.icon} size={34} /> : <ClaudeMark size={34} spin={0} />}
            </div>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: 16, color: mcpPalette.textDim, letterSpacing: "0.06em" }}>{h.name}</span>
          </div>
        ))}
        <MonoChip size={17} color={mcpPalette.textDim} style={{ marginLeft: 6, alignSelf: "flex-start", marginTop: 16 }}>
          + any MCP client
        </MonoChip>
      </Rise>

      {/* the code, then the address it encodes */}
      <div style={{ position: "absolute", left: 90, top: 836 }}>
        <QrCode size={340} delay={Math.round(0.75 * fps)} />
      </div>
      <Rise delay={Math.round(1.6 * fps)} style={{ position: "absolute", left: 90, top: 1192 }}>
        <MonoChip size={23} color={mcpPalette.text} border={mcpPalette.primary}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: mcpPalette.primary, opacity: Math.sin(frame / 7) > 0 ? 1 : 0.35 }} />
          {url}
        </MonoChip>
      </Rise>
      <div style={{ position: "absolute", left: 90, top: 1256, display: "flex", flexDirection: "column", gap: 8 }}>
        {LINKS.map((l, i) => (
          <Rise key={l.text} delay={Math.round(2 * fps) + i * 5} style={{ display: "flex" }}>
            <MonoChip size={19} color={mcpPalette.textDim} border={mcpColors.line}>
              <Icon name={l.icon} size={20} color={mcpPalette.textDim} />
              {l.text}
            </MonoChip>
          </Rise>
        ))}
      </div>

      {/* the author: his own drawing for this beat, or the collage phone meanwhile */}
      <div
        style={{
          position: "absolute",
          left: 556,
          top: 706,
          width: 480,
          height: 640,
          opacity: me,
          transform: `translateX(${interpolate(me, [0, 1], [80, 0])}px)`,
        }}
      >
        {custom ? (
          /* He points to his left, which in frame is toward the QR code.
             Bottom-aligned so the crop at his waist sits on the frame edge. */
          <Img
            src={staticFile(CTA_ART)}
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: 480,
              height: 640,
              objectFit: "contain",
              objectPosition: "bottom",
              maxWidth: "none",
              transform: `translateY(${Math.sin(t * 1.6) * 6}px)`,
              filter: `drop-shadow(0 26px 60px ${mcpPalette.glow})`,
            }}
          />
        ) : (
          <div style={{ position: "absolute", left: 130, top: 40 }}>
            <PhoneCard src="footage/yoloco-mcp/philipp-thumbsup.png" width={250} tilt={-6} delay={6} />
          </div>
        )}
      </div>
    </SceneShell>
  );
};
