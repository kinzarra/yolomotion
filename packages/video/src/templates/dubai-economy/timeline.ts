// The scenario as data. Voiceover only — no music, no SFX — so every cut is
// paced off the spoken lines. The author's clone reads slower than the old
// house voice (≈13.8 chars/s against 16), so 1021 characters came in at 74.3s
// of audio; beats are sized from the measured clips, never from the estimate.
//
// Scene starts are derived from the lengths below; clip durations come from
// the generated durations module. Nothing here is transcribed by hand.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

// The clone plays at its native rate: `<Audio playbackRate>` resamples, and
// anything above 1.0 lifts the pitch of a real voice audibly.
export const VO_RATE = 1.0;

// Each beat = its line's lead + clip + ~0.3s tail, rounded up to 0.1s.
export const SCENES = buildScenes({
  hook: 5.5, // night skyline full-bleed, red «1%» slams in, ОТКУДА ДЕНЬГИ?
  turn: 7.5, // oil under the ground goes dark; three lime lanes run past DUBAI
  oil: 8.8, // receipt: 1966 — НЕФТЬ НАЙДЕНА, the reserve bar drains, КОНЧИТСЯ
  port: 8.1, // coins swerve from the palace to the port; the satellite photo prints
  map: 5.8, // takeoff over the city → dot globe, 8-hour ring, 2/3 pie
  airport: 6.0, // the A380 in an Emirates window, counter to 92 МЛН
  tax: 6.0, // payslip prints, НАЛОГ 0% stamps, БИЗНЕС 100% ТВОЙ
  model: 7.5, // terminal photo → ВХОД 0 gate, three tills, coins into the treasury
  crisis: 7.0, // cranes over half-built towers, the red debt line climbs and snaps
  rescue: 7.8, // $10 МЛРД, the tower photo, nameplate БУРДЖ ДУБАЙ → БУРДЖ-ХАЛИФА
  answer: 5.8, // НЕ НЕФТЬ. СЕРВИС. — the three lanes close into one receipt
  cta: 5.2, // ПЕРЕЕХАЛИ БЫ РАДИ 0%? — ДА / НЕТ + credits
});

export const DURATION = scenesDuration(SCENES);

/** Scene boundaries in seconds — where the flash cut fires. */
export const CUTS = Object.values(SCENES)
  .map((s) => s.from)
  .filter((t) => t > 0);

export type { VoLine };

// Caption markup, on the series rule:
//   "+WORD" → lime, only the flow / the answer — «мимо», «порт», «целиком»
//   "!WORD" → red, only oil and debt — «нефть», «процента», «мало», «долг»
//   "~PAGE" → hidden: a headline, counter or stamp already carries those
//             words, and every figure is spelled out for the TTS while the
//             frame shows the digits.
export const VOICEOVER = defineVoiceover(DURATIONS, [
  {
    file: "01-hook",
    // A hook that waits six frames before speaking reads as buffering.
    start: SCENES.hook.from,
    pages: ["!НЕФТЬ ДАЁТ ДУБАЮ", "ВСЕГО ОКОЛО !ПРОЦЕНТА", "ЭКОНОМИКИ.", "~ОТКУДА ТОГДА НЕБОСКРЁБЫ?"],
  },
  {
    file: "02-turn",
    start: SCENES.turn.from + 0.15,
    pages: [
      "ДУБАЙ ЗАРАБАТЫВАЕТ",
      "НЕ НА ТОМ, ЧТО ЛЕЖИТ",
      "ПОД ЗЕМЛЁЙ,",
      "А НА ТОМ, ЧТО +ЕДЕТ +МИМО:",
      "~ТОВАРЫ, ЛЮДИ, ДЕНЬГИ.",
    ],
  },
  {
    file: "03-oil",
    start: SCENES.oil.from + 0.15,
    pages: [
      "НЕФТЬ ЗДЕСЬ НАШЛИ",
      "~ТОЛЬКО В ШЕСТЬДЕСЯТ ШЕСТОМ,",
      "И ЕЁ БЫЛО !МАЛО.",
      "ШЕЙХ РАШИД ПОНИМАЛ:",
      "~ОНА КОНЧИТСЯ.",
    ],
  },
  {
    file: "04-port",
    start: SCENES.port.from + 0.15,
    pages: [
      "ПОЭТОМУ НЕФТЕДОЛЛАРЫ",
      "ПОШЛИ НЕ ВО ДВОРЦЫ,",
      "А В +ПОРТ.",
      "ДЖЕБЕЛЬ-АЛИ —",
      "~КРУПНЕЙШАЯ РУКОТВОРНАЯ",
      "~ГАВАНЬ В МИРЕ.",
    ],
  },
  {
    file: "05-map",
    start: SCENES.map.from + 0.15,
    pages: [
      "СЕКРЕТ В ГЕОГРАФИИ:",
      "~ЗА ВОСЕМЬ ЧАСОВ ПОЛЁТА",
      "ОТСЮДА ЖИВУТ",
      "~ДВЕ ТРЕТИ НАСЕЛЕНИЯ ЗЕМЛИ.",
    ],
  },
  {
    file: "06-airport",
    start: SCENES.airport.from + 0.15,
    pages: ["ОТСЮДА «ЭМИРЕЙТС»", "И АЭРОПОРТ", "~НА ДЕВЯНОСТО ДВА МИЛЛИОНА", "ПАССАЖИРОВ В ГОД."],
  },
  {
    file: "07-tax",
    start: SCENES.tax.from + 0.15,
    pages: ["А ПОТОМ — НАЛОГИ.", "~НА ЗАРПЛАТУ — НОЛЬ.", "ИНОСТРАНЕЦ ВЛАДЕЕТ", "СВОИМ БИЗНЕСОМ +ЦЕЛИКОМ."],
  },
  {
    file: "08-model",
    start: SCENES.model.from + 0.15,
    pages: [
      "ДУБАЙ УСТРОЕН",
      "КАК +АЭРОПОРТ:",
      "ВХОД БЕСПЛАТНЫЙ,",
      "А ПЛАТИШЬ ЗА ВСЁ ВНУТРИ —",
      "~ЖИЛЬЁ, ОТЕЛИ, СДЕЛКИ.",
    ],
  },
  {
    file: "09-crisis",
    start: SCENES.crisis.from + 0.15,
    pages: [
      "~НО В ДВЕ ТЫСЯЧИ ДЕВЯТОМ",
      "МОДЕЛЬ ЧУТЬ НЕ !РУХНУЛА:",
      "СТРОЙКА ШЛА В !ДОЛГ,",
      "И ПЛАТИТЬ СТАЛО НЕЧЕМ.",
    ],
  },
  {
    file: "10-rescue",
    start: SCENES.rescue.from + 0.15,
    pages: [
      "АБУ-ДАБИ ДАЛ",
      "~ДЕСЯТЬ МИЛЛИАРДОВ ДОЛЛАРОВ.",
      "А САМУЮ ВЫСОКУЮ",
      "БАШНЮ МИРА НАЗВАЛИ",
      "В ЧЕСТЬ СПАСИТЕЛЯ —",
      "~БУРДЖ-ХАЛИФА.",
    ],
  },
  {
    file: "11-answer",
    // 0.3s of silence before the conclusion — the series has no music to stop.
    start: SCENES.answer.from + 0.3,
    pages: ["ИТОГ:", "~ДУБАЙ — НЕ НЕФТЯНАЯ СКАЗКА,", "А БИЗНЕС, КОТОРЫЙ", "ПРОДАЁТ +УДОБСТВО."],
  },
  {
    file: "12-cta",
    start: SCENES.cta.from + 0.2,
    pages: ["~А ВЫ БЫ ПЕРЕЕХАЛИ", "~РАДИ НУЛЯ НАЛОГА НА ЗАРПЛАТУ?", "ДА ИЛИ НЕТ?"],
  },
]);
