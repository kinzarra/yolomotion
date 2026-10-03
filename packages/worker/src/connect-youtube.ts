// Одноразовое подключение YouTube-канала к проекту:
//   MASTER_KEY=... npm run worker:connect-youtube -- --project philipp-why
// Открывает OAuth в браузере (loopback-redirect), меняет код на токены,
// сохраняет refresh-токен шифрованной credential-строкой на канале и
// заполняет channel.external_id / handle / url из channels.list.
//
// Требует YT_CLIENT_ID / YT_CLIENT_SECRET (OAuth-клиент типа Desktop app) и
// MASTER_KEY. ВАЖНО: OAuth consent screen должен быть в статусе «In
// production», не «Testing» — у testing-приложений refresh-токены умирают
// через 7 дней, и загрузчик молча разлогинится через неделю.
import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { encryptSecret } from "./credentials.js";
import { pool, q } from "./db.js";
import { migrate } from "./migrate.js";
import { exchangeCode, myChannel, oauthClient } from "./youtube.js";

const args = process.argv.slice(2);
const slugIndex = args.indexOf("--project");
const slug = slugIndex !== -1 ? args[slugIndex + 1] : undefined;
if (!slug) {
  console.error("Usage: connect-youtube --project <slug>");
  process.exit(1);
}

await migrate();
const channelRow = await q<{ id: number }>(
  `select ch.id from channel ch join project p on p.id = ch.project_id
    where p.slug = $1 and ch.platform = 'youtube'`,
  [slug],
);
if (!channelRow.rowCount) {
  throw new Error(`у проекта "${slug}" нет youtube-канала (npm run worker:seed?)`);
}
const channelId = channelRow.rows[0].id;

const client = oauthClient();
const PORT = 8767;
const redirectUri = `http://127.0.0.1:${PORT}/callback`;
const state = randomBytes(16).toString("hex");
const scopes = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
].join(" ");
const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth" +
  `?client_id=${encodeURIComponent(client.id)}` +
  `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  `&response_type=code&access_type=offline&prompt=consent` +
  `&scope=${encodeURIComponent(scopes)}&state=${state}`;

const code = await new Promise<string>((resolve, reject) => {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", redirectUri);
    if (url.pathname !== "/callback") {
      res.writeHead(404).end();
      return;
    }
    const err = url.searchParams.get("error");
    const got = url.searchParams.get("code");
    const gotState = url.searchParams.get("state");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(err ? `<h2>Ошибка: ${err}</h2>` : "<h2>Готово — вкладку можно закрыть.</h2>");
    server.close();
    if (err) reject(new Error(`oauth: ${err}`));
    else if (gotState !== state) reject(new Error("oauth: state mismatch"));
    else resolve(got!);
  });
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`Откройте в браузере:\n\n${authUrl}\n`);
    // Локальный удобный случай; на сервере ссылку открывают руками.
    if (process.platform === "darwin") execFile("open", [authUrl], () => {});
  });
});

const tokens = await exchangeCode(code, redirectUri);
if (!tokens.refresh_token) {
  throw new Error("Google не вернул refresh_token (нужны access_type=offline + prompt=consent)");
}

const info = await myChannel(tokens.access_token);
await q(
  `update channel set external_id = $2, handle = $3, url = $4 where id = $1`,
  [channelId, info.id, info.handle, `https://www.youtube.com/${info.handle ?? `channel/${info.id}`}`],
);
await q(
  `insert into credential (channel_id, kind, secret_enc)
   values ($1, 'youtube_oauth_refresh', $2)
   on conflict (channel_id, kind) where channel_id is not null
   do update set secret_enc = excluded.secret_enc`,
  [channelId, encryptSecret(tokens.refresh_token)],
);
console.log(`Подключён канал «${info.title}» (${info.handle ?? info.id}) → проект ${slug}`);
await pool.end();
