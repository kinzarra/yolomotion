#!/bin/bash
# SessionStart hook (.claude/settings.json). Does nothing on a laptop; in a
# Claude Code cloud session it makes the repo able to render, then prints the
# cloud rules — a SessionStart hook's stdout becomes the session's context.
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root" || exit 0
log() { echo "[cloud-setup] $*" >&2; }

# System layer — normally cached by the environment's setup script.
command -v ffprobe >/dev/null || bash scripts/cloud/setup.sh >&2

# Dependencies: once per lock file.
stamp=node_modules/.lock-hash
hash="$(sha1sum package-lock.json | cut -d' ' -f1)"
if [ "$(cat "$stamp" 2>/dev/null)" != "$hash" ]; then
  log "npm ci…"
  npm ci --no-audit --no-fund --loglevel=error >&2 && echo "$hash" > "$stamp"
fi
(cd packages/video && npx remotion browser ensure >/dev/null 2>&1) || log "Chrome Headless Shell download failed"

problems=()
command -v ffprobe >/dev/null || problems+=("ffmpeg/ffprobe missing — voiceover cannot be measured")
[ -n "${ELEVENLABS_API_KEY:-}" ] || problems+=("ELEVENLABS_API_KEY is not set in the cloud environment")
[ -n "${ELEVENLABS_VOICE_ID:-}" ] || problems+=("ELEVENLABS_VOICE_ID is not set — voiceover will refuse to run")
[ -n "${S3_BUCKET:-}" ] || problems+=("S3_BUCKET is not set — the finished mp4 cannot be delivered (npm run deliver)")

cat <<'EOF'
CLOUD SESSION (claude.ai/code). Follow the «Cloud runs» section of
.claude/skills/reel-production/SKILL.md: what works here, the two checkpoints,
and how the mp4 and the paid voiceover leave this machine (S3, npm run deliver).
EOF
if [ ${#problems[@]} -gt 0 ]; then
  echo "Environment problems — tell the user before starting work:"
  printf ' - %s\n' "${problems[@]}"
fi
exit 0
