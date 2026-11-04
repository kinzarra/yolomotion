// «Как разработчики обманывали нас» (long format, 16:9): the hook block,
// part 1 «Великий миф о программистах» and part 2 «Что на самом деле делает
// программист». Scene starts are derived from the lengths; clip durations
// are measured; word times come from ffmpeg silencedetect on each clip.
import { buildScenes, defineVoiceover, scenesDuration, VoLine } from "../../reel";
import { DURATIONS } from "./durations";

export const VO_RATE = 1.08;
const v = (k: keyof typeof DURATIONS) => DURATIONS[k] / VO_RATE;
const snap = (s: number) => Math.ceil(s * 20) / 20;

/** The face line speaks from its scene's frame 0 (the HeyGen slice is lip-synced from 0); the others wait a beat. */
export const HOOK_LEAD = 0;
export const LEAD = 0.1;
/** Scene-local second of a clip second (at 1.0×). */
export const T = (clipSec: number, lead = LEAD) => lead + clipSec / VO_RATE;

/** «Так нас обманывали?» … pause (author's note 15) … «Не совсем.» */
export const NQ_PAUSE = 0.8;
/** Part card: line sweeps in, «02» lands at `hit`, holds, shatters from `shatter`. */
export const P2CARD = { hit: 1.15, shatter: 3.3, len: 3.9 } as const;

export const NQ_LEAD = snap(LEAD + v("14-lie") + NQ_PAUSE);

/** One scene per voice line: the line plus a tail. Keys are the clip names. */
type Clip = keyof typeof DURATIONS;
const pad = <K extends Clip>(m: Record<K, number>) =>
  Object.fromEntries(Object.entries(m).map(([k, t]) => [k, snap(v(k as Clip) + (t as number))])) as Record<K, number>;

export const SCENES = buildScenes({
  // the hook block
  bill: snap(v("00-bill") + 0.35),
  today: snap(v("00-today") + 0.45),
  hook: snap(v("01-hook") + 0.25),
  minutes: snap(v("02-minutes") + 1.0),
  // part 1: the great myth
  profession: snap(v("03-profession") + 0.3),
  languages: snap(v("04-languages") + 1.6), // note 4: was +3.0
  terms: snap(v("05-terms") + 0.9),
  salary: snap(v("06-salary") + 1.1),
  button: snap(v("07-button") + 0.5),
  believe: snap(v("08-believe") + 0.7),
  why: snap(v("09-why") + 0.4),
  priests: snap(v("10-priests") + 1.0), // note 6: was +2.6
  ai: snap(v("11-ai") + 1.7), // the logos land (note 12)
  miracle: snap(v("12-miracle") + 1.6), // Harry and his wand (note 13)
  machine: snap(v("13-machine") + 0.5),
  notquite: snap(NQ_LEAD + v("14-notquite") + 0.6),
  explain: snap(v("15-explain") + 0.3), // note 39: ends with the face, no stray tail
  // part 2: what a developer actually does
  p2card: P2CARD.len, // notes 20, 21: hold to read, then shatter
  p2intro: snap(v("16-p2intro") + 0.4),
  tasks: snap(v("17-tasks") + 0.4),
  hard: snap(v("18-hard") + 2.2), // note 23: the tangle needs time to draw
  thing: snap(v("19-thing") + 0.6),
  solved: snap(v("20-solved") + 0.5),
  scratch: snap(v("21-scratch") + 0.7),
  libs: snap(v("22-libs") + 0.5),
  question: snap(v("23-question") + 0.9),
  why2: snap(v("24-why") + 0.5),
  search: snap(v("25-search") + 0.5),
  who: snap(v("26-who") + 1.4),
  // part 3: AI broke the monopoly on code
  p3card: P2CARD.len,
  ...pad({ "27-p3then": 0.4, "28-idea": 0.4, "29-find": 0.4, "30-pay": 0.5, "31-task": 0.5, "32-estimate": 0.9, "33-code": 0.4, "34-months": 0.8, "35-now": 0.5, "36-open": 0.5, "37-prompt": 0.4, "38-works": 0.4, "39-auto": 0.5, "40-stats": 0.3, "41-survey": 0.5, "42-ninety": 0.6, "43-fifth": 0.7, "44-think": 0.4, "45-paywhat": 0.9 }),
  // part 4: what about creativity
  p4card: P2CARD.len,
  ...pad({ "46-objections": 0.4, "47-sort": 0.4, "48-two": 0.4, "49-both": 0.5, "50-algo": 0.4, "51-typical": 0.5, "52-dontmix": 0.4, "53-errors": 0.4, "54-people": 0.8, "55-question": 0.5, "56-model": 0.8 }),
  // part 5: will programmers disappear
  p5card: P2CARD.len,
  ...pad({ "57-unpleasant": 0.6, "58-spec": 0.4, "59-architect": 0.4, "60-market": 0.4, "61-ten": 0.6, "62-example": 0.4, "63-cheaper": 0.5, "64-skill": 0.5, "65-harder": 0.5, "66-irony": 0.6, "67-conclusion": 0.5, "68-revolution": 0.6, "69-cta": 0.3, "70-sub": 2.8 }),
});

const at = (k: keyof typeof SCENES, lead = LEAD) => SCENES[k].from + lead;

/** Clip seconds of the words the type lands on. */
export const BILL_T = { number: 2.96, ratio: 4.5 } as const;
export const TODAY_T = { price: 2.24 } as const;
export const HOOK_T = { years: 0.18, lie: 2.05, prove: 2.95 } as const;
export const MINUTES_T = { machine: 0.17, human: 1.9, month: 3.16 } as const;
export const PROF_T = { reps: 1.62, decades: 2.6, without: 4.08, build: 6.82, civ: 8.05 } as const;
export const LANG_T = { morph: 0.95, code: 1.9 } as const;
export const SALARY_T = { number: 1.35 } as const;
export const BUTTON_T = { click: 1.6, ticket: 3.43, weeks: 5.35 } as const;
export const BELIEVE_T = { word: 1.45, crack: 2.05 } as const;
export const PRIESTS_T = { priests: 1.3, montage: 2.4 } as const;
export const AI_T = { ai: 1.4 } as const;
export const MIRACLE_T = { miracle: 0.65 } as const;
export const MACHINE_T = { files: 1.29, machine: 5.88 } as const;
/** `lie` is in 14-lie; the rest in 14-notquite (scene-local via NQ_LEAD). */
export const NOTQUITE_T = { lie: 0.3, notquite: 0.18, tool: 4.16, human: 5.28 } as const;
export const EXPLAIN_T = { difference: 2.31, destroy: 3.9, industry: 5.69 } as const;
export const TASKS_T = { fn: 0.75, ui: 2.2, db: 3.95, bugs: 5.6, api: 7.2 } as const;
export const THING_T = { most: 1.6, solved: 3.3 } as const;
export const SOLVED_T = { login: 0.15, loginOk: 2.35, pay: 3.0, payOk: 4.95, mail: 5.44, mailOk: 9.2 } as const;
export const SCRATCH_T = { scratch: 2.2 } as const;
export const LIBS_T = { libs: 0.9, docs: 1.9, ok: 4.65 } as const;
export const WHY2_T = { exists: 0.17, human: 6.42 } as const;
export const SEARCH_T = { not: 1.14, search: 4.4, adapt: 5.33, build: 6.04 } as const;
export const WHO_T = { ai: 2.71 } as const;

export const DURATION = scenesDuration(SCENES);

/** Parts 3–5: the spoken text, captioned in pages of up to three words. */
const P35: [Clip, string][] = [
  ["27-p3then", "Раньше создание приложения выглядело так."],
  ["28-idea", "У вас появляется идея."],
  ["29-find", "Вы находите разработчика."],
  ["30-pay", "Платите ему деньги."],
  ["31-task", "Объясняете задачу."],
  ["32-estimate", "Он оценивает сроки."],
  ["33-code", "Потом пишет код, тестирует, исправляет ошибки."],
  ["34-months", "Через несколько недель или месяцев вы получаете результат."],
  ["35-now", "А теперь представьте другую ситуацию."],
  ["36-open", "Вы открываете Claude Code или Codex."],
  ["37-prompt", "И говорите: создай мне веб-приложение. Добавь регистрацию, базу данных, личный кабинет и оплату подписки. Напиши тесты."],
  ["38-works", "И искусственный интеллект начинает работать. Он создаёт файлы, пишет функции, ставит зависимости, запускает проверки и сам исправляет ошибки."],
  ["39-auto", "Это уже не подсказки в редакторе. Это автоматизация всей разработки."],
  ["40-stats", "И самое интересное здесь даже не модели. Самое интересное, статистика."],
  ["41-survey", "В этом году JetBrains опросил больше пятнадцати тысяч профессиональных разработчиков."],
  ["42-ninety", "Девять из десяти пользуются ИИ-агентами каждую неделю. Две трети каждый день."],
  ["43-fifth", "А у каждого пятого больше восьмидесяти процентов кода пишут агенты."],
  ["44-think", "Вдумайтесь. Даже сами разработчики перестают писать код."],
  ["45-paywhat", "Если программист больше не пишет программы сам, за что мы ему платим?"],
  ["46-objections", "Я уже слышу возражения. Искусственный интеллект никогда не заменит настоящего разработчика. А как же архитектура? А креативность? А нестандартные решения?"],
  ["47-sort", "Давайте разбираться."],
  ["48-two", "Представьте двух людей. Один придумал новый музыкальный инструмент. Другой научился прекрасно на нём играть."],
  ["49-both", "Оба ценны. Но это разные занятия."],
  ["50-algo", "То же самое в программировании. Придумать новый алгоритм: это творчество. Изобрести новую архитектуру распределённых вычислений: тоже."],
  ["51-typical", "Но написать очередной интернет-магазин? Добавить форму входа? Сделать стандартный API?"],
  ["52-dontmix", "Давайте не путать инженерное творчество с типовыми задачами. Многие из них искусственный интеллект уже делает."],
  ["53-errors", "Да, он ошибается. Да, иногда оставляет дыры в безопасности. Да, не всегда понимает контекст."],
  ["54-people", "Но люди тоже ошибаются."],
  ["55-question", "Вопрос не в том, пишет ли ИИ идеальный код. Вопрос в том, насколько дешевле и быстрее получить работающий результат."],
  ["56-model", "Если машина делает задачу, а человек проверяет, старая экономика разработки ломается."],
  ["57-unpleasant", "И вот самый неприятный вопрос. Можно ли полностью заменить программиста?"],
  ["58-spec", "Если программист это человек, который превращает подробное задание в код, в некоторых проектах это уже возможно."],
  ["59-architect", "Но если это человек, который сам определяет требования, принимает архитектурные решения и отвечает за безопасность сложной системы, полной замены пока нет."],
  ["60-market", "И здесь важно другое. Чтобы изменить рынок труда, машине не нужно заменить каждого."],
  ["61-ten", "Представьте компанию, где работали десять программистов. С искусственным интеллектом тот же объём делают трое. Семь человек оказываются не нужны."],
  ["62-example", "Это пример, но он показывает главное: чтобы сломать старую модель, не нужно заменять всех."],
  ["63-cheaper", "Создавать программы будет всё дешевле. Маленькие команды будут делать то, для чего раньше нужны были целые отделы."],
  ["64-skill", "Раньше главный вопрос был: ты умеешь программировать? Теперь всё чаще: ты понимаешь, какой продукт нужно сделать?"],
  ["65-harder", "Потому что писать код всё проще. А понять, что нужно людям, всё так же сложно."],
  ["66-irony", "И, возможно, главная ирония в том, что разработчики построили цифровой мир, а потом помогли создать технологию, которая делает их собственную работу."],
  ["67-conclusion", "Мой вывод. Программирование никуда не исчезнет. Но человек, которому платят только за то, что он пишет код, может сильно подешеветь."],
  ["68-revolution", "И, может быть, настоящая революция не в том, что машины научились программировать. А в том, что миллионам людей больше не нужно становиться программистами, чтобы создать свою программу."],
  ["69-cta", "Как бы программисты ни сопротивлялись, писать код больше не нужно. Нужно создавать продукты."],
  ["70-sub", "Подпишитесь на канал, ставьте лайки, впереди ещё больше разборов."],
];
const pages = (text: string) => {
  const w = text.split(" ");
  const out: string[] = [];
  for (let i = 0; i < w.length; ) {
    let n = Math.min(3, w.length - i);
    // never leave a lone short word at a sentence end on its own page
    if (w.length - i - n === 1) n = Math.min(4, w.length - i);
    out.push(w.slice(i, i + n).join(" "));
    i += n;
  }
  return out;
};

export type { VoLine };

// Pages a headline or a big figure already shows stay hidden («~»).
export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "00-bill", start: at("bill"), pages: ["Вот сколько", "в среднем получал", "программист:", "+намного +больше", "средней зарплаты", "по стране."] },
  { file: "00-today", start: at("today"), pages: ["А вот сколько", "та же работа", "стоит сегодня:", "~сто долларов."] },
  { file: "01-hook", start: at("hook", HOOK_LEAD), pages: ["~Я 20 лет в IT.", "~И да: мы вас обманывали.", "~Сейчас докажу."] },
  { file: "02-minutes", start: at("minutes"), pages: ["+Машина делает", "за минуты то,", "за что человек", "брал !месяц."] },
  { file: "03-profession", start: at("profession"), pages: ["~Представьте профессию,", "представители которой", "!десятилетиями", "убеждали весь мир,", "что без них", "невозможно построить", "современную", "~цивилизацию."] },
  { file: "04-languages", start: at("languages"), pages: ["~Они говорили", "~на непонятных языках."] },
  { file: "05-terms", start: at("terms"), pages: ["Использовали", "!загадочные термины."] },
  { file: "06-salary", start: at("salary"), pages: ["Получали", "~огромные зарплаты."] },
  { file: "07-button", start: at("button"), pages: ["А когда вы просили", "добавить обычную", "кнопку на сайт,", "вам объясняли,", "почему это займёт", "~две недели."] },
  { file: "08-believe", start: at("believe"), pages: ["И самое интересное:", "~мы им верили."] },
  { file: "09-why", start: at("why"), pages: ["Потому что", "действительно", "!не !понимали,", "как всё это работает."] },
  { file: "10-priests", start: at("priests"), pages: ["Программисты стали", "~жрецами цифровой эпохи."] },
  { file: "11-ai", start: at("ai"), pages: ["Но затем появился", "+искусственный +интеллект."] },
  { file: "12-miracle", start: at("miracle"), pages: ["И произошло", "~чудо."] },
  { file: "13-machine", start: at("machine"), pages: ["Оказалось,", "что значительную", "часть работы,", "которую мы считали", "невероятно сложной,", "~машина делает сама."] },
  { file: "14-lie", start: at("notquite"), pages: ["~Так нас обманывали?"] },
  { file: "14-notquite", start: at("notquite", NQ_LEAD), pages: ["~Не совсем.", "Возможно, мы просто", "слишком долго путали", "~сложность инструмента", "с уникальностью", "~человека,", "который им пользуется."] },
  { file: "15-explain", start: at("explain"), pages: ["И сейчас я объясню,", "почему это различие", "может !уничтожить", "привычную нам", "~IT-индустрию."] },
  { file: "16-p2intro", start: at("p2intro"), pages: ["Давайте разберёмся,", "чем занимается", "~обычный разработчик."] },
  { file: "17-tasks", start: at("tasks"), pages: ["~Он пишет функции.", "~Создаёт интерфейсы.", "~Подключает базы данных.", "~Исправляет ошибки.", "~Интегрирует API."] },
  { file: "18-hard", start: at("hard"), pages: ["~Звучит сложно?"] },
  { file: "19-thing", start: at("thing"), pages: ["А теперь", "интересная вещь.", "Большинство этих задач", "+уже кто-то решал."] },
  { file: "20-solved", start: at("solved"), pages: ["Кто-то уже написал", "вход для пользователей.", "Кто-то уже создал", "систему платежей.", "Кто-то уже придумал,", "как отправлять письма", "и показывать", "фотографии на сайте."] },
  { file: "21-scratch", start: at("scratch"), pages: ["И программист", "далеко не всегда", "изобретает решение", "!с !нуля."] },
  { file: "22-libs", start: at("libs"), pages: ["Он берёт библиотеки,", "фреймворки,", "документацию", "и чужой опыт.", "И это совершенно", "+нормально."] },
  { file: "23-question", start: at("question"), pages: ["~Но задайте себе", "~один вопрос."] },
  { file: "24-why", start: at("why2"), pages: ["Если большинство решений", "уже существует,", "почему мы так долго", "считали, что для", "их повторения", "обязательно нужен", "!человек?"] },
  { file: "25-search", start: at("search"), pages: ["Ведь большая часть", "программирования", "это !не !изобретение.", "~Это поиск,", "~адаптация", "~и сборка готовых решений."] },
  { file: "26-who", start: at("who"), pages: ["И знаете, кто научился", "делать именно это?", "~Искусственный интеллект."] },
  ...P35.map(([file, text]) => ({ file, start: at(file as keyof typeof SCENES), pages: pages(text) })),
]);
