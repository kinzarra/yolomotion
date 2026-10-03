// Telegram → Claude Code routine. A Cloudflare Worker that receives the bot's
// webhook, lets through ONE Telegram user (the author), and fires the
// yolomotion routine with the message as its payload. The routine runs in the
// cloud environment set up for this repo; the session reports back to the same
// chat itself (scripts/cloud/tg.sh). Setup: bots/telegram/README.md.
//
// Secrets (wrangler secret put …): TG_BOT_TOKEN, TG_WEBHOOK_SECRET,
// TG_ALLOWED_USER_ID, ROUTINE_ID, ROUTINE_TOKEN.

// The routines API is in beta; the header is part of the documented request
// (https://code.claude.com/docs/en/routines.md). If a fire starts failing with
// 400, compare this value against the docs first.
const ROUTINE_BETA = "experimental-cc-routine-2026-04-01";

const HELP = [
  "Пришлите заказ одним сообщением — как промпт в claude.ai/code.",
  "",
  "Например:",
  "«ВЫПУСК 06 ДЕНЬГИ · ПРОСТО про … Текст утверждаю, озвучку разрешаю до 3000 символов, собирай до mp4.»",
  "",
  "Без «утверждаю / разрешаю» сессия остановится на тексте и на цене озвучки и пришлёт вопрос сюда; отвечать — в сессии по ссылке.",
  "Файлы (фото, видео) пока не передаются — только текст.",
].join("\n");

const tg = (env, method, body) =>
  fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const reply = (env, msg, text) =>
  tg(env, "sendMessage", {
    chat_id: msg.chat.id,
    text,
    reply_parameters: { message_id: msg.message_id, allow_sending_without_reply: true },
    link_preview_options: { is_disabled: true },
  });

const handle = async (msg, env) => {
  const text = (msg.text ?? msg.caption ?? "").trim();
  if (!text || /^\/(start|help)\b/.test(text)) return reply(env, msg, HELP);

  const response = await fetch(
    `https://api.anthropic.com/v1/claude_code/routines/${env.ROUTINE_ID}/fire`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.ROUTINE_TOKEN}`,
        "anthropic-beta": ROUTINE_BETA,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      // The session gets this as its payload: where to report and what to do.
      body: JSON.stringify({
        text: JSON.stringify({ chat_id: msg.chat.id, message_id: msg.message_id, text }),
      }),
    },
  );
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 400);
    return reply(env, msg, `Не запустилось: ${response.status}\n${detail}`);
  }
  const fired = await response.json();
  const files = msg.photo || msg.video || msg.document ? "\nФайл из сообщения не передан — только текст." : "";
  return reply(env, msg, `Принято, сессия запущена:\n${fired.claude_code_session_url}${files}`);
};

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("ok");
    // Telegram echoes the secret given to setWebhook; anything else is not Telegram.
    if (request.headers.get("x-telegram-bot-api-secret-token") !== env.TG_WEBHOOK_SECRET) {
      return new Response("forbidden", { status: 403 });
    }
    const update = await request.json();
    const msg = update.message;
    // Only the author can order a reel: a fire spends money and pushes to the repo.
    // Everyone else is dropped silently, so the bot does not even confirm it exists.
    if (!msg || String(msg.from?.id) !== String(env.TG_ALLOWED_USER_ID)) {
      return new Response("ok");
    }
    // Answer Telegram at once: a slow reply makes it re-deliver the update, and
    // a re-delivered update would fire a second session.
    ctx.waitUntil(handle(msg, env));
    return new Response("ok");
  },
};
