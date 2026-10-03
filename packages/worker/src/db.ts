import pg from "pg";
import { env } from "./env.js";

export const pool = new pg.Pool({ connectionString: env.databaseUrl, max: 5 });

export const q = <R extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<pg.QueryResult<R>> => pool.query<R>(text, params as never[]);

// Транзакция на выделенном клиенте — для claim и для атомарного
// «чекпоинт в video + продвижение stage» между стадиями.
export const tx = async <T>(
  fn: (c: pg.PoolClient) => Promise<T>,
): Promise<T> => {
  const c = await pool.connect();
  try {
    await c.query("begin");
    const result = await fn(c);
    await c.query("commit");
    return result;
  } catch (error) {
    await c.query("rollback").catch(() => {});
    throw error;
  } finally {
    c.release();
  }
};
