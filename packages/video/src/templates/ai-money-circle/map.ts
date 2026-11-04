// The map as data: ten companies on a ring, and the beats that draw it.
// Frames are relative to each beat's scene (30 fps). Every figure here has
// its source line in studio/briefs/ai-money-circle/WORK.md («Цифры и источники»).

export type NodeId =
  | "nvidia"
  | "microsoft"
  | "softbank"
  | "openai"
  | "amd"
  | "coreweave"
  | "oracle"
  | "google"
  | "anthropic"
  | "amazon";

/** Lime = an investment (money going into a company), red = a promise to pay. */
export type Tone = "invest" | "pay";

export type NodeSpec = { label: string; logo?: string; angle: number; logoH?: number };

// Angles clockwise from the top (screen coordinates), 36° apart. The hook's
// triangle NVIDIA → OPENAI → ORACLE sits on −90 / 18 / 126.
export const NODES: Record<NodeId, NodeSpec> = {
  nvidia: { label: "NVIDIA", logo: "logo-nvidia.svg", angle: -90, logoH: 40 },
  microsoft: { label: "MICROSOFT", logo: "logo-microsoft.svg", angle: -54, logoH: 40 },
  softbank: { label: "SOFTBANK", logo: "logo-softbank.svg", angle: -18, logoH: 44 },
  openai: { label: "OPENAI", logo: "logo-openai.svg", angle: 18, logoH: 48 },
  amd: { label: "AMD", logo: "logo-amd.svg", angle: 54, logoH: 42 },
  coreweave: { label: "COREWEAVE", angle: 90 },
  oracle: { label: "ORACLE", logo: "logo-oracle.svg", angle: 126, logoH: 30 },
  google: { label: "GOOGLE", logo: "logo-google.svg", angle: 162, logoH: 58 },
  anthropic: { label: "ANTHROPIC", logo: "logo-anthropic.svg", angle: 198, logoH: 26 },
  amazon: { label: "AMAZON", logo: "logo-amazon.svg", angle: 234, logoH: 52 },
};

export const NODE_IDS = Object.keys(NODES) as NodeId[];

export type Face = { src: string; ratio: number; credit: string; right?: number };

export const FACES = {
  huang: { src: "person-huang.png", ratio: 1129 / 1655, credit: "ФОТО: PETER DASILVA / EUROPEAN COMMISSION (CC BY 4.0)" },
  altman: { src: "person-altman.png", ratio: 975 / 1053, credit: "ФОТО: STEVE JURVETSON (CC BY 2.0)" },
  ellison: { src: "person-ellison.png", ratio: 2973 / 2495, credit: "ФОТО: ORACLE CORPORATE COMMUNICATIONS (CC BY 2.0)" },
  // the source photo ends at his right shoulder: sit that edge on the frame edge
  amodei: { src: "person-amodei.png", ratio: 1264 / 2002, credit: "ФОТО: UK PRIME MINISTER'S OFFICE (CC BY 2.0)", right: -8 },
  pichai: { src: "person-pichai.png", ratio: 959 / 1353, credit: "ФОТО: LUKASZ KOBUS / EUROPEAN COMMISSION (CC BY 4.0)" },
  su: { src: "person-su.png", ratio: 1801 / 2104, credit: "ФОТО: GENE WANG (CC BY 2.0)" },
  jassy: { src: "person-jassy.png", ratio: 2046 / 2405, credit: "ФОТО: STEVE JURVETSON (CC BY 2.0)" },
  son: { src: "person-son.png", ratio: 766 / 1010, credit: "ФОТО: EUROPEAN COMMUNITIES 2025 (CC BY 4.0)" },
  nadella: { src: "person-nadella.png", ratio: 1690 / 1439, credit: "ФОТО: OFFICIAL LEWEB PHOTOS (CC BY 2.0)" },
} satisfies Record<string, Face>;

export type Big = { num: string; unit: string; caption: string };

export type ArrowSpec = {
  from: NodeId;
  to: NodeId;
  tone: Tone;
  at: number; // frame the arrow starts drawing
  label: string; // the amount that stays on the arrow
  big?: Big; // the figure that slams top-left when the arrow lands
  face?: Face; // a round portrait at the ring node of this arrow
};

export type PulseSpec = { node: NodeId; at: number; big: Big };

export type StampSpec = { lines: string[]; tone: "hero" | "bad"; at: number; sub?: string };

export type PersonSpec = Face & { at: number; out?: number };

export type ClipSpec = { shot: "dc" | "gpu" | "board"; at: number; label: string };

export type Beat = {
  header: string;
  headerBad?: number[]; // word indices in red
  focus?: NodeId; // the node that slides to the centre
  arrows: ArrowSpec[];
  pulses?: PulseSpec[];
  stamp: StampSpec;
  person?: PersonSpec;
  clip?: ClipSpec;
};

// 03 — who gave OpenAI money (CNBC 27.02 / 31.03.2026, Microsoft blog 28.10.2025).
// Arrow frames follow the words of 03-openai-in (ASR, raw s → ×30/1.3 + lead 3):
// Microsoft@2.31 → 56, Nvidia@3.24 → 78, Amazon@4.17 → 99, SoftBank@5.13 → 121; a figure lands at at+10.
export const OPENAI_IN: Beat = {
  header: "КТО ДАЛ ДЕНЬГИ OPENAI",
  focus: "openai",
  arrows: [
    { from: "microsoft", to: "openai", tone: "invest", at: 46, label: "$13 МЛРД", big: { num: "$13", unit: "МЛРД", caption: "MICROSOFT · ЗА ЭТО 27% КОМПАНИИ" }, face: FACES.nadella },
    { from: "nvidia", to: "openai", tone: "invest", at: 68, label: "$30 МЛРД", big: { num: "$30", unit: "МЛРД", caption: "NVIDIA · ОБЕЩАЛА $100 МЛРД, ДАЛА $30" }, face: FACES.huang },
    { from: "amazon", to: "openai", tone: "invest", at: 89, label: "ДО $50 МЛРД", big: { num: "$50", unit: "МЛРД, ДО", caption: "AMAZON · $15 СРАЗУ, $35 ПО ЭТАПАМ" }, face: FACES.jassy },
    { from: "softbank", to: "openai", tone: "invest", at: 111, label: "$30 МЛРД", big: { num: "$30", unit: "МЛРД", caption: "SOFTBANK · ВСЕГО $64,6 МЛРД = 13% КОМПАНИИ" }, face: FACES.son },
  ],
  stamp: { lines: ["OPENAI СТОИТ", "$852 МЛРД"], tone: "hero", at: 138, sub: "РАУНД $122 МЛРД · МАРТ 2026" },
  person: { ...FACES.altman, at: 3 },
};

// 04 — whom OpenAI promised to pay (Microsoft blog 28.10.2025; WSJ 10.09.2025; AWS 03.11.2025; CoreWeave 25.09.2025; AMD 06.10.2025).
// 04-openai-out: серверы@0.42, чипы@1.14, обещала@3.21, платить@3.78, им же@4.23 → stamp at 104.
export const OPENAI_OUT: Beat = {
  header: "КОМУ OPENAI ОБЕЩАЛА ЗАПЛАТИТЬ",
  headerBad: [3],
  focus: "openai",
  arrows: [
    { from: "openai", to: "microsoft", tone: "pay", at: 10, label: "$250 МЛРД", big: { num: "$250", unit: "МЛРД", caption: "ЗА СЕРВЕРЫ MICROSOFT (AZURE)" }, face: FACES.nadella },
    { from: "openai", to: "oracle", tone: "pay", at: 28, label: "$300 МЛРД", big: { num: "$300", unit: "МЛРД", caption: "ЗА СЕРВЕРЫ ORACLE · 5 ЛЕТ, С 2027" }, face: FACES.ellison },
    { from: "openai", to: "amazon", tone: "pay", at: 46, label: "$38 МЛРД", big: { num: "$38", unit: "МЛРД", caption: "ЗА СЕРВЕРЫ AMAZON (AWS) · 7 ЛЕТ" }, face: FACES.jassy },
    { from: "openai", to: "coreweave", tone: "pay", at: 64, label: "$22,4 МЛРД", big: { num: "$22,4", unit: "МЛРД", caption: "COREWEAVE · АРЕНДА ЧИПОВ" } },
    { from: "openai", to: "amd", tone: "pay", at: 82, label: "6 ГВт ЧИПОВ", big: { num: "6", unit: "ГВт ЧИПОВ AMD", caption: "ВЗАМЕН ДО 10% AMD ПО 1 ЦЕНТУ ЗА АКЦИЮ" }, face: FACES.su },
  ],
  stamp: { lines: ["ЗАРАБОТАЛА ЗА 2025:", "$13 МЛРД"], tone: "bad", at: 104, sub: "УШЛА В МИНУС НА $8 МЛРД · REUTERS, 20.02.2026" },
  person: { ...FACES.altman, at: 2 },
  clip: { shot: "dc", at: 2, label: "ДАТА-ЦЕНТР · ТУДА УХОДЯТ ДЕНЬГИ" },
};

// 05 — Anthropic: the same owners (CNBC 20.04.2026; Fortune 04.06.2026; Nvidia blog 18.11.2025; Anthropic 28.05.2026).
// 05-anthropic (re-recorded «Антро́пик», 4.18 s): Amazon@1.35 → 34, Google@2.07 → 51, Microsoft@2.40 → 58, Nvidia@3.39 → 81.
export const ANTHROPIC: Beat = {
  header: "ANTHROPIC: ТЕ ЖЕ ХОЗЯЕВА",
  focus: "anthropic",
  arrows: [
    { from: "amazon", to: "anthropic", tone: "invest", at: 24, label: "$18 МЛРД", big: { num: "$18", unit: "МЛРД", caption: "AMAZON · + ДО $20 МЛРД ПО ЭТАПАМ" }, face: FACES.jassy },
    { from: "google", to: "anthropic", tone: "invest", at: 41, label: "14%", big: { num: "14%", unit: "КОМПАНИИ", caption: "GOOGLE · ВЛАДЕЕТ 14%, ПОТОЛОК 15%" }, face: FACES.pichai },
    { from: "microsoft", to: "anthropic", tone: "invest", at: 48, label: "ДО $5 МЛРД", big: { num: "$15", unit: "МЛРД, ДО", caption: "MICROSOFT $5 + NVIDIA $10 · НОЯБРЬ 2025" }, face: FACES.nadella },
    { from: "nvidia", to: "anthropic", tone: "invest", at: 58, label: "ДО $10 МЛРД", face: FACES.huang },
    { from: "anthropic", to: "microsoft", tone: "pay", at: 76, label: "$30 МЛРД", big: { num: "$30", unit: "МЛРД", caption: "ЗА СЕРВЕРЫ MICROSOFT (AZURE)" } },
    { from: "anthropic", to: "amazon", tone: "pay", at: 90, label: "$100 МЛРД", big: { num: "$100", unit: "МЛРД", caption: "ЗА СЕРВЕРЫ AMAZON (AWS) · 10 ЛЕТ" } },
  ],
  stamp: { lines: ["ANTHROPIC СТОИТ $965 МЛРД:", "ДОРОЖЕ OPENAI"], tone: "hero", at: 100, sub: "ПОСЛЕДНИЙ РАУНД · МАЙ 2026" },
  person: { ...FACES.amodei, at: 3 },
};

// 06 — Nvidia sells to those it funded (CNBC 2026; Nvidia blog 18.11.2025; Motley Fool 15.10.2026; FT 23.05.2025).
// 06-nvidia: «чипы Nvidia покупают»@0.27–1.08 → the red wave first, «кому она сама дала деньги»@1.77–2.76 → the lime three.
export const NVIDIA: Beat = {
  header: "NVIDIA ПРОДАЁТ ТЕМ, КОМУ ДАЛА",
  focus: "nvidia",
  arrows: [
    { from: "oracle", to: "nvidia", tone: "pay", at: 6, label: "ЧИПЫ: $40 МЛРД", face: FACES.ellison },
    { from: "microsoft", to: "nvidia", tone: "pay", at: 10, label: "ЧИПЫ: 1 ГВт" },
    { from: "amazon", to: "nvidia", tone: "pay", at: 14, label: "ЧИПЫ: GB200" },
    { from: "coreweave", to: "nvidia", tone: "pay", at: 18, label: "ЧИПЫ В ДОЛГ" },
    { from: "nvidia", to: "openai", tone: "invest", at: 38, label: "$30 МЛРД", big: { num: "$30", unit: "МЛРД", caption: "ДАЛА OPENAI · 2026" }, face: FACES.altman },
    { from: "nvidia", to: "anthropic", tone: "invest", at: 52, label: "ДО $10 МЛРД", big: { num: "$10", unit: "МЛРД, ДО", caption: "ДАЛА ANTHROPIC · 2025" }, face: FACES.amodei },
    { from: "nvidia", to: "coreweave", tone: "invest", at: 64, label: "$6,3 МЛРД", big: { num: "$6,3", unit: "МЛРД", caption: "COREWEAVE · ВЫКУПИТ ВСЁ, ЧТО НЕ ПРОДАСТСЯ" } },
  ],
  stamp: { lines: ["NVIDIA СТОИТ $5,2 ТРЛН:", "ДОРОЖЕ ВСЕХ В МИРЕ"], tone: "hero", at: 84, sub: "20.10.2026" },
  person: { ...FACES.huang, at: 3 },
  clip: { shot: "gpu", at: 2, label: "ЧИП NVIDIA · ЕГО ПОКУПАЮТ ВСЕ" },
};

// 07 — where it is thin (Motley Fool 15.10.2026; ICE via Bloomberg 15.10.2026; Oracle 10-Q 31.08.2026).
// 07-weak: «Если один не заплатит»@0.12–1.4, «посыпятся все»@1.44 → stamp at 60.
export const WEAK: Beat = {
  header: "ГДЕ ТОНКО",
  headerBad: [1],
  arrows: [],
  pulses: [
    { node: "coreweave", at: 4, big: { num: "$35,6", unit: "МЛРД ДОЛГА", caption: "COREWEAVE · ЗАНИМАЕТ ПОД 15% ГОДОВЫХ" } },
    { node: "coreweave", at: 26, big: { num: ">60%", unit: "ШАНС ДЕФОЛТА", caption: "ЧТО НЕ ОТДАСТ ДОЛГИ ЗА 5 ЛЕТ · ОЦЕНКА РЫНКА" } },
    { node: "oracle", at: 46, big: { num: "$664", unit: "МЛРД ЗАКАЗОВ", caption: "ORACLE · ПОЛОВИНА: ОДНА OPENAI" } },
  ],
  stamp: { lines: ["ЕСЛИ ОДИН", "НЕ ЗАПЛАТИТ"], tone: "bad", at: 60, sub: "ПОСЫПЯТСЯ ВСЕ" },
  clip: { shot: "board", at: 2, label: "БИРЖА · ОБЛИГАЦИИ COREWEAVE ПАДАЮТ" },
};

export const BEATS = { openaiIn: OPENAI_IN, openaiOut: OPENAI_OUT, anthropic: ANTHROPIC, nvidia: NVIDIA, weak: WEAK } as const;

export type CoverArrow = { from: NodeId; to: NodeId; tone: Tone };

/** Every arrow of the reel, as chords of the ring: the cover and the final frame. */
export const COVER_ARROWS: CoverArrow[] = (() => {
  const seen = new Set<string>();
  const out: CoverArrow[] = [];
  for (const beat of Object.values(BEATS)) {
    for (const a of beat.arrows) {
      const key = `${a.from}>${a.to}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ from: a.from, to: a.to, tone: a.tone });
    }
  }
  return out;
})();

/** The hook's triangle, in voice order. */
export const TRIANGLE: CoverArrow[] = [
  { from: "nvidia", to: "openai", tone: "invest" },
  { from: "openai", to: "oracle", tone: "pay" },
  { from: "oracle", to: "nvidia", tone: "pay" },
];
