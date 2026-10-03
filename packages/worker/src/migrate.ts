// Накатывает migrations/*.sql по порядку, каждую в своей транзакции, с
// журналом в schema_migrations. Воркер вызывает это на старте: пока воркер
// один, гонки нет; когда контейнеров станет несколько — владельцем миграций
// станет api-контейнер, как в etl (advisory lock ниже уже сейчас делает
// параллельный старт безопасным).
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool, q, tx } from "./db.js";

const MIGRATIONS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../migrations",
);

export const migrate = async (): Promise<void> => {
  await q(`create table if not exists schema_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )`);
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    await tx(async (c) => {
      // Один процесс накатывает, остальные ждут на локе и видят запись.
      await c.query("select pg_advisory_xact_lock(hashtext('yolomotion_migrations'))");
      const seen = await c.query("select 1 from schema_migrations where name = $1", [file]);
      if (seen.rowCount) return;
      await c.query(readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
      await c.query("insert into schema_migrations (name) values ($1)", [file]);
      console.log(`applied ${file}`);
    });
  }
};

// Запуск как скрипт: npm run migrate -w @yolomotion/worker
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await migrate();
  await pool.end();
}
