// 2025. Karpathy, who named it, and real hands typing; the request types into a chat
// bubble in plain words; on «И ИИ пишет» code races down a small screen and the app
// itself prints out as a receipt of the month's spending.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useIn, usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { vibecodingLayersColors as colors, vibecodingLayersPalette as palette } from "../palette";
import { APP, EPISODE, PROMPT, SERIES } from "../data";
import { CUES, VO_RATE } from "../timeline";
import { BrandBar, ChatBubble, ClipTile, CutSticker, CutTear, Drift, EraHeader, Flash, Meter, Paper, Receipt, ReceiptLine, ReceiptRule, SceneShell, Stamp, Tag, clamp, useCue } from "../ui";

const RAIN = ["const app = createApp()", "spend.sum(month)", "<List items={rows} />", "fetch('/api/spend')", "export default App", "rows.map(r => r.sum)", "db.insert(row)", "chart.render()", "auth.check(user)", "format(total, '₽')"];

const CodeRain: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const q = useIn(at, "snappy");
  const k = Math.max(0, frame - at);
  return (
    <div style={{ width: 380, height: 300, overflow: "hidden", borderRadius: 14, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow, opacity: q, transform: `scale(${interpolate(q, [0, 1], [0.8, 1])})`, padding: "12px 16px" }}>
      <div style={{ transform: `translateY(${-k * 9}px)` }}>
        {Array.from({ length: 60 }, (_, i) => (
          <div key={i} style={{ fontFamily: theme.fonts.mono, fontSize: 19, lineHeight: 1.5, whiteSpace: "nowrap", color: i % 5 === 0 ? palette.text : palette.textDim, opacity: i * 1.2 < k + 12 ? 1 : 0 }}>
            {RAIN[i % RAIN.length]}
          </div>
        ))}
      </div>
    </div>
  );
};

export const VibeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue();
  const c = CUES.vibe;
  const makeAt = cue(c.make);
  const aiAt = cue(c.ai);
  const selfAt = cue(c.self) - 4;
  // the bubble finishes typing just before «И ИИ»
  const cps = PROMPT.length / ((((c.ai - c.make) / VO_RATE) * fps - 6) / fps);
  const ai = usePunch(aiAt, 16);
  const done = usePunch(selfAt, 14);
  const lift = interpolate(frame, [aiAt - 4, aiAt + 8], [0, 1], { easing: theme.ease.inOut, ...clamp });
  return (
    <SceneShell shake={ai.shake + done.shake * 0.6}>
      <CutTear>
        <Drift items={["AI", "AI", "→", "{ }"]} />
      </CutTear>
      <BrandBar series={SERIES} episode={EPISODE} delay={-30} />
      <EraHeader year="2025" title="ВАЙБКОДИНГ" at={0} titleAt={cue(c.word)} />
      <CutSticker src="images/vibecoding-layers/karpathy-cut.png" x={20} y={480} w={370} ratio={770 / 1061} at={cue(c.word) + 2} rot={-3} z={3} />
      <Tag at={cue(c.word) + 8} x={40} y={930} tone="paper" size={20} z={6}>
        АНДРЕЙ КАРПАТЫЙ
      </Tag>
      <div style={{ position: "absolute", left: 410, top: 520, zIndex: 4, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
        {frame >= cue(c.word) + 10 && (
          <Paper delay={cue(c.word) + 10} size={22}>
            ПРИДУМАЛ СЛОВО · ФЕВРАЛЬ 2025
          </Paper>
        )}
      </div>
      <Tag at={cue(c.word) + 18} x={410} y={590} tone="neutral" size={20}>
        СЛОВО ГОДА · COLLINS 2025
      </Tag>
      <ClipTile src="footage/vibecoding-layers/typing.mp4" x={410} y={680} w={610} h={300} rot={2} at={10} tag="ТЫ" z={2} focus="50% 60%" />
      <div style={{ position: "absolute", left: 64, top: 1010, zIndex: 5, transform: `translateY(${lift * -0}px)` }}>
        <ChatBubble text={PROMPT} at={makeAt} cps={cps} />
      </div>
      {frame >= aiAt && (
        <div style={{ position: "absolute", left: 64, top: 1215, zIndex: 4 }}>
          <Receipt width={540} tilt={-2} printFrom={aiAt + 4} printFrames={26} title={APP.title} number={APP.month}>
            {APP.rows.map((r, i) => (
              <ReceiptLine key={r.label} label={r.label} value={`${r.value} ₽`} size={24} delay={aiAt + 8 + i * 4} />
            ))}
            <ReceiptRule strong />
            <ReceiptLine label="ИТОГО" value={`${APP.total} ₽`} strong size={26} delay={aiAt + 22} />
          </Receipt>
        </div>
      )}
      {frame >= cue(c.writes) - 6 && (
        <div style={{ position: "absolute", left: 640, top: 1215, zIndex: 3 }}>
          <CodeRain at={cue(c.writes) - 6} />
        </div>
      )}
      {frame >= selfAt && (
        <div style={{ position: "absolute", left: 660, top: 1400, zIndex: 7 }}>
          <Stamp tone="hero" size={64} rotate={-6} delay={selfAt}>
            САМ
          </Stamp>
        </div>
      )}
      <Meter active={4} />
      <Flash amount={ai.energy * 0.7} />
    </SceneShell>
  );
};
