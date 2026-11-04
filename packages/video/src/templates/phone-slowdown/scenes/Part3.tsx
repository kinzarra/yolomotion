// Part 3 «Почему это выгодно»: the developer's month against your new phone,
// the super-app that loads a mall to send 500 ₽, five trackers (Exodus), the
// layer cake, the start-up queue with your balance last, the flagship confession.
import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { psColors as colors, psPalette as palette } from "../palette";
import { Burst, WIDE, cl, media } from "../../dev-myth/ui";
import { MediaCard } from "../../dev-myth/fx2";
import { cue } from "../timeline";
import { Big, Box, FitStamp, Handset, Head, Hits, I, Icon, IconChip, L, Logo, Shell, Spinner, Tag, V, at } from "../kit";

const SberScreen: React.FC<{ spin?: boolean }> = ({ spin = true }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#21A038 0%,#0d6b2a 55%,#063d18 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>
    <Img src={media(L + "sber-mark.svg")} style={{ width: 120, filter: "brightness(0) invert(1)" }} />
    {spin && <Spinner s={56} c="#ffffff" />}
  </div>
);

export const InsideScene: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 60], [0.7, 1.6], { easing: theme.ease.in, ...cl });
  return (
    <Shell part="p3" bg="v-board-gray.mp4" dim={0.55}>
      <Head text="ИЗНУТРИ" at={2} x={96} y={330} w={800} size={150} hero={[0]} />
      <Box x={1180} y={140} z={8}><div style={{ transform: `scale(${z})`, transformOrigin: "50% 40%" }}><Handset w={300} glow={palette.glow}><SberScreen /></Handset></div></Box>
    </Shell>
  );
};

export const SalaryScene: React.FC = () => {
  const n = at(cue("24-salary", "254"));
  return (
    <Shell part="p3" bg="v-office.mp4" dim={0.72}>
      <Tag at={4} x={96} y={190} size={30}>ВРЕМЯ ПРОГРАММИСТА</Tag>
      <Big text="254 000 ₽" at={n} x={96} y={290} maxW={1050} size={200} roll={{ from: 0, to: 254000, suffix: " ₽" }} />
      <Tag at={n + 10} x={110} y={520} size={26}>В МЕСЯЦ · МЕДИАНА BACKEND · ХАБР КАРЬЕРА</Tag>
      <MediaCard src={V + "v-dev-headphones.mp4"} at={2} x={1280} y={170} w={540} h={640} tilt={-6} label="РАЗРАБОТЧИК" meta="2026" />
      <Hits at={[n]} />
    </Shell>
  );
};

const Pan: React.FC<{ at: number; x: number; title: string; tone: "bad" | "lime"; rows: [string, string][]; rowAt: number[] }> = ({ at: a, x, title, tone, rows, rowAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - a, fps, config: theme.spring.smooth });
  if (frame < a) return null;
  const c = tone === "bad" ? colors.bad : palette.primary;
  return (
    <div style={{ position: "absolute", left: x, top: 190, width: 780, zIndex: 9, padding: "34px 38px", borderRadius: 28, background: "rgba(16,20,24,0.74)", backdropFilter: "blur(18px)", border: `2px solid ${c}88`, boxShadow: `0 40px 90px -30px rgba(0,0,0,0.95), inset 0 0 60px ${c}14`, opacity: Math.min(1, p * 1.4), transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)` }}>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 72, color: c, marginBottom: 30 }}>{title}</div>
      {rows.map(([icon, t], i) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 0", borderTop: `1px solid ${colors.line}`, opacity: frame >= rowAt[i] ? 1 : 0, transform: `translateX(${interpolate(frame - rowAt[i], [0, 10], [-30, 0], { easing: theme.ease.out, ...cl })}px)` }}>
          <Icon n={icon} s={64} c={c} />
          <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, letterSpacing: "0.04em", color: palette.text }}>{t}</span>
        </div>
      ))}
    </div>
  );
};

export const ChoiceScene: React.FC = () => {
  const m = at(cue("25-choice", "месяц"));
  const mil = at(cue("25-choice", "миллионы"));
  const none = at(cue("25-choice", "ни одной"));
  return (
    <Shell part="p3" bg="v-office2.mp4" dim={0.8}>
      <Pan at={2} x={96} title="УСКОРИТЬ" tone="bad" rows={[["timer-fill", "МЕСЯЦ РАБОТЫ КОМАНДЫ"], ["coins-fill", "МИЛЛИОНЫ РУБЛЕЙ"], ["x-circle-fill", "0 НОВЫХ КНОПОК"]]} rowAt={[m, mil, none]} />
      <Pan at={none + 8} x={1044} title="НЕ УСКОРЯТЬ" tone="lime" rows={[["check-circle-fill", "0 ₽ ДЛЯ КОМПАНИИ"], ["rocket-fill", "НОВЫЕ ФИЧИ"]]} rowAt={[none + 14, none + 22]} />
    </Shell>
  );
};

export const FreeScene: React.FC = () => {
  const t = at(cue("26-free", "тормозит"));
  const b = at(cue("26-free", "купишь"));
  return (
    <Shell part="p3" bg="v-phones-white.mp4" dim={0.6}>
      <Tag at={4} x={96} y={180} size={30}>ТВОЙ НОВЫЙ ТЕЛЕФОН ДЛЯ КОМПАНИИ</Tag>
      <Big text="0 ₽" at={6} x={96} y={260} maxW={600} size={230} />
      <Head text="ТОРМОЗИТ?" at={t} x={96} y={540} w={900} size={100} bad={[0]} />
      <FitStamp text="КУПИШЬ НОВЫЙ" at={b} x={96} y={680} maxW={860} size={90} rotate={-3} />
      <MediaCard src={V + "v-unbox.mp4"} at={4} x={1200} y={170} w={620} h={620} tilt={-6} label="РАСПАКОВКА" meta="ЗА ТВОЙ СЧЁТ" />
      <Hits at={[6]} bad={[b]} />
    </Shell>
  );
};

const APPS: [string, string, string, number, number][] = [
  ["music-notes-fill", "МУЗЫКА", "музыка", -1, -1],
  ["car-fill", "ТАКСИ", "такси", 1, -1],
  ["hamburger-fill", "ЕДА", "еда", -1.25, 0.05],
  ["film-slate-fill", "КИНО", "кино", 1.25, 0.05],
  ["game-controller-fill", "ИГРЫ", "игры", -1, 1.05],
  ["chats-circle-fill", "ЧАТЫ", "чаты", 1, 1.05],
];

export const SuperappScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = 1180;
  const cy = 470;
  return (
    <Shell part="p3" bg="v-phone-scroll.mp4" dim={0.82}>
      <Tag at={4} x={96} y={200} tone="lime" size={34}>ПЕРЕВОД · 500 ₽</Tag>
      <Head text="А ГРУЗИТСЯ ТОРГОВЫЙ ЦЕНТР" at={at(cue("27-superapp", "загружаются"))} x={96} y={300} w={640} size={70} bad={[2, 3]} />
      <Box x={cx - 150} y={150} z={8}><Handset w={300} glow={colors.badGlow}><SberScreen /></Handset></Box>
      {APPS.map(([icon, label, word, dx, dy]) => {
        const a = at(cue("27-superapp", word));
        const p = spring({ frame: frame - a, fps, config: theme.spring.bouncy });
        if (frame < a) return null;
        return (
          <div key={word} style={{ position: "absolute", left: cx + dx * 380 * p - 90, top: cy + dy * 260 * p - 90, zIndex: 10, width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: Math.min(1, p * 1.5), transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})` }}>
            <div style={{ width: 120, height: 120, borderRadius: 32, background: "rgba(16,20,24,0.8)", border: `2px solid ${colors.bad}AA`, boxShadow: `0 0 30px ${colors.badGlow}`, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}><Icon n={icon} s={66} c={palette.text} /></div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: palette.text }}>{label}</div>
          </div>
        );
      })}
    </Shell>
  );
};

const TRACKERS: [string, string][] = [["appmetrica", "AppMetrica"], ["appsflyer", "AppsFlyer"], ["firebase", "Firebase"], ["crashlytics", "Crashlytics"], ["mixpanel", "Mixpanel"]];

export const TrackersScene: React.FC = () => {
  const n = at(cue("28-trackers", "5"));
  return (
    <Shell part="p3" bg="v-network.mp4" dim={0.8}>
      <Logo at={2} src={L + "exodus.svg"} x={96} y={160} w={300} h={170} light />
      <Tag at={6} x={430} y={190} size={26}>EXODUS PRIVACY · НЕЗАВИСИМЫЙ АУДИТ</Tag>
      <Tag at={10} x={430} y={260} size={26}>СБЕРБАНК ОНЛАЙН · ANDROID</Tag>
      <Big text="5 ТРЕКЕРОВ" at={n} x={96} y={380} maxW={1000} size={150} bad />
      <Tag at={n + 10} x={110} y={570} size={20}>В КАЖДОЙ ПРОВЕРЕННОЙ ВЕРСИИ С 2019 ГОДА · НАПРИМЕР ЭТИ</Tag>
      {TRACKERS.map(([f, name], i) => (
        <Logo key={f} at={n + 8 + i * 5} src={L + f + ".svg"} x={1180 + (i % 2) * 330} y={150 + Math.floor(i / 2) * 220} w={300} h={150} light caption={name.toUpperCase()} pad={0.2} />
      ))}
      <IconChip at={at(cue("28-trackers", "аналитика"))} x={110} y={680} icon="chart-line-up-fill" text="АНАЛИТИКА" tone="bad" size={30} />
      <IconChip at={at(cue("28-trackers", "реклама"))} x={470} y={700} icon="megaphone-fill" text="РЕКЛАМА" tone="bad" size={30} />
      <IconChip at={at(cue("28-trackers", "геолокация"))} x={790} y={680} icon="map-pin-fill" text="ГЕОЛОКАЦИЯ" tone="bad" size={30} />
      <Hits at={[]} bad={[n]} />
    </Shell>
  );
};

export const LayersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layers: { t: string; logos?: string[]; icon?: string; a: number }[] = [
    { t: "ТВОЙ ПЕРЕВОД", icon: "wallet-fill", a: 4 },
    { t: "ФРЕЙМВОРК", logos: ["react-native.svg", "flutter.svg"], a: at(cue("29-layers", "фреймворк")) },
    { t: "IOS + ANDROID", logos: ["apple.svg", "android.svg"], a: at(cue("29-layers", "iPhone")) },
    { t: "БРАУЗЕР ВНУТРИ", icon: "browser-fill", a: at(cue("29-layers", "браузер")) },
    { t: "SDK И ТРЕКЕРЫ", icon: "stack-fill", a: at(cue("29-layers", "каждый")) },
  ];
  const ms = at(cue("29-layers", "100"));
  const added = layers.filter((l, i) => i > 0 && frame >= l.a).length;
  return (
    <Shell part="p3" bg="v-code-laptop.mp4" dim={0.8}>
      <Head text="СЛОЙ ЗА СЛОЕМ" at={2} x={96} y={170} w={700} size={92} />
      <Box x={96} y={420}><Big text={`+${added * 100} МС`} at={layers[1].a} x={0} y={0} maxW={640} size={140} bad /></Box>
      <Tag at={ms} x={110} y={620} size={28}>КАЖДЫЙ СЛОЙ «ВСЕГО» +100 МС</Tag>
      {layers.map((l, i) => {
        const p = spring({ frame: frame - l.a, fps, config: theme.spring.bouncy });
        if (frame < l.a) return null;
        const y = 760 - i * 128;
        const base = i === 0;
        return (
          <div key={l.t} style={{ position: "absolute", left: 960, top: y, width: 860, height: 108, zIndex: 9 + i, borderRadius: 20, boxSizing: "border-box", padding: "0 32px", display: "flex", alignItems: "center", gap: 24, background: base ? palette.primary : "rgba(20,25,30,0.86)", border: `2px solid ${base ? palette.primary : colors.bad + "88"}`, boxShadow: base ? `0 0 40px ${palette.glow}` : `0 20px 50px -20px rgba(0,0,0,0.9)`, backdropFilter: "blur(12px)", opacity: Math.min(1, p * 1.4), transform: `translateY(${interpolate(p, [0, 1], [-220, 0])}px) rotate(${(i % 2 ? 1 : -1) * 0.8}deg)` }}>
            {l.icon && <Icon n={l.icon} s={54} c={base ? colors.ink2 : palette.text} />}
            {l.logos?.map((s) => <div key={s} style={{ width: 70, height: 70, borderRadius: 16, background: "rgba(244,246,240,0.96)", display: "flex", alignItems: "center", justifyContent: "center" }}><Img src={media(L + s)} style={{ width: 50, height: 50, objectFit: "contain" }} /></div>)}
            <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 40, color: base ? colors.ink2 : palette.text, whiteSpace: "nowrap" }}>{l.t}</span>
            {!base && <span style={{ marginLeft: "auto", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: colors.bad }}>+100 МС</span>}
          </div>
        );
      })}
    </Shell>
  );
};

export const QueueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows: [string, string, string][] = [["megaphone-fill", "РЕКЛАМА", "реклама"], ["shield-check-fill", "ПРОВЕРКИ", "проверки"], ["chart-line-up-fill", "АНАЛИТИКА", "аналитика"], ["image-fill", "БАННЕРЫ", "баннеры"]];
  const startAt = rows.map(([, , w]) => at(cue("30-queue", w)));
  const last = startAt[3] + 30;
  return (
    <Shell part="p3" bg="v-annoyed.mp4" dim={0.75}>
      <Head text="ОЧЕРЕДЬ ПРИ ЗАПУСКЕ" at={2} x={96} y={160} w={900} size={80} />
      <Box x={96} y={330} w={1000}>
        <div style={{ borderRadius: 26, overflow: "hidden", background: "rgba(12,15,18,0.85)", border: `1.5px solid ${colors.lineStrong}`, boxShadow: colors.shadow }}>
          {[...rows, ["wallet-fill", "ТВОЙ БАЛАНС", ""] as [string, string, string]].map(([icon, t], i) => {
            const isMe = i === rows.length;
            const s = isMe ? last : startAt[i];
            const p = interpolate(frame - s, [0, 24], [0, 1], { easing: theme.ease.inOut, ...cl });
            const done = p >= 1 && !isMe;
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 28px", borderTop: i ? `1px solid ${colors.line}` : undefined, background: isMe ? `${colors.bad}22` : undefined }}>
                <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: palette.textDim, width: 40 }}>{i + 1}</span>
                <Icon n={icon} s={44} c={isMe ? colors.bad : palette.text} />
                <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 34, color: isMe ? colors.bad : palette.text, width: 380, whiteSpace: "nowrap" }}>{t}</span>
                <div style={{ flex: 1, height: 14, borderRadius: 7, background: colors.line, overflow: "hidden" }}>
                  <div style={{ width: `${(isMe ? Math.min(p, 0.12) : p) * 100}%`, height: "100%", background: isMe ? colors.bad : palette.primary }} />
                </div>
                <span style={{ width: 120, textAlign: "right", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: done ? palette.primary : isMe ? colors.bad : palette.textDim }}>{done ? "ГОТОВО" : isMe ? "ЖДЁТ" : frame >= s ? "…" : ""}</span>
              </div>
            );
          })}
        </div>
      </Box>
      <Box x={1240} y={180} z={8}><Handset w={290}><div style={{ position: "absolute", inset: 0, background: "#0f1418", display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner s={70} c={colors.bad} /></div></Handset></Box>
      <Tag at={last} x={1180} y={800} tone="bad" size={28}>ТВОЙ БАЛАНС · ПОСЛЕДНИЙ</Tag>
    </Shell>
  );
};

export const FlagshipScene: React.FC = () => {
  const frame = useCurrentFrame();
  const conf = at(cue("31-flagship", "признание"));
  const fl = at(cue("31-flagship", "флагманах"));
  const you = at(cue("31-flagship", "25"));
  const never = at(cue("31-flagship", "почти никогда"));
  return (
    <Shell part="p3" bg="v-dev-headphones.mp4" dim={0.8}>
      <Head text="ГЛАВНОЕ ПРИЗНАНИЕ" at={conf} x={96} y={150} w={1728} size={84} align="center" hero={[0]} />
      {frame >= fl && (
        <Box x={430} y={300} z={8}>
          <Handset w={230} glow={palette.glow}><div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#1d2a12,#0b0f0a)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="check-circle-fill" s={110} c={palette.primary} glow /></div></Handset>
        </Box>
      )}
      <Tag at={fl} x={330} y={800} tone="lime" size={28}>ФЛАГМАН · ТУТ МЫ ТЕСТИРУЕМ</Tag>
      {frame >= you && (
        <Box x={1260} y={300} z={8}>
          <div style={{ filter: "grayscale(0.6) brightness(0.8)", transform: "rotate(4deg)" }}>
            <Handset w={230}><div style={{ position: "absolute", inset: 0, background: "#151a1e", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="x-circle-fill" s={110} c={colors.bad} glow /></div></Handset>
          </div>
        </Box>
      )}
      <Tag at={you} x={1130} y={800} tone="bad" size={28}>ТВОЙ ЗА 25 000 ₽ · НЕ ПРОВЕРЯЛИ</Tag>
      <FitStamp text="ПОЧТИ НИКОГДА" at={never} x={640} y={470} maxW={680} size={80} rotate={-5} />
      <Burst at={never} x={960} y={520} color={colors.bad} />
    </Shell>
  );
};
