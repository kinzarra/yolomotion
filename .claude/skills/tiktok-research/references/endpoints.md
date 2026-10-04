# Tiktok Scraper (tikwm) — all endpoints

Host `tiktok-scraper7.p.rapidapi.com`, every call `GET` with headers
`x-rapidapi-key: $RAPID_TIKTOK_KEY`, `x-rapidapi-host: tiktok-scraper7.p.rapidapi.com`.
Response: `{ code: 0, msg: "success", data: … }`; `code: -1` is an error with
the reason in `msg`. Lists paginate with `cursor` + `hasMore` (followers use
`time`). Read off the RapidAPI playground 2026-10-04; ✓ = called and working,
✗ = answers «deprecated». `!` = required.

Call any of them without writing code: `npm run tiktok -- raw /user/info unique_id=mrbeast`.

## Video

| endpoint | route | params |
|---|---|---|
| ✓ Get Video Detail | `/` | `url!` (link or id), `hd` (1 = original quality → `hdplay`) |

Video fields: `video_id`, `title` (caption), `duration`, `play_count`,
`digg_count`, `comment_count`, `share_count`, `collect_count`,
`download_count`, `create_time` (unix), `play` / `wmplay` / `hdplay` (mp4
URLs), `cover`, `music_info {title, author, original}`, `author {unique_id,
nickname}`, `is_ad`, `is_top`, `region`, `mentioned_users`.

## Search

| endpoint | route | params |
|---|---|---|
| ✓ Search Video | `/feed/search` | `keywords!`, `count` (≤30), `cursor`, `region`, `publish_time` (0 all, 1, 7, 30, 90, 180 days), `sort_type` (0 relevance, 1 likes, 2 date) |
| Search Photo | `/photo/search` | `keywords!`, `count`, `cursor`, `region` |
| ✓ Search Challenge | `/challenge/search` | `keywords!`, `count`, `cursor` |
| ✓ Search User | `/user/search` | `keywords!`, `count`, `cursor` |

## User

| endpoint | route | params |
|---|---|---|
| ✓ Get User's Detail | `/user/info` | `unique_id` or `user_id` → `user`, `stats {followerCount, heartCount, videoCount}` |
| ✓ Get User's Post | `/user/posts` | `unique_id` / `user_id`, `count` (≤30), `cursor`, `sort_type` (0 latest, 1 hot) |
| Get User's Repost | `/user/reposts` | `unique_id` / `user_id`, `count`, `cursor` |
| Get User's Story | `/user/story` | `unique_id` / `user_id`, `count`, `cursor` |
| Get User's Favorite Videos | `/user/favorite` | `unique_id` / `user_id`, `count`, `cursor` |
| Get User's Followers | `/user/followers` | `user_id!`, `count` (≤200), `time` |
| Get User's Followings | `/user/following` | `user_id!`, `count` (≤200), `time` |

## Collections and playlists

| endpoint | route | params |
|---|---|---|
| Get Collection By User | `/collection/list` | `unique_id` / `user_id`, `count`, `cursor` |
| Get Collection's Detail | `/collection/info` | `url!` (link or id) |
| Get Collection's Videos | `/collection/posts` | `collection_id!`, `count`, `cursor` |
| Get Playlist By User | `/mix/list` | `unique_id` / `user_id`, `count`, `cursor` |
| Get Playlist's Detail | `/mix/info` | `url!` (link or id) |
| Get Playlist's Videos | `/mix/posts` | `mix_id!`, `count`, `cursor` |

## Comments

| endpoint | route | params |
|---|---|---|
| ✓ Get Video's Comments | `/comment/list` | `url!` (link or id), `count` (≤50), `cursor` → `comments[] {text, digg_count, reply_total, user}`, `total` |
| Get Comment Reply | `/comment/reply` | `video_id!`, `comment_id!`, `count`, `cursor` |

## Music and hashtags

| endpoint | route | params |
|---|---|---|
| Get Music's Detail | `/music/info` | `url!` (link or id) |
| Get Music's Videos | `/music/posts` | `music_id!`, `count`, `cursor` |
| ✓ Get Challenge's Detail | `/challenge/info` | `challenge_id` or `challenge_name` → `id, cha_name, view_count, user_count` |
| ✓ Get Challenge's Videos | `/challenge/posts` | `challenge_id!`, `count`, `cursor` |

## Feed and trends

| endpoint | route | params |
|---|---|---|
| ✓ Get FYP Videos | `/feed/list` | `region!`, `count` (≤20) — for `ru` returns stale videos |
| ✗ Get Trending Videos | `/ads/trends/videos` | `country_code`, `order_by` (vv, like, …), `period`, `limit` |
| ✗ Get Trending Hashtag | `/ads/trends/hashtag` | `country_code`, `period` (7/30/120), `industry_id`, `filter_by` |
| ✗ Get Trending Sound | `/ads/trends/sound` | `country_code`, `period`, `rank_type`, `new_on_board`, `commercial_music`, `limit` |
| ✗ Get Trending Creators | `/ads/trends/creators` | `audience_country`, `limit` (≤50), … |

## Ads (TikTok Creative Center)

| endpoint | route | params |
|---|---|---|
| Get Top Ads | `/ads/top/ads` | **`page`** (undocumented, required), `limit`, `industry`, `objective` (1 traffic, 2 app installs, 3 conversions, 4 video views), … |
| Get Ads Detail | `/ads/top/ads/detail` | `material_id!` |
| Get Top Products | `/ads/top/products` | `limit` (≤20), `last` (1/7/30 days), `order_by` (post, ctr, cvr, cpa, …), `country_code`, `week` |
| Get Products Detail | `/ads/top/products/detail` | `last`, `week`, `country_code`, … |
| Get Products Metrics | `/ads/top/products/metrics` | `metrics` ('post,ctr', …), `month`, `country_code` |
