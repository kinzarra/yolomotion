#!/bin/bash
# System layer for a Claude Code cloud session (claude.ai/code, Ubuntu 24.04,
# runs as root). Paste this file into the environment's «Setup script» field —
# it runs before the repo is guaranteed to exist, so it touches nothing in it.
# The repo-side half (npm ci, Chrome Headless Shell) is session-start.sh.
#
# ffmpeg/ffprobe: gen-voiceover measures and levels every clip with them.
# The rest is Remotion's list of runtime libraries for Chrome Headless Shell
# (the same list the Dockerfile installs on Debian); Ubuntu 24.04 renamed
# libasound2 to libasound2t64, so both names are tried.
set -u

export DEBIAN_FRONTEND=noninteractive
command -v ffprobe >/dev/null && dpkg -s libnss3 >/dev/null 2>&1 && exit 0

apt-get update -qq || exit 0
apt-get install -y -qq --no-install-recommends \
  ca-certificates ffmpeg \
  libnss3 libdbus-1-3 libatk1.0-0 libgbm1 libxrandr2 libxkbcommon0 \
  libxfixes3 libxcomposite1 libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 \
  libcairo2 libcups2 fonts-liberation fonts-noto-color-emoji || true
apt-get install -y -qq libasound2t64 2>/dev/null || apt-get install -y -qq libasound2 || true

# Never fail the environment: a missing package surfaces in session-start.sh
# with a readable message instead of a session that refuses to start.
exit 0
