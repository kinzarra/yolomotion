#!/bin/bash
# SessionStart hook (.claude/settings.json). Does nothing on a laptop; in a
# Claude Code cloud session it makes the repo able to render, then prints the
# cloud rules — a SessionStart hook's stdout becomes the session's context.
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root" || exit 0
log() { echo "[cloud-setup] $*" >&2; }

# System layer — normally cached by the environment's setup script.
{ command -v ffprobe >/dev/null && command -v yt-dlp >/dev/null; } || bash scripts/cloud/setup.sh >&2

# Dependencies: once per lock file.
stamp=node_modules/.lock-hash
hash="$(sha1sum package-lock.json | cut -d' ' -f1)"
if [ "$(cat "$stamp" 2>/dev/null)" != "$hash" ]; then
  log "npm ci…"
  npm ci --no-audit --no-fund --loglevel=error >&2 && echo "$hash" > "$stamp"
fi
(cd packages/video && npx remotion browser ensure >/dev/null 2>&1) || log "Chrome Headless Shell download failed"

# The lock file is written on macOS, so npm ci skips Remotion's Linux
# compositor (an optional dependency) — stills and renders die without it.
if [ ! -d node_modules/@remotion/compositor-linux-x64-gnu ]; then
  v="$(node -p "require('./node_modules/@remotion/renderer/package.json').version" 2>/dev/null)"
  [ -n "$v" ] && npm i --no-save --no-audit --no-fund --loglevel=error \
    "@remotion/compositor-linux-x64-gnu@$v" >&2 || log "Linux compositor install failed"
fi

# Headless Chrome reads trust from NSS, not from the system bundle: without the
# proxy's CA there, Google Fonts fail with ERR_CERT_AUTHORITY_INVALID and the
# render aborts. Import the bundle once (verification stays on).
ca=/root/.ccr/ca-bundle.crt
if [ -f "$ca" ] && [ ! -f "$HOME/.pki/nssdb/.ccr-imported" ]; then
  command -v certutil >/dev/null || apt-get install -y libnss3-tools >/dev/null 2>&1
  if command -v certutil >/dev/null; then
    mkdir -p "$HOME/.pki/nssdb"
    certutil -N -d "sql:$HOME/.pki/nssdb" --empty-password 2>/dev/null
    tmp="$(mktemp -d)"
    csplit -s -z -f "$tmp/ca-" "$ca" '/-----BEGIN CERTIFICATE-----/' '{*}'
    i=0
    for f in "$tmp"/ca-*; do
      grep -q "BEGIN CERT" "$f" || continue
      i=$((i + 1))
      certutil -A -d "sql:$HOME/.pki/nssdb" -t "C,," -n "ccr-$i" -i "$f" 2>/dev/null
    done
    rm -rf "$tmp"
    touch "$HOME/.pki/nssdb/.ccr-imported"
  else
    log "certutil missing — Chrome will not trust the proxy CA"
  fi
fi

problems=()
command -v ffprobe >/dev/null || problems+=("ffmpeg/ffprobe missing — voiceover cannot be measured")
[ -n "${ELEVENLABS_API_KEY:-}" ] || problems+=("ELEVENLABS_API_KEY is not set in the cloud environment")
[ -n "${ELEVENLABS_VOICE_ID:-}" ] || problems+=("ELEVENLABS_VOICE_ID is not set — voiceover will refuse to run")
[ -n "${S3_BUCKET:-}${S3_AVATAR_BUCKET:-}" ] || problems+=("S3_BUCKET is not set — the finished mp4 cannot be delivered (npm run deliver)")
[ -n "${PEXELS_API_KEY:-}" ] || problems+=("PEXELS_API_KEY is not set — no stock video clips, only Wikimedia Commons")
[ -n "${PIXABAY_API_KEY:-}" ] || problems+=("PIXABAY_API_KEY is not set — fetch-footage skips Pixabay")
command -v yt-dlp >/dev/null || problems+=("yt-dlp missing — fetch-footage skips YouTube Creative Commons")

cat <<'EOF'
CLOUD SESSION (claude.ai/code). Follow the «Cloud runs» section of
.claude/skills/reel-production/SKILL.md: what works here, the two checkpoints,
and how the mp4 and the paid voiceover leave this machine (S3, npm run deliver).
Do not commit or push anything. Before writing any text, ask the author about
the FACE (HeyGen avatar — which one, which beats — or none), unless the prompt
already names it.
EOF
if [ ${#problems[@]} -gt 0 ]; then
  echo "Environment problems — tell the user before starting work:"
  printf ' - %s\n' "${problems[@]}"
fi
exit 0
