// Срез метрик по всем публикациям YouTube: Data API v3 videos.list (part=
// statistics) по обычному API key — без OAuth. Кроны на сервере зовут это
// раз в N часов; каждая строка metric_snapshot — точка временного ряда, по
// которому потом считаются выводы (правила retention.md как SQL).
//   YOUTUBE_API_KEY=... npm run collect-stats -w @yolomotion/worker
// TikTok/Instagram появятся отдельными коллекторами по той же схеме.
import { env } from "./env.js";
import { pool, q } from "./db.js";

if (!env.youtubeApiKey) {
  console.error("YOUTUBE_API_KEY is not set — nothing to collect");
  process.exit(1);
}

const pubs = await q<{ id: number; external_id: string }>(
  `select p.id, p.external_id
     from publication p join channel c on c.id = p.channel_id
    where c.platform = 'youtube' and p.external_id is not null`,
);
if (!pubs.rowCount) {
  console.log("no youtube publications with external_id yet");
  await pool.end();
  process.exit(0);
}

// videos.list принимает до 50 id за запрос — одной страницы хватит надолго.
const byExternal = new Map(pubs.rows.map((p) => [p.external_id, p.id]));
const ids = [...byExternal.keys()];
for (let i = 0; i < ids.length; i += 50) {
  const page = ids.slice(i, i + 50);
  const url =
    "https://www.googleapis.com/youtube/v3/videos" +
    `?part=statistics&id=${page.join(",")}&key=${env.youtubeApiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`youtube api ${response.status}: ${await response.text()}`);
  }
  const data = (await response.json()) as {
    items: { id: string; statistics: Record<string, string> }[];
  };
  for (const item of data.items) {
    const s = item.statistics;
    await q(
      `insert into metric_snapshot (publication_id, views, likes, comments, raw)
       values ($1, $2, $3, $4, $5)`,
      [byExternal.get(item.id), Number(s.viewCount ?? 0),
        Number(s.likeCount ?? 0), Number(s.commentCount ?? 0),
        JSON.stringify(s)],
    );
    console.log(`${item.id}: views=${s.viewCount} likes=${s.likeCount} comments=${s.commentCount}`);
  }
}
await pool.end();
