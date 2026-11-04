// Hear-back check for a voiceover: macOS speech recognition on every clip,
// printed next to what the manifest says, with suspicious words marked.
// ASR proves the WORDS; stress is still the author's ear, but a wrong word
// («Фуки», «НЭ», «Ванханен») shows up here before he has to write a note.
//
//   npm run vo-check -- <id> [--only=<clip>]
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const id = process.argv[2];
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
if (!id) { console.error("usage: npm run vo-check -- <id> [--only=<clip>]"); process.exit(1); }

const manifest = JSON.parse(readFileSync(path.join(root, "packages/video/scripts/voiceover", `${id}.json`), "utf8"));
// language from the manifest, or from the text itself (an EN cut of a RU reel keeps the RU settings, no languageCode)
const latin = manifest.lines.map(([, t]) => t).join(" ").replace(/[^A-Za-zА-Яа-яЁё]/g, "");
const lang = manifest.languageCode === "en" || (latin.match(/[A-Za-z]/g) ?? []).length > latin.length / 2 ? "en-US" : "ru-RU";
const work = path.join(tmpdir(), "yolomotion-vo-check");
mkdirSync(work, { recursive: true });

// Build the Speech-framework app once (it must be a bundle, see transcribe.swift).
const app = path.join(work, "Transcribe.app");
const bin = path.join(app, "Contents/MacOS/transcribe");
if (!existsSync(bin)) {
  mkdirSync(path.dirname(bin), { recursive: true });
  writeFileSync(path.join(app, "Contents/Info.plist"), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict><key>CFBundleIdentifier</key><string>dev.yolomotion.transcribe</string>
<key>CFBundleName</key><string>transcribe</string>
<key>NSSpeechRecognitionUsageDescription</key><string>Check voiceover clips.</string></dict></plist>`);
  execFileSync("swiftc", ["-O", path.join(root, "packages/video/scripts/transcribe.swift"), "-o", bin], { stdio: "inherit" });
}

const norm = (s) => s.toLowerCase().replace(/\u0301/g, "").replace(/ё/g, "е").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
const dir = path.join(root, "packages/video", manifest.outDir);
let bad = 0;
for (const [name, text] of manifest.lines) {
  if (only && name !== only) continue;
  const mp3 = path.join(dir, `${name}.mp3`);
  if (!existsSync(mp3)) { console.log(`${name}: no mp3`); continue; }
  const wav = path.join(work, `${id}-${name}.wav`);
  const json = path.join(work, `${id}-${name}.json`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp3, "-ar", "16000", "-ac", "1", wav]);
  try { execFileSync("rm", ["-f", json]); } catch {}
  spawnSync("open", ["-W", app, "--args", wav, json, lang]);
  const heard = existsSync(json) ? JSON.parse(readFileSync(json, "utf8")).text ?? "" : "";
  const want = norm(text);
  const got = new Set(norm(heard));
  // ASR writes amounts as digits and «$», so number words are not evidence of a misread
  const numberWord = /^(one|two|three|four|five|одн|перв|втор|трет|четв|пят|тысяч|миллион|миллиард|триллион|доллар|рубл|процент|thousand|million|billion|trillion|dollar|percent)/;
  const missing = want.filter((w) => w.length > 2 && !/^\d/.test(w) && !numberWord.test(w) && !got.has(w));
  if (missing.length) bad += 1;
  console.log(`${missing.length ? "✗" : "✓"} ${name}\n   текст:  ${text}\n   слышно: ${heard}${missing.length ? `\n   проверь на слух: ${missing.join(", ")}` : ""}`);
}
console.log(bad ? `\n${bad} клип(а) с подозрительными словами: добавь правку в packages/video/scripts/voiceover/stress.json и перезапиши --only=<clip>` : "\nвсе слова распознаны");
