// «Мы специально замедляем твой телефон» (long format, 16:9, the dev-myth kit).
// One scene per voice line plus five part cards. Scene lengths are the measured
// clip at VO_RATE plus a tail; every cue inside a scene is a clip second.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.08;
export const LEAD = 0.1;
type Clip = keyof typeof DURATIONS;
const v = (k: Clip) => DURATIONS[k] / VO_RATE;
const snap = (s: number) => Math.ceil(s * 20) / 20;

/** Scene-local second of a clip second. */
export const T = (clipSec: number, lead = LEAD) => lead + clipSec / VO_RATE;

/** Part card: band sweeps, number lands at `hit`, shatters at `shatter`. */
export const CARD = { hit: 1.15, shatter: 3.3, len: 3.9 } as const;

/**
 * What the captions show. The mp3s were read from a TTS spelling (big figures
 * in words, brands in Cyrillic); the screen keeps digits and Latin names. A
 * non-breaking space keeps a figure on one caption page.
 */
const N = " ";
export const SHOW: Record<Clip, string> = {
  "01-face": "Я 20 лет в IT. И сегодня признаюсь: твой телефон тормозит из-за нас.",
  "02-fast": "Компьютеры за это время стали примерно в 1000 раз мощнее.",
  "03-bank": "А приложение банка открывается всё те же 5 секунд. Засеки прямо сейчас.",
  "04-bill": `И за эти секунды ты платишь. Я посчитал: около 257${N}000${N}₽ за жизнь.`,
  "05-prove": "Сейчас покажу, куда уходят эти деньги. И почему мы делаем это специально.",
  "06-win95": `В 1995 году Windows${N}95 требовала 4${N}МБ памяти.`,
  "07-win11": `Windows${N}11 требует 4${N}ГБ. В 1000 раз больше.`,
  "08-same": "А делаешь ты всё то же самое: окно, папка, браузер.",
  "09-apps2012": `В 2012 году среднее приложение для Android весило 6${N}МБ.`,
  "10-bank537": `Приложение Сбера для Android сегодня весит 120${N}МБ. В 20 раз больше. И это только загрузка.`,
  "11-facebook": `Facebook всего за 4 года вырос в 12 раз: с 32${N}МБ до 388.`,
  "12-where": "Железо ускорилось в 1000 раз. А ждать ты меньше не стал. Куда делась вся эта скорость?",
  "13-ate": "Мы её съели.",
  "14-wirth": "Ещё в 1995 году это заметил Никлаус Вирт, создатель языка Pascal.",
  "15-law": "Он вывел закон: программы замедляются быстрее, чем ускоряется железо.",
  "16-editor": `Тогда его возмущало, что текстовый редактор, который раньше помещался в 8000${N}байт, стал требовать в 100 раз больше.`,
  "17-today": "Редактор, в котором я пишу код сегодня, весит сотни мегабайт.",
  "18-google": "В 2009 году Сергей Брин, сооснователь Google, сам назвал это законом. Это признают даже те, кто делает программы.",
  "19-once": "А один раз замедление было по-настоящему специальным.",
  "20-apple": "В 2017 году Apple признала, что замедляет iPhone со старой батареей.",
  "21-fines": `В США компания согласилась выплатить до 500${N}млн${N}$. Во Франции заплатила штраф 25${N}млн${N}€. В Италии ещё 10.`,
  "22-turn": "Но правда страшнее. Почти всегда мы тормозим твой телефон не со зла. Мы специально выбираем не ускорять. Потому что это дешевле.",
  "23-inside": "Вот как это выглядит изнутри.",
  "24-salary": `Время программиста стоит дорого. Помнишь: 254${N}000${N}₽ в месяц.`,
  "25-choice": "Ускорить приложение значит посадить команду на месяц. Это миллионы рублей и ни одной новой кнопки.",
  "26-free": "А твой новый телефон компании не стоит ничего. Тормозит? Купишь новый.",
  "27-superapp": `Ты зашёл перевести 500${N}₽. А вместе с банком загружаются музыка, такси, еда, кино, игры и чаты.`,
  "28-trackers": "Независимая проверка Exodus нашла в приложении Сбера 5 трекеров: аналитика, реклама, геолокация.",
  "29-layers": `Сверху фреймворк, чтобы один код работал и на iPhone, и на Android. Внутри ещё один браузер. И каждый слой добавляет всего 100${N}мс.`,
  "30-queue": "Поэтому при запуске твой баланс стоит последним в очереди: сначала реклама, проверки, аналитика и баннеры.",
  "31-flagship": `И главное признание. Мы проверяем приложения на новых флагманах. А на телефоне за 25${N}000${N}₽, на котором живёшь ты, почти никогда.`,
  "32-price": `Теперь посчитаем деньги. Средний смартфон в России стоит 25${N}700${N}₽.`,
  "33-cycle": "Меняют его примерно раз в 3 года. Чаще всего не потому, что сломался. Потому что начал тормозить.",
  "34-eu": "Хотя железо может жить дольше. С 2025 года Евросоюз обязал обновлять смартфоны минимум 5 лет, а батарея должна выдерживать 800 циклов зарядки.",
  "35-math": `С 15 до 75 лет это 60 лет. Раз в 3 года: 20 телефонов и 514${N}000${N}₽. Раз в 6 лет: 10 телефонов и 257${N}000.`,
  "36-diff": `Разница 257${N}000${N}₽. Почти месячная зарплата того самого программиста.`,
  "37-only": "И это только телефон. Без ноутбука, планшета и телевизора.",
  "38-question": "Сколько лет твоему телефону? Напиши в комментариях, посмотрим, у кого он живёт дольше всех.",
  "39-battery": "Что с этим делать. Первое: если телефон стал тормозить, сначала поменяй батарею. Это в разы дешевле нового телефона.",
  "40-delete": "Второе: удали то, чем не пользуешься, и выключи автозапуск. Многие тормоза это не твой телефон, а чужой код.",
  "41-web": "Третье: попробуй банк в браузере. Веб-версия часто легче приложения.",
  "42-final": "Твой телефон стареет не так быстро, как тебе кажется. Он тонет в нашем коде.",
  "43-cta": "А ты сколько лет ходишь со своим? Пиши в комментариях. И подпишись: дальше я расскажу, что ещё мы от тебя прячем.",
};

/**
 * Clip second at which `word` (a fragment of SHOW text) starts, by letter
 * weight, the same model the captions use. Good to ±0.2 s on these reads.
 */
export const cue = (clip: Clip, word: string, nth = 0): number => {
  const text = SHOW[clip];
  let idx = -1;
  for (let i = 0; i <= nth; i++) idx = text.toLowerCase().indexOf(word.toLowerCase(), idx + 1);
  if (idx < 0) throw new Error(`cue: «${word}» not in ${clip}`);
  const letters = (s: string) => (s.match(/[\p{L}\p{N}]/gu) ?? []).length;
  const pre = letters(text.slice(0, idx));
  const all = letters(text);
  const head = 0.12;
  const tail = 0.25;
  return head + (DURATIONS[clip] - head - tail) * (pre / all);
};

const tails: Record<Clip, number> = {
  "01-face": 0.3, "02-fast": 0.5, "03-bank": 0.7, "04-bill": 0.8, "05-prove": 0.4,
  "06-win95": 0.6, "07-win11": 0.7, "08-same": 0.6, "09-apps2012": 0.5, "10-bank537": 0.6,
  "11-facebook": 0.7, "12-where": 0.4, "13-ate": 0.5,
  "14-wirth": 0.5, "15-law": 0.8, "16-editor": 0.5, "17-today": 0.5, "18-google": 0.5,
  "19-once": 0.3, "20-apple": 0.5, "21-fines": 0.8, "22-turn": 0.7,
  "23-inside": 0.3, "24-salary": 0.6, "25-choice": 0.6, "26-free": 0.6, "27-superapp": 0.8,
  "28-trackers": 0.8, "29-layers": 0.7, "30-queue": 0.8, "31-flagship": 0.7,
  "32-price": 0.6, "33-cycle": 0.6, "34-eu": 0.6, "35-math": 1.0, "36-diff": 0.9, "37-only": 0.6, "38-question": 1.0,
  "39-battery": 0.6, "40-delete": 0.6, "41-web": 0.6, "42-final": 0.6, "43-cta": 2.5,
};
const len = (k: Clip) => snap(LEAD + v(k) + tails[k]);

export const SCENES = buildScenes({
  "01-face": len("01-face"), "02-fast": len("02-fast"), "03-bank": len("03-bank"), "04-bill": len("04-bill"), "05-prove": len("05-prove"),
  p1: CARD.len,
  "06-win95": len("06-win95"), "07-win11": len("07-win11"), "08-same": len("08-same"), "09-apps2012": len("09-apps2012"), "10-bank537": len("10-bank537"), "11-facebook": len("11-facebook"), "12-where": len("12-where"), "13-ate": len("13-ate"),
  p2: CARD.len,
  "14-wirth": len("14-wirth"), "15-law": len("15-law"), "16-editor": len("16-editor"), "17-today": len("17-today"), "18-google": len("18-google"), "19-once": len("19-once"), "20-apple": len("20-apple"), "21-fines": len("21-fines"), "22-turn": len("22-turn"),
  p3: CARD.len,
  "23-inside": len("23-inside"), "24-salary": len("24-salary"), "25-choice": len("25-choice"), "26-free": len("26-free"), "27-superapp": len("27-superapp"), "28-trackers": len("28-trackers"), "29-layers": len("29-layers"), "30-queue": len("30-queue"), "31-flagship": len("31-flagship"),
  p4: CARD.len,
  "32-price": len("32-price"), "33-cycle": len("33-cycle"), "34-eu": len("34-eu"), "35-math": len("35-math"), "36-diff": len("36-diff"), "37-only": len("37-only"), "38-question": len("38-question"),
  p5: CARD.len,
  "39-battery": len("39-battery"), "40-delete": len("40-delete"), "41-web": len("41-web"), "42-final": len("42-final"), "43-cta": len("43-cta"),
});

export const DURATION = scenesDuration(SCENES);

/** Caption pages of up to three words; a lone trailing word joins its page. */
const pages = (text: string) => {
  const w = text.split(" ");
  const out: string[] = [];
  for (let i = 0; i < w.length; ) {
    let n = Math.min(3, w.length - i);
    if (w.length - i - n === 1) n = Math.min(4, w.length - i);
    out.push(w.slice(i, i + n).join(" "));
    i += n;
  }
  return out;
};

export type { VoLine };

export const VOICEOVER = defineVoiceover(
  DURATIONS,
  (Object.keys(SHOW) as Clip[]).map((file) => ({ file, start: SCENES[file].from + LEAD, pages: pages(SHOW[file]) })),
);
