// Резолвер ключей: video → project → owner → credential, с фолбэком в env.
// Три формы значения (см. 002_entities.sql): env-ссылка, шифртекст под
// MASTER_KEY, открытое несекретное значение.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { env } from "./env.js";
import { q } from "./db.js";

const masterKey = (): Buffer => {
  if (!env.masterKey) {
    throw new Error("MASTER_KEY is not set — cannot decrypt credential.secret_enc");
  }
  return /^[0-9a-f]{64}$/i.test(env.masterKey)
    ? Buffer.from(env.masterKey, "hex")
    : createHash("sha256").update(env.masterKey).digest();
};

// Формат secret_enc: nonce(12) || tag(16) || ciphertext.
export const encryptSecret = (plain: string): Buffer => {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", masterKey(), nonce);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return Buffer.concat([nonce, cipher.getAuthTag(), ct]);
};

export const decryptSecret = (enc: Buffer): string => {
  const decipher = createDecipheriv("aes-256-gcm", masterKey(), enc.subarray(0, 12));
  decipher.setAuthTag(enc.subarray(12, 28));
  return Buffer.concat([decipher.update(enc.subarray(28)), decipher.final()]).toString("utf8");
};

type CredentialRow = {
  secret_ref: string | null;
  secret_enc: Buffer | null;
  value: string | null;
};

const materialize = (row: CredentialRow): string => {
  if (row.value !== null) return row.value;
  if (row.secret_ref !== null) {
    const resolved = process.env[row.secret_ref];
    if (!resolved) throw new Error(`credential points at unset env var ${row.secret_ref}`);
    return resolved;
  }
  return decryptSecret(row.secret_enc!);
};

// Ключ владельца проекта данного видео. Видео без проекта (или владелец без
// такого ключа) падает в envFallback — так локальная разработка и старые
// строки работают без сидинга.
export const resolveCredential = async (
  videoId: number,
  kind: string,
  envFallback?: string,
): Promise<string | null> => {
  const { rows } = await q<CredentialRow>(
    `select c.secret_ref, c.secret_enc, c.value
       from video v
       join project p on p.id = v.project_id
       join credential c on c.owner_id = p.owner_id and c.kind = $2
      where v.id = $1`,
    [videoId, kind],
  );
  if (rows.length) return materialize(rows[0]);
  return envFallback ? (process.env[envFallback] ?? null) : null;
};

// То же, но для ключей площадки (OAuth-токены живут на канале, не на владельце).
export const resolveChannelCredential = async (
  channelId: number,
  kind: string,
): Promise<string | null> => {
  const { rows } = await q<CredentialRow>(
    "select secret_ref, secret_enc, value from credential where channel_id = $1 and kind = $2",
    [channelId, kind],
  );
  return rows.length ? materialize(rows[0]) : null;
};
