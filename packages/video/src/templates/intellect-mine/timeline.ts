// «Как добывают интеллект» (ВЫПУСК 09, long format 16:9): the whole chain from
// quartz to a token, in six parts. Scene lengths are derived from the measured
// clips; every visual cue is keyed to the caption page that carries its word,
// so a re-voiced line moves its numbers with it.
import { buildScenes, defineVoiceover, pageTimes, scenesDuration } from "../../reel";
import { DURATIONS } from "./durations";
import { ASR } from "./asr";

export const VO_RATE = 1.12;
type Clip = keyof typeof DURATIONS;
const v = (k: Clip) => DURATIONS[k] / VO_RATE;
const snap = (s: number) => Math.ceil(s * 20) / 20;

/** The face lines speak from their scene's frame 0 (a HeyGen slice is lip-synced from 0). */
export const FACE_LEAD = 0;
export const LEAD = 0.15;
/** Part card: the band sweeps in, the number lands at `hit`, the card breaks at `shatter`. */
export const CARD = { hit: 0.55, shatter: 1.75, len: 2.2 } as const;

/** What the captions say: the real spelling (the manifest spells brands phonetically for the voice). */
export const TEXT: Record<Clip, string> = {
  "00-hook": "Самый дорогой ресурс 2026 года не нефть и не золото. Это +интеллект. Только в этом году на его добычу тратят больше +700 +миллиардов +долларов.",
  "01-promise": "Сейчас я покажу весь завод: от +песка до ответа в твоём +чате.",
  "02-sand": "Всё начинается с песка. Точнее, с +кварца. Большую часть сверхчистого кварца в мире добывают в +одном +городке в Северной Каролине.",
  "03-hurricane": "В 2024 году !ураган остановил там обе шахты. И вся отрасль поняла: запаса хватит на !2 !или !3 !месяца.",
  "04-silicon": "Из кварца делают +кремний. Чистота: +девять +девяток. Его режут на круглые пластины размером с пиццу.",
  "05-asml": "Дальше на пластине печатают схему. +Светом. Машины для этого во всём мире делает +одна +компания: нидерландская ASML.",
  "06-euv": "Новейшая такая машина стоит больше +350 +миллионов +евро. Её везут в 40 контейнерах и трёх грузовых Боингах.",
  "07-taiwan": "Печатают на них почти все передовые чипы мира на +одном +острове: Тайвань, компания TSMC.",
  "08-wafer": "Одна пластина по технологии 2 нанометра стоит около +30 +тысяч +долларов, как новая машина. И делают её 3 месяца.",
  "09-memory": "К чипу добавляют сверхбыструю память. И тут новая !пробка: в Корее её уже продали на !3 !года вперёд.",
  "10-gpu": "Так получается +видеокарта. Только не игровая. 72 таких чипа NVIDIA собирают в один шкаф, и он стоит от +4 +до +6 +миллионов +долларов.",
  "11-rack": "Шкаф потребляет электричества как +100 +домов. Одно его охлаждение стоит как Тесла.",
  "12-nvidia": "Поэтому NVIDIA зарабатывает около +миллиарда +долларов +в +день.",
  "13-dc": "Сотни тысяч таких карт ставят в одно здание. Это +дата-центр, шахта, где добывают интеллект.",
  "14-colossus": "Кластер Илона Маска в Мемфисе: больше +200 +тысяч видеокарт под одной крышей.",
  "15-gw": "Такие заводы меряют уже в +гигаваттах. 1 гигаватт стоит около +50 +миллиардов +долларов.",
  "16-capex": "Amazon, Google, Microsoft и Meta только в 2026 году строят их больше чем на +700 +миллиардов. Больше всей экономики Швеции.",
  "17-power": "Но главная проблема даже не деньги. Это !электричество.",
  "18-iea": "В 2024 году дата-центры мира съели 415 тераватт-часов. К 2030 году будет !945, как вся Япония.",
  "19-nuclear": "Поэтому IT-гиганты покупают +атомную +энергию. Microsoft перезапускает Три-Майл-Айленд, станцию, где в 1979 году была !авария.",
  "20-bills": "А в США за это уже платят все: цена мощности на крупнейшем рынке электричества выросла !в !11 !раз.",
  "21-token": "И вот что выходит с конвейера: +токен, кусочек слова. Нейросеть отвечает тебе по одному токену.",
  "22-query": "Один простой вопрос тратит около +0,3 +ватт-часа. Это примерно 10 секунд работы телевизора.",
  "23-scale": "Но вопросов квадриллионы. Один Google перерабатывает +3,2 +квадриллиона токенов в месяц, в +330 +раз больше, чем 2 года назад.",
  "24-cheap": "Сам токен дешевеет: в 2023 году миллион токенов GPT-4 стоил !60 !долларов, сегодня +меньше +доллара.",
  "25-limits": "Тогда почему у тебя в подписке !лимиты? Почему чат пишет: попробуйте через 5 часов?",
  "26-melting": "Потому что видеокарт !не !хватает. Когда весь интернет рисовал картинки в стиле Гибли, глава OpenAI написал: наши видеокарты !плавятся.",
  "27-deal": "В мае 2026 года Anthropic удвоила лимиты Claude Code. Причина: арендовала у Маска +220 +тысяч видеокарт.",
  "28-quota": "Лимит в подписке это не жадность. Это +квота: твоя доля мощности, которую физически успели построить.",
  "29-rent": "И она !дорожает: в 2025 году час аренды видеокарты H100 стоил меньше 2 долларов, сейчас почти !3.",
  "30-chain": "Вот вся цепочка: песок из Америки, машина из Нидерландов, чип с Тайваня, память из Кореи, шкаф NVIDIA, дата-центр и электростанция.",
  "31-final": "Интеллект стал +товаром, как нефть. У любого товара есть цена и очередь. Вопрос в том, где в этой очереди окажешься +ты.",
  "32-sub": "Подписывайся, впереди больше разборов. И напиши в комментариях: сколько ты платишь за ИИ в месяц?",
};

/** Caption pages of up to three words; a lone short word never ends a sentence on its own page. */
const pages = (text: string) => {
  const w = text.split(" ");
  const out: string[] = [];
  for (let i = 0; i < w.length; ) {
    let n = Math.min(3, w.length - i);
    if (w.length - i - n === 1) n = Math.min(4, w.length - i);
    // break after a sentence end so a page never straddles two sentences
    const cut = w.slice(i, i + n).findIndex((x, j) => j < n - 1 && /[.?!:]$/.test(x));
    if (cut >= 0) n = cut + 1;
    out.push(w.slice(i, i + n).join(" "));
    i += n;
  }
  return out;
};

const CARD_AFTER = 0; // a part card carries no voice

export const SCENES = buildScenes({
  hook: snap(v("00-hook") + 0.35),
  promise: snap(v("01-promise") + 0.35),
  card1: CARD.len,
  sand: snap(LEAD + v("02-sand") + 0.4),
  hurricane: snap(LEAD + v("03-hurricane") + 0.4),
  silicon: snap(LEAD + v("04-silicon") + 0.4),
  asml: snap(LEAD + v("05-asml") + 0.35),
  euv: snap(LEAD + v("06-euv") + 0.5),
  taiwan: snap(LEAD + v("07-taiwan") + 0.4),
  wafer: snap(LEAD + v("08-wafer") + 0.4),
  memory: snap(LEAD + v("09-memory") + 0.45),
  card2: CARD.len,
  gpu: snap(LEAD + v("10-gpu") + 0.45),
  rack: snap(LEAD + v("11-rack") + 0.4),
  nvidia: snap(LEAD + v("12-nvidia") + 0.6),
  card3: CARD.len,
  dc: snap(LEAD + v("13-dc") + 0.4),
  colossus: snap(LEAD + v("14-colossus") + 0.45),
  gw: snap(LEAD + v("15-gw") + 0.4),
  capex: snap(LEAD + v("16-capex") + 0.6),
  card4: CARD.len,
  power: snap(LEAD + v("17-power") + 0.45),
  iea: snap(LEAD + v("18-iea") + 0.45),
  nuclear: snap(LEAD + v("19-nuclear") + 0.4),
  bills: snap(LEAD + v("20-bills") + 0.6),
  card5: CARD.len,
  token: snap(LEAD + v("21-token") + 0.45),
  query: snap(LEAD + v("22-query") + 0.4),
  scale: snap(LEAD + v("23-scale") + 0.45),
  cheap: snap(LEAD + v("24-cheap") + 0.6),
  card6: CARD.len,
  limits: snap(LEAD + v("25-limits") + 0.5),
  melting: snap(LEAD + v("26-melting") + 0.4),
  deal: snap(LEAD + v("27-deal") + 0.45),
  quota: snap(LEAD + v("28-quota") + 0.45),
  rent: snap(LEAD + v("29-rent") + 0.6),
  chain: snap(LEAD + v("30-chain") + 1.0),
  final: snap(v("31-final") + 0.4),
  sub: snap(LEAD + v("32-sub") + 1.8),
});
void CARD_AFTER;

export type SceneKey = keyof typeof SCENES;

/** Which scene speaks which clip, and whether the line is the face's (lead 0). */
export const LINE: Partial<Record<SceneKey, Clip>> = {
  hook: "00-hook", promise: "01-promise", sand: "02-sand", hurricane: "03-hurricane", silicon: "04-silicon",
  asml: "05-asml", euv: "06-euv", taiwan: "07-taiwan", wafer: "08-wafer", memory: "09-memory", gpu: "10-gpu",
  rack: "11-rack", nvidia: "12-nvidia", dc: "13-dc", colossus: "14-colossus", gw: "15-gw", capex: "16-capex",
  power: "17-power", iea: "18-iea", nuclear: "19-nuclear", bills: "20-bills", token: "21-token", query: "22-query",
  scale: "23-scale", cheap: "24-cheap", limits: "25-limits", melting: "26-melting", deal: "27-deal", quota: "28-quota",
  rent: "29-rent", chain: "30-chain", final: "31-final", sub: "32-sub",
};
const FACE_SCENES: SceneKey[] = ["hook", "promise", "final"];
export const leadOf = (k: SceneKey) => (FACE_SCENES.includes(k) ? FACE_LEAD : LEAD);

export const DURATION = scenesDuration(SCENES);

export const VOICEOVER = defineVoiceover(
  DURATIONS,
  (Object.keys(LINE) as SceneKey[]).map((k) => ({
    file: LINE[k] as string,
    start: SCENES[k].from + leadOf(k),
    pages: pages(TEXT[LINE[k] as Clip]),
  })),
  ASR,
);

const strip = (s: string) => s.replace(/^[~+!]/, "").replace(/[.,:;?!]+$/, "").toLowerCase();

/**
 * Scene-local seconds of the caption page that holds `word` in scene `k`'s
 * line (the n-th occurrence). Numbers and stamps land on this.
 */
export const cue = (k: SceneKey, word: string, nth = 0): number => {
  const line = VOICEOVER.find((l) => l.file === LINE[k]);
  if (!line) throw new Error(`no line in scene ${k}`);
  const times = pageTimes(line, VO_RATE);
  const target = word.toLowerCase();
  let seen = 0;
  for (let p = 0; p < line.pages.length; p++) {
    const words = line.pages[p].replace(/^~/, "").split(" ").map(strip);
    if (words.some((w) => w.startsWith(target))) {
      if (seen === nth) return times[p].start - SCENES[k].from;
      seen++;
    }
  }
  throw new Error(`cue: «${word}» not in ${LINE[k]}`);
};

/** Scene-local second the line ends. */
export const lineEnd = (k: SceneKey) => {
  const line = VOICEOVER.find((l) => l.file === LINE[k])!;
  return line.start + line.raw / VO_RATE - SCENES[k].from;
};
