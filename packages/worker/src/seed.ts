// Идемпотентный сид: владелец Philipp, его ключи (env-ссылками — сами ключи
// остаются в env/Vault), три проекта и известные каналы. Запускать сколько
// угодно раз; ручные правки строк сид не затирает (on conflict do nothing).
//   npm run seed -w @yolomotion/worker
import { pool, tx } from "./db.js";
import { migrate } from "./migrate.js";

await migrate();

await tx(async (c) => {
  const owner = await c.query(
    `insert into owner (name) values ('Philipp')
     on conflict (name) do update set name = excluded.name
     returning id`,
  );
  const ownerId = (owner.rows[0] as { id: number }).id;

  // Ключи владельца. Секреты — ссылками на env; открытые id — значениями
  // (голос всегда yoclips-5b48065a, см. CLAUDE.md: me_v3 — неправильный).
  const creds: [string, string | null, string | null][] = [
    ["elevenlabs_api_key", "ELEVENLABS_API_KEY", null],
    ["elevenlabs_voice_id", null, "C5E5SzeWkb4qtqn6iyao"],
    ["heygen_api_key", "HEYGEN_API_KEY", null],
    ["heygen_avatar_group_id", null, "1b80626e44c945edbad8f5024ce9163b"],
    ["heygen_avatar_view_id", "HEYGEN_AVATAR_VIEW_ID", null],
  ];
  for (const [kind, ref, value] of creds) {
    await c.query(
      `insert into credential (owner_id, kind, secret_ref, value)
       values ($1, $2, $3, $4)
       on conflict (owner_id, kind) where owner_id is not null do nothing`,
      [ownerId, kind, ref, value],
    );
  }

  const projects: [string, string][] = [
    ["philipp-why", "Philipp Why?"],
    ["yoloco", "Yoloco"],
    ["vbcld", "vbcld"],
  ];
  for (const [slug, name] of projects) {
    const p = await c.query(
      `insert into project (owner_id, slug, name) values ($1, $2, $3)
       on conflict (slug) do update set name = excluded.name
       returning id`,
      [ownerId, slug, name],
    );
    const projectId = (p.rows[0] as { id: number }).id;
    // Каналы-заготовки: youtube всем, площадки/handle дозаполняются руками
    // или ботом. unique (project_id, platform) делает это идемпотентным.
    await c.query(
      `insert into channel (project_id, platform) values ($1, 'youtube')
       on conflict (project_id, platform) do nothing`,
      [projectId],
    );
  }
});

const summary = await pool.query(
  `select p.slug, o.name as owner,
          (select count(*) from channel ch where ch.project_id = p.id) as channels
     from project p join owner o on o.id = p.owner_id order by p.id`,
);
console.table(summary.rows);
await pool.end();
