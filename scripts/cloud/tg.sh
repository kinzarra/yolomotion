#!/bin/bash
# Cloud session → the author's Telegram (orders that came from bots/telegram).
#   scripts/cloud/tg.sh msg "text"            (or the text on stdin)
#   scripts/cloud/tg.sh photo still.png ["caption"]
#   scripts/cloud/tg.sh video out/<id>-reel.mp4 ["caption"]
#   scripts/cloud/tg.sh doc file ["caption"]
# Env: TELEGRAM_BOT_TOKEN, and the chat — TG_CHAT (from the order's payload)
# or TELEGRAM_CHAT_ID. TG_REPLY_TO threads every message under the order.
# Exit 3 = the file is over the Bot API's 50 MB upload limit.
set -euo pipefail
export LC_ALL=C.UTF-8 # ${text:0:N} must count characters, not bytes

token=${TELEGRAM_BOT_TOKEN:?TELEGRAM_BOT_TOKEN is not set in the cloud environment}
chat=${TG_CHAT:-${TELEGRAM_CHAT_ID:?neither TG_CHAT nor TELEGRAM_CHAT_ID is set}}
api="https://api.telegram.org/bot$token"

# --form-string, never -F, for text: curl reads a -F value starting with @ or <
# as a file name.
common=(--form-string "chat_id=$chat")
if [ -n "${TG_REPLY_TO:-}" ]; then
  common+=(--form-string "reply_parameters={\"message_id\":$TG_REPLY_TO,\"allow_sending_without_reply\":true}")
fi

call() {
  local out
  out=$(curl -sS "$@")
  grep -q '"ok":true' <<<"$out" || { echo "telegram: $out" >&2; exit 1; }
}

kind=${1:?usage: tg.sh msg|photo|video|doc …}
shift
case "$kind" in
  msg)
    text=${1:-$(cat)}
    while [ -n "$text" ]; do # 4096 is the message limit
      call "$api/sendMessage" "${common[@]}" --form-string "text=${text:0:4000}"
      text=${text:4000}
    done
    ;;
  photo|video|doc)
    file=${1:?file missing}
    caption=${2:-}
    if [ "$(stat -c %s "$file")" -gt $((50 * 1024 * 1024)) ]; then
      echo "telegram: $file is over 50 MB — send the render branch link instead" >&2
      exit 3
    fi
    field=$kind; method=send${kind^}
    [ "$kind" = doc ] && { field=document; method=sendDocument; }
    extra=()
    [ "$kind" = video ] && extra=(--form-string "supports_streaming=true")
    call "$api/$method" "${common[@]}" "${extra[@]}" \
      -F "$field=@$file" --form-string "caption=${caption:0:1000}"
    ;;
  *) echo "unknown kind: $kind" >&2; exit 2 ;;
esac
