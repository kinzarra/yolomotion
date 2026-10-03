// YouTube Data API v3 без SDK: три вызова — обмен refresh-токена, resumable
// upload, channels.list. googleapis-пакет тянет мегабайты ради этого же fetch.
//
// OAuth-клиент приложения (Desktop app из Google Cloud Console) приходит из
// env: YT_CLIENT_ID / YT_CLIENT_SECRET. «Секрет» десктопного клиента по
// модели Google не является настоящим секретом, но в git ему всё равно не
// место. Refresh-токен канала — в credential (kind youtube_oauth_refresh),
// шифрованный под MASTER_KEY.
import { readFile } from "node:fs/promises";

export const oauthClient = (): { id: string; secret: string } => {
  const id = process.env.YT_CLIENT_ID;
  const secret = process.env.YT_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "YT_CLIENT_ID / YT_CLIENT_SECRET are not set — создайте OAuth-клиент " +
        "(Desktop app) в Google Cloud Console и положите пару в .env",
    );
  }
  return { id, secret };
};

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  error?: string;
  error_description?: string;
};

const tokenRequest = async (params: Record<string, string>): Promise<TokenResponse> => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  const data = (await response.json()) as TokenResponse;
  if (!response.ok || data.error) {
    throw new Error(`oauth token: ${data.error} ${data.error_description ?? ""}`);
  }
  return data;
};

export const exchangeCode = (code: string, redirectUri: string): Promise<TokenResponse> => {
  const client = oauthClient();
  return tokenRequest({
    grant_type: "authorization_code",
    code,
    client_id: client.id,
    client_secret: client.secret,
    redirect_uri: redirectUri,
  });
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const client = oauthClient();
  const data = await tokenRequest({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: client.id,
    client_secret: client.secret,
  });
  return data.access_token;
};

export const myChannel = async (
  accessToken: string,
): Promise<{ id: string; title: string; handle: string | null }> => {
  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) {
    throw new Error(`channels.list ${response.status}: ${await response.text()}`);
  }
  const data = (await response.json()) as {
    items?: { id: string; snippet: { title: string; customUrl?: string } }[];
  };
  const item = data.items?.[0];
  if (!item) throw new Error("channels.list: аккаунт без канала YouTube");
  return {
    id: item.id,
    title: item.snippet.title,
    handle: item.snippet.customUrl ?? null,
  };
};

// Resumable-заливка: init (метаданные + Location) → PUT байтов. Ретраи на
// уровне джоба: упавший PUT перезаливается целиком, локация не переиспользуется
// — при наших размерах (десятки МБ) session-resume не окупает свою логику.
export const uploadVideo = async (opts: {
  accessToken: string;
  file: string;
  title: string;
  description: string;
  privacy: "private" | "unlisted" | "public";
  signal?: AbortSignal;
}): Promise<string> => {
  const body = await readFile(opts.file);
  const init = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": String(body.byteLength),
      },
      body: JSON.stringify({
        snippet: {
          title: opts.title,
          description: opts.description,
          categoryId: "22", // People & Blogs — дефолт канала
        },
        status: {
          privacyStatus: opts.privacy,
          selfDeclaredMadeForKids: false,
        },
      }),
      signal: opts.signal ?? null,
    },
  );
  if (!init.ok) {
    throw new Error(`upload init ${init.status}: ${await init.text()}`);
  }
  const location = init.headers.get("location");
  if (!location) throw new Error("upload init: нет Location в ответе");

  const put = await fetch(location, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Length": String(body.byteLength) },
    body,
    signal: opts.signal ?? null,
  });
  if (!put.ok) {
    throw new Error(`upload put ${put.status}: ${await put.text()}`);
  }
  const data = (await put.json()) as { id?: string };
  if (!data.id) throw new Error("upload: ответ без id видео");
  return data.id;
};
