// Part 4 «Счёт за железо» (25 700 ₽, every 3 years, the EU's 5 years / 800
// cycles, the life line 514 000 → 257 000, ≈ a developer's month, the question)
// and part 5 «Как не платить» (battery, delete, web), the face, the subscribe.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { psColors as colors, psPalette as palette } from "../palette";
import { Burst, Flash, WIDE, cl } from "../../dev-myth/ui";
import { MediaCard, StatPlate } from "../../dev-myth/fx2";
import { Toggle } from "../../digital-ruble/ui";
import { cue } from "../timeline";
import { Shot, Big, Box, Face, FitStamp, Handset, Head, Hits, I, Icon, IconChip, IconDisc, L, Logo, Shell, Tag, V, at } from "../kit";

const rub = (n: number) => `${n.toLocaleString("ru-RU").replace(/\s/g, " ")} ₽`;

/* ------------------------------------------------------------------ part 4 */

export const PriceScene: React.FC<{ price: number }> = ({ price }) => {
  const n = at(cue("32-price", "25"));
  return (
    <Shell part="p4" bg="v-cash.mp4" dim={0.7}>
      <Logo at={2} src={L + "mvideo.svg"} x={96} y={160} w={400} h={150} light />
      <Tag at={6} x={96} y={350} size={28}>СРЕДНЯЯ ЦЕНА СМАРТФОНА · РОССИЯ</Tag>
      <Big text={rub(price)} at={n} x={96} y={430} maxW={950} size={190} roll={{ from: 0, to: price, suffix: " ₽" }} />
      <Tag at={n + 10} x={110} y={660} size={24}>М.ВИДЕО · 1 КВАРТАЛ 2026</Tag>
      <MediaCard src={I + "mvideo-store.jpg"} at={4} x={1140} y={160} w={680} h={420} tilt={-5} label="М.ВИДЕО" meta="ТОРГОВЫЙ ЗАЛ" grade={false} />
      <Shot src="mvideo-price.png" at={n} x={1060} y={650} w={760} ratio={1400 / 400} label="ЧЕМПИОНАТ / РАМБЛЕР" meta="7 АПРЕЛЯ 2026" tilt={-2} />
      <Hits at={[n]} />
    </Shell>
  );
};

export const CycleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = at(cue("33-cycle", "3"));
  const br = at(cue("33-cycle", "сломался"));
  const sl = at(cue("33-cycle", "тормозить"));
  return (
    <Shell part="p4" bg="v-ewaste.mp4" dim={0.65}>
      <Tag at={4} x={96} y={170} size={28}>МЕНЯЕМ ТЕЛЕФОН</Tag>
      <Big text="РАЗ В 3 ГОДА" at={n} x={96} y={250} maxW={1100} size={150} />
      <Box x={96} y={470} w={1300} style={{ display: "flex", gap: 34 }}>
        {[2014, 2017, 2020, 2023, 2026].map((y, i) => {
          const p = spring({ frame: frame - n - 6 - i * 6, fps, config: theme.spring.bouncy });
          return (
            <div key={y} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [-80, 0])}px)` }}>
              <Icon n="device-mobile-fill" s={110} c={i === 4 ? palette.primary : palette.textDim} />
              <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: palette.text }}>{y}</span>
            </div>
          );
        })}
      </Box>
      <IconChip at={br} x={1250} y={300} icon="x-circle-fill" text="НЕ СЛОМАЛСЯ" size={34} />
      <IconChip at={sl} x={1250} y={420} icon="hourglass-medium-fill" text="НАЧАЛ ТОРМОЗИТЬ" tone="bad" size={34} />
      <Hits at={[n]} bad={[sl]} />
    </Shell>
  );
};

export const EuScene: React.FC = () => {
  const y5 = at(cue("34-eu", "5 лет"));
  const c8 = at(cue("34-eu", "800"));
  const eu = at(cue("34-eu", "Евросоюз"));
  return (
    <Shell part="p4" bg="v-repair.mp4" dim={0.7}>
      <Head text="ЖЕЛЕЗО МОЖЕТ ЖИТЬ ДОЛЬШЕ" at={2} x={96} y={150} w={1100} size={74} hero={[3]} />
      <Logo at={eu} src={L + "eu-flag.svg"} x={96} y={360} w={270} h={180} pad={0} />
      <Tag at={eu + 6} x={96} y={570} size={26}>ЕС · С 20.06.2025</Tag>
      <StatPlate at={y5} x={420} y={340} w={560} value="5 ЛЕТ" caption="ОБНОВЛЕНИЙ МИНИМУМ" />
      <StatPlate at={c8} x={420} y={560} w={560} value="800" caption="ЦИКЛОВ БАТАРЕИ · 80% ЁМКОСТИ" />
      <Shot src="eu-ecodesign.png" at={eu} x={1080} y={360} w={740} ratio={1880 / 920} label="ЕВРОКОМИССИЯ" meta="ECODESIGN · 2025" />
      <Hits at={[y5, c8]} />
    </Shell>
  );
};

/** Two rows of phones along a 15→75 life line. */
const LifeRow: React.FC<{ at: number; n: number; y: number; label: string; tone: "bad" | "lime" }> = ({ at: a, n, y, label, tone }) => {
  const frame = useCurrentFrame();
  const c = tone === "bad" ? colors.bad : palette.primary;
  return (
    <Box x={96} y={y} w={1100}>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: c, marginBottom: 10, opacity: frame >= a ? 1 : 0 }}>{label}</div>
      <div style={{ display: "flex", gap: n > 10 ? 6 : 52 }}>
        {Array.from({ length: n }, (_, i) => {
          const p = interpolate(frame - a - i * 2, [0, 8], [0, 1], { easing: theme.ease.out, ...cl });
          return <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * -30}px)` }}><Icon n="device-mobile-fill" s={48} c={c} /></div>;
        })}
      </div>
    </Box>
  );
};

export const MathScene: React.FC<{ price: number }> = ({ price }) => {
  const frame = useCurrentFrame();
  const life = at(cue("35-math", "60"));
  const r3 = at(cue("35-math", "20"));
  const s3 = at(cue("35-math", "514"));
  const r6 = at(cue("35-math", "10"));
  const s6 = at(cue("35-math", "257"));
  const axis = interpolate(frame - 4, [0, 30], [0, 1], { easing: theme.ease.out, ...cl });
  return (
    <Shell part="p4">
      <Box x={96} y={160} w={1100}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: WIDE, fontWeight: 900, fontSize: 44, color: palette.text }}><span>15 ЛЕТ</span><span style={{ opacity: frame >= life ? 1 : 0, color: palette.primary }}>60 ЛЕТ</span><span>75 ЛЕТ</span></div>
        <div style={{ marginTop: 14, height: 10, width: 1100 * axis, borderRadius: 5, background: palette.text }} />
      </Box>
      <LifeRow at={r3} n={20} y={330} label="РАЗ В 3 ГОДА · 20 ТЕЛЕФОНОВ" tone="bad" />
      <LifeRow at={r6} n={10} y={560} label="РАЗ В 6 ЛЕТ · 10 ТЕЛЕФОНОВ" tone="lime" />
      <Big text={rub(20 * price)} at={s3} x={1260} y={360} maxW={600} size={110} bad roll={{ from: 0, to: 20 * price, suffix: " ₽" }} />
      <Big text={rub(10 * price)} at={s6} x={1260} y={590} maxW={600} size={110} roll={{ from: 0, to: 10 * price, suffix: " ₽" }} />
      <Tag at={s6 + 10} x={1270} y={760} size={22}>ПО ЦЕНЕ {rub(price)} · МОЙ РАСЧЁТ</Tag>
      <Hits at={[s6]} bad={[s3]} />
    </Shell>
  );
};

export const DiffScene: React.FC<{ loss: number }> = ({ loss }) => {
  const s = at(cue("36-diff", "зарплата"));
  return (
    <Shell part="p4" bg="v-money-counter.mp4" dim={0.75}>
      <Tag at={2} x={96} y={170} size={30}>РАЗНИЦА</Tag>
      <Big text={rub(loss)} at={4} x={96} y={250} maxW={1150} size={220} bad />
      <Box x={110} y={530} z={10}><div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 130, color: palette.text, opacity: useCurrentFrame() >= s ? 1 : 0 }}>≈</div></Box>
      <Big text="254 000 ₽" at={s} x={260} y={560} maxW={760} size={120} />
      <Tag at={s + 8} x={270} y={720} tone="lime" size={28}>МЕСЯЦ ТОГО САМОГО ПРОГРАММИСТА</Tag>
      <MediaCard src={V + "v-dev-headphones.mp4"} at={s} x={1300} y={300} w={520} h={460} tilt={-5} label="ПРОГРАММИСТ" meta="254 000 ₽ / МЕС" />
      <Burst at={4} x={600} y={360} color={colors.bad} />
      <Hits at={[s]} bad={[4]} />
    </Shell>
  );
};

export const OnlyScene: React.FC = () => {
  const items: [string, string, string][] = [["laptop-fill", "НОУТБУК", "ноутбука"], ["device-tablet-fill", "ПЛАНШЕТ", "планшета"], ["television-fill", "ТЕЛЕВИЗОР", "телевизора"]];
  return (
    <Shell part="p4" bg="v-phone-dark.mp4" dim={0.6}>
      <Head text="И ЭТО ТОЛЬКО ТЕЛЕФОН" at={2} x={96} y={170} w={1728} size={96} align="center" hero={[3]} />
      {items.map(([icon, label, w], i) => (
        <IconDisc key={w} at={at(cue("37-only", w))} x={330 + i * 480} y={360} icon={icon} d={300} tone="bad" label={`+ ${label}`} />
      ))}
    </Shell>
  );
};

export const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const c = at(cue("38-question", "напиши"));
  const blink = Math.floor(frame / 10) % 2 === 0;
  return (
    <Shell part="p4" bg="v-crowd-phones.mp4" dim={0.65}>
      <Head text="СКОЛЬКО ЛЕТ ТВОЕМУ ТЕЛЕФОНУ?" at={2} x={96} y={170} w={1400} size={110} hero={[1]} />
      {frame >= c && (
        <Box x={96} y={600} w={1100}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 30px", borderRadius: 22, background: "rgba(16,20,24,0.8)", border: `2px solid ${palette.primary}88`, boxShadow: `0 0 40px ${palette.glow}` }}>
            <Icon n="chat-circle-dots-fill" s={60} c={palette.primary} />
            <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: palette.text }}>МОЕМУ … ЛЕТ{blink ? "▍" : " "}</span>
          </div>
        </Box>
      )}
    </Shell>
  );
};

/* ------------------------------------------------------------------ part 5 */

const Step: React.FC<{ n: string; at: number }> = ({ n, at: a }) => (
  <Box x={96} y={170}><Big text={n} at={a} x={0} y={0} maxW={300} size={230} /></Box>
);

export const BatteryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const b = at(cue("39-battery", "поменяй"));
  const c = at(cue("39-battery", "дешевле"));
  return (
    <Shell part="p5" bg="v-repair.mp4" dim={0.6}>
      <Step n="1" at={at(cue("39-battery", "первое"))} />
      <Head text="СНАЧАЛА ПОМЕНЯЙ БАТАРЕЮ" at={b} x={380} y={190} w={760} size={80} hero={[2]} />
      <Tag at={c} x={390} y={470} tone="lime" size={34}>В РАЗЫ ДЕШЕВЛЕ НОВОГО</Tag>
      <IconDisc at={4} x={1320} y={210} icon={frame >= b + 10 ? "battery-full-fill" : "battery-warning-fill"} d={300} tone={frame >= b + 10 ? "lime" : "bad"} label={frame >= b + 10 ? "НОВАЯ БАТАРЕЯ" : "ИЗНОС"} />
      <MediaCard src={V + "v-iphone5-open.mp4"} at={b} x={380} y={560} w={560} h={300} tilt={4} label="ЗАМЕНА" meta="МАСТЕРСКАЯ" />
      <Hits at={[b + 10]} />
    </Shell>
  );
};

export const DeleteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = at(cue("40-delete", "удали"));
  const auto = at(cue("40-delete", "автозапуск"));
  const code = at(cue("40-delete", "чужой"));
  const icons = ["game-controller-fill", "film-slate-fill", "music-notes-fill", "car-fill", "hamburger-fill", "chats-circle-fill"];
  return (
    <Shell part="p5" bg="v-phone-scroll.mp4" dim={0.82}>
      <Step n="2" at={at(cue("40-delete", "второе"))} />
      <Head text="УДАЛИ ЛИШНЕЕ" at={d} x={380} y={190} w={800} size={92} />
      {icons.map((ic, i) => {
        const t = interpolate(frame - d - 8 - i * 4, [0, 16], [0, 1], { easing: theme.ease.in, ...cl });
        return <Box key={ic} x={420 + i * 130 + t * (1400 - (420 + i * 130))} y={420 + t * 80} z={10}><div style={{ opacity: 1 - t * 0.9, transform: `scale(${1 - t * 0.6}) rotate(${t * 40}deg)` }}><Icon n={ic} s={90} c={palette.text} /></div></Box>;
      })}
      <IconDisc at={d} x={1500} y={190} icon="trash-fill" d={180} tone="bad" />
      <MediaCard src={V + "v-cracked.mp4"} at={auto} x={1300} y={480} w={520} h={340} tilt={-5} label="ТВОЙ ТЕЛЕФОН" meta="ОЧИСТКА" />
      <Box x={420} y={640} w={800}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: frame >= auto ? 1 : 0 }}>
          <Toggle on={interpolate(frame - auto - 6, [0, 10], [1, 0], cl)} width={150} />
          <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 46, color: palette.text }}>АВТОЗАПУСК</span>
        </div>
      </Box>
      <Tag at={code} x={420} y={780} tone="bad" size={30}>ТОРМОЗА = ЧУЖОЙ КОД</Tag>
    </Shell>
  );
};

export const WebScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = at(cue("41-web", "браузере"));
  const l = at(cue("41-web", "легче"));
  const p = spring({ frame: frame - b, fps, config: theme.spring.smooth });
  return (
    <Shell part="p5" bg="v-code-laptop.mp4" dim={0.8}>
      <Step n="3" at={at(cue("41-web", "третье"))} />
      <Head text="БАНК В БРАУЗЕРЕ" at={b} x={380} y={190} w={800} size={92} hero={[2]} />
      {frame >= b && (
        <Box x={1100} y={190} w={720} z={8}>
          <div style={{ borderRadius: 22, overflow: "hidden", background: "rgba(16,20,24,0.9)", border: `1.5px solid ${colors.lineStrong}`, boxShadow: colors.shadow, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: colors.surfaceLift }}>
              {[0, 1, 2].map((i) => <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: colors.lineStrong }} />)}
              <div style={{ flex: 1, marginLeft: 12, padding: "8px 16px", borderRadius: 999, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: palette.text }}><Icon n="lock-fill" s={22} c={palette.primary} />online.sberbank.ru</div>
            </div>
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
              <Icon n="bank-fill" s={120} c={palette.primary} glow />
              <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 48, color: palette.text }}>ВЕБ-ВЕРСИЯ</span>
            </div>
          </div>
        </Box>
      )}
      <Box x={380} y={480} w={560}>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, opacity: frame >= l ? 1 : 0 }}>
          {[["ПРИЛОЖЕНИЕ", 1, true], ["ВЕБ-ВЕРСИЯ", 0.3, false]].map(([t, v, bad]) => {
            const q = interpolate(frame - l, [0, 20], [0, v as number], { easing: theme.ease.out, ...cl });
            const c = bad ? colors.bad : palette.primary;
            return (
              <div key={t as string}>
                <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: c, marginBottom: 8 }}>{t as string}</div>
                <div style={{ width: 540 * q, height: 30, borderRadius: 8, background: c, boxShadow: `0 0 24px ${c}66` }} />
              </div>
            );
          })}
        </div>
      </Box>
      <Tag at={l + 20} x={1100} y={620} tone="lime" size={30}>ЧАСТО ЛЕГЧЕ ПРИЛОЖЕНИЯ</Tag>
    </Shell>
  );
};

export const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sink = at(cue("42-final", "тонет"));
  const p = usePunch(sink, 18);
  return (
    <Shell part="p5" shake={p.shake * 0.6}>
      <Face shot="final" from={at(0)} glitch={interpolate(frame - sink, [0, 2, 9], [0, 1, 0], cl)} fallback="v-phone-night.mp4" />
      <Head text="ТВОЙ ТЕЛЕФОН НЕ СТАРЕЕТ" at={at(0.1)} x={96} y={220} w={820} size={90} hero={[3]} />
      <FitStamp text="ОН ТОНЕТ" at={sink} x={96} y={540} maxW={820} size={130} rotate={-4} />
      <Tag at={sink + 6} x={110} y={720} tone="bad" size={40}>В НАШЕМ КОДЕ</Tag>
      <Flash amount={p.energy} color={colors.bad} />
    </Shell>
  );
};

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sub = at(cue("43-cta", "подпишись"));
  const p = spring({ frame: frame - 6, fps, config: theme.spring.smooth });
  const done = frame >= sub + 18;
  const q = spring({ frame: frame - sub - 18, fps, config: theme.spring.bouncy });
  return (
    <Shell part="p5" bg="v-phone-night.mp4" dim={0.75} exit={false}>
      <Head text="СКОЛЬКО ЛЕТ ТВОЕМУ ТЕЛЕФОНУ?" at={2} x={96} y={160} w={1728} size={84} align="center" hero={[1]} />
      <Box x={310} y={420} w={1300}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "30px 36px", borderRadius: 30, background: "rgba(16,20,24,0.82)", border: `2px solid ${palette.primary}66`, boxShadow: `0 40px 90px -30px rgba(0,0,0,0.95), 0 0 50px ${palette.glow}`, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px)` }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", background: palette.primary, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="currency-rub-fill" s={70} c={colors.ink2} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 46, color: palette.text }}>ДЕНЬГИ · ПРОСТО</div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: palette.textDim, marginTop: 6 }}>исповедь человека, который 20 лет в IT</div>
          </div>
          <div style={{ padding: "20px 30px", borderRadius: 999, background: done ? "rgba(230,240,225,0.12)" : colors.bad, color: palette.text, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 12, transform: `scale(${done ? interpolate(q, [0, 1], [0.85, 1]) : 1 + Math.sin(frame / 6) * 0.03})`, whiteSpace: "nowrap" }}>
            {done ? <><Icon n="check-circle-fill" s={34} c={palette.primary} />ВЫ ПОДПИСАНЫ</> : "ПОДПИСАТЬСЯ"}
          </div>
        </div>
      </Box>
      <IconChip at={at(cue("43-cta", "комментариях"))} x={660} y={680} icon="chat-circle-dots-fill" text="ПИШИ В КОММЕНТАРИЯХ" tone="lime" size={30} />
      <Tag at={sub + 30} x={700} y={820} size={24}>ДАЛЬШЕ: ЧТО ЕЩЁ МЫ ОТ ТЕБЯ ПРЯЧЕМ</Tag>
    </Shell>
  );
};
