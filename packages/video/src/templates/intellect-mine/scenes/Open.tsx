// The hook and the promise: the face, the claim («не нефть, не золото:
// интеллект»), the 700-billion figure as the first evidence, then the route.
import React from "react";
import { useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { imColors as colors, imPalette as palette } from "../palette";
import { LoopBg, Burst, Face, Flash, GlassChip, Kinetic, L, Label, LogoPlate, MediaCard, SceneShell, Slam, Stamp, TopBar, V, mono, useSec } from "../ui";
import { FACE } from "../face";
import { VO_RATE, cue } from "../timeline";

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const s = useSec();
  const at = (w: string, n = 0) => s(cue("hook", w, n));
  const faceEnd = s(FACE.shots.hook.duration / VO_RATE);
  const oil = at("нефть");
  const gold = at("золото");
  const iq = at("интеллект");
  const big = at("700");
  const p1 = usePunch(oil, 12);
  const p2 = usePunch(gold, 12);
  const p3 = usePunch(iq, 16);
  const p4 = usePunch(big, 18);
  const cut = usePunch(faceEnd, 12);
  const face = frame < faceEnd;
  return (
    <SceneShell shake={p3.shake * 0.8 + p4.shake}>
      {face ? (
        <>
          <Face shot="hook" from={0} until={faceEnd} />
          <div style={{ position: "absolute", left: 96, top: 230, width: 860, zIndex: 9 }}>
            <div style={{ display: "inline-block", marginBottom: 18, padding: "8px 16px", background: colors.paper, color: colors.ink, fontFamily: mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", transform: "rotate(-1.5deg)" }}>САМЫЙ ДОРОГОЙ РЕСУРС 2026</div>
            <div style={{ display: "flex", gap: 22, marginTop: 10, minHeight: 130 }}>
              {frame >= oil && <Stamp tone="bad" size={56} rotate={-5} delay={oil}>НЕ НЕФТЬ</Stamp>}
              {frame >= gold && <Stamp tone="bad" size={56} rotate={4} delay={gold}>НЕ ЗОЛОТО</Stamp>}
            </div>
            {frame >= iq && <div style={{ marginTop: 34 }}><Kinetic text="ИНТЕЛЛЕКТ" size={128} delay={iq} per={2} mode="snap" hero={[0]} lineHeight={1} glow /></div>}
          </div>
          <Burst at={iq} x={520} y={640} />
        </>
      ) : (
        <>
          <LoopBg src={V + "v-dc-aisle.mp4"} dim={0.72} tint={0.3} />
          <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9, display: "flex", flexDirection: "column", gap: 14 }}>
            <Label at={faceEnd} size={26}>ТРАТЫ НА ИНТЕЛЛЕКТ · ТОЛЬКО 2026 ГОД</Label>
            {frame >= big && <Slam text="$700+ МЛРД" at={big} size={170} />}
            {frame >= big + 10 && <Label at={big + 10} size={20}>КАПЗАТРАТЫ AMAZON, GOOGLE, MICROSOFT, META · CNBC, 29.10.2026</Label>}
          </div>
          <div style={{ position: "absolute", left: 96, top: 560, zIndex: 8, display: "flex", gap: 26 }}>
            {["amazon", "google", "microsoft", "meta"].map((n, i) => (
              <div key={n} style={{ position: "relative", width: 300, height: 150 }}>
                <LogoPlate at={faceEnd + 6 + i * 4} src={L + n + ".png"} x={0} y={0} w={300} />
              </div>
            ))}
          </div>
          <MediaCard src={V + "v-construction.mp4"} at={faceEnd + 4} x={1380} y={150} w={450} h={320} tilt={-8} label="СТРОЙКА ДАТА-ЦЕНТРА" meta="2026" />
          <Burst at={big} x={600} y={300} />
          <Flash amount={cut.energy * 0.8} />
        </>
      )}
      <TopBar left={series} right={episode} />
      <Flash amount={p1.energy * 0.4} color={colors.bad} />
      <Flash amount={p2.energy * 0.4} color={colors.bad} />
      <Flash amount={p3.energy * 0.8} />
      <Flash amount={p4.energy} />
    </SceneShell>
  );
};

const ROUTE = ["ПЕСОК", "ЧИП", "ВИДЕОКАРТА", "ДАТА-ЦЕНТР", "ЭНЕРГИЯ", "ТОКЕН"];

export const PromiseScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const s = useSec();
  const sand = s(cue("promise", "песка"));
  const chat = s(cue("promise", "чате"));
  return (
    <SceneShell>
      <Face shot="promise" from={0} />
      <div style={{ position: "absolute", left: 96, top: 230, width: 860, zIndex: 9 }}>
        <Kinetic text="ВЕСЬ ЗАВОД ЗА 4 МИНУТЫ" size={88} delay={4} per={3} mode="snap" hero={[2, 3]} lineHeight={1.04} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40 }}>
          {ROUTE.map((r, i) => {
            const on = frame >= sand + i * 5;
            const last = i === ROUTE.length - 1;
            return (
              <div key={r} style={{ padding: "10px 18px", fontFamily: mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.08em", background: on ? (last && frame >= chat ? palette.primary : colors.paper) : colors.surfaceLift, color: on ? colors.ink : palette.textDim, opacity: on ? 1 : 0.4, transform: `translateY(${on ? 0 : 20}px)`, transition: "none", boxShadow: on ? colors.paperShadow : undefined }}>
                {String(i + 1).padStart(2, "0")} {r}
              </div>
            );
          })}
        </div>
      </div>
      <GlassChip at={chat} x={120} y={720} text="ОТВЕТ В ТВОЁМ ЧАТЕ" hero size={28} />
      <TopBar left={series} right={episode} />
      <Flash amount={usePunch(sand, 10).energy * 0.5} />
    </SceneShell>
  );
};
