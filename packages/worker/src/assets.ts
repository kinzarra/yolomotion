// Read-only раздача jobsDir на loopback: рендер получает per-job аудио через
// voiceoverDir="http://127.0.0.1:<port>/v<id>/vo" (см. engine.md), и бандл
// остаётся кешированным на весь деплой. Range поддержан, потому что media в
// Chromium его просит; наружу порт не публикуется ни в каком compose.
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, Server } from "node:http";
import path from "node:path";
import { env } from "./env.js";

const TYPES: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

export const startAssetServer = (): Promise<Server> =>
  new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? "/", "http://localhost");
        const file = path.join(env.jobsDir, url.pathname);
        // Нормализованный путь обязан остаться внутри jobsDir.
        if (!file.startsWith(path.resolve(env.jobsDir) + path.sep)) {
          res.writeHead(403).end();
          return;
        }
        const info = await stat(file);
        const type = TYPES[path.extname(file)] ?? "application/octet-stream";
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
        if (range && (range[1] || range[2])) {
          const start = range[1] ? Number(range[1]) : 0;
          const end = range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
          res.writeHead(206, {
            "Content-Type": type,
            "Content-Length": end - start + 1,
            "Content-Range": `bytes ${start}-${end}/${info.size}`,
            "Accept-Ranges": "bytes",
          });
          createReadStream(file, { start, end }).pipe(res);
        } else {
          res.writeHead(200, {
            "Content-Type": type,
            "Content-Length": info.size,
            "Accept-Ranges": "bytes",
          });
          createReadStream(file).pipe(res);
        }
      } catch {
        res.writeHead(404).end();
      }
    });
    server.once("error", reject);
    server.listen(env.assetsPort, "127.0.0.1", () => resolve(server));
  });

export const assetUrl = (...segments: string[]): string =>
  `http://127.0.0.1:${env.assetsPort}/${segments.join("/")}`;
