// ElevenLabs-синтез + нормализация + замер для стадии voiceover. Логика и
// константы — из packages/video/scripts/gen-voiceover.mjs, и урок оттуда
// сохранён: loudnorm ДВУХПРОХОДНЫЙ (linear=true). Однопроходный — динамический
// процессор: в паузах он подтягивает шумовой пол клона ~на 10 дБ, и это
// слышно как шипение.
import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { promisify } from "node:util";

const run = promisify(execFile);

const LUFS = -16;
const TP = -1.5;
const LRA = 11;
const PRE = "highpass=f=75"; // гул комнаты, который иногда выдаёт клон

const measureLoudness = async (file: string) => {
  const { stderr } = await run(
    "ffmpeg",
    ["-v", "info", "-i", file,
      "-af", `${PRE},loudnorm=I=${LUFS}:TP=${TP}:LRA=${LRA}:print_format=json`,
      "-f", "null", "-"],
    { maxBuffer: 16 * 1024 * 1024 },
  );
  return JSON.parse(stderr.slice(stderr.lastIndexOf("{"), stderr.lastIndexOf("}") + 1));
};

export const normalize = async (file: string): Promise<void> => {
  const m = await measureLoudness(file);
  const tmp = `${file}.norm.mp3`;
  await run("ffmpeg", ["-v", "error", "-y", "-i", file,
    "-af",
    [PRE,
      `loudnorm=I=${LUFS}:TP=${TP}:LRA=${LRA}` +
        `:measured_I=${m.input_i}:measured_TP=${m.input_tp}` +
        `:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}` +
        `:offset=${m.target_offset}:linear=true`,
    ].join(","),
    "-c:a", "libmp3lame", "-q:a", "2", tmp]);
  await run("mv", [tmp, file]);
};

export const probeDuration = async (file: string): Promise<number> => {
  const { stdout } = await run("ffprobe", ["-v", "error",
    "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  return Math.round(parseFloat(stdout.trim()) * 1000) / 1000;
};

export const synthesize = async (opts: {
  apiKey: string;
  voiceId: string;
  modelId?: string;
  voiceSettings?: Record<string, unknown>;
  text: string;
  outFile: string;
  signal?: AbortSignal;
}): Promise<void> => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${opts.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": opts.apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: opts.text,
        model_id: opts.modelId ?? "eleven_multilingual_v2",
        voice_settings: opts.voiceSettings,
      }),
      signal: opts.signal ?? null,
    },
  );
  if (!response.ok) {
    throw new Error(`ElevenLabs ${response.status}: ${await response.text()}`);
  }
  await writeFile(opts.outFile, Buffer.from(await response.arrayBuffer()));
};
