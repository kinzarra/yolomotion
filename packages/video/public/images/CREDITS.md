# Image credits

The photographs are used under Creative Commons Attribution licences, which
require credit wherever the reel is published. The on-screen credit for each
reel lives in its closing scene; keep it if you re-cut the reel.

## mrbeast-100k

Credit line: `templates/mrbeast-100k/scenes/YolocoScene.tsx`.

| file | subject | author | licence | source |
|---|---|---|---|---|
| `mrbeast-tape.jpg` | MrBeast, 2021 | Fidias | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:MrBeast_2021.jpg) — frame from *"I Shook The Top 100 YouTuber's Hands"* |
| `mrbeast-studio.jpg` | MrBeast, 2023 | Steven Khan | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:MrBeast_2023.jpg) |
| `mrbeast-cutout.png` | derived from the above | Steven Khan | CC BY 4.0 | cut out by `scripts/cutout.mjs` |

All were downscaled and stripped of metadata. `mrbeast-tape.jpg` was rebuilt as
a 16:9 plate over a blurred copy of itself, and `mrbeast-cutout.png` is the
studio portrait matted off its sweep with a die-cut border — both are
derivative works, which CC BY permits as long as the credit stands.
Regenerate the cut-out with `scripts/cutout.mjs` (its header carries the exact
ffmpeg pipeline). The reel applies a greyscale grade at render time so the
photographs never spend the frame's single hero colour.

## khaby-silence

Credit line: `templates/khaby-silence/scenes/YolocoScene.tsx`.

| file | subject | author | licence | source |
|---|---|---|---|---|
| `khaby-hero.png` | Khaby Lame, Web Summit Lisbon 2025 | Web Summit | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Khaby_Lame_(54915131925).jpg) ← [Flickr](https://www.flickr.com/photos/websummit/54915131925/) |
| `khaby-calm.png` | Khaby Lame, Web Summit Lisbon 2025 | Web Summit | CC BY 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Khaby_Lame_(54915255039).jpg) ← [Flickr](https://www.flickr.com/photos/websummit/54915255039/) |
| `khaby-stage.png` | Khaby Lame on stage, Web Summit Lisbon 2025 | Web Summit | CC BY 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Khaby_Lame_(54915228860).jpg) ← [Flickr](https://www.flickr.com/photos/websummit/54915228860/) |
| `khaby-gesture.png` | Khaby Lame, State Farm "Bubble Wrap" shoot, 2023 | State Farm | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Khaby_Bubble_Wrap_TikTok_-_Khaby_dressed_as_a_mail_man_can%27t_believe_Mat_bubble_wrapped_his_car.jpg) ← [Flickr](https://www.flickr.com/photos/statefarm/) |

All four are subject mattes on transparency — derivative works, which CC BY
permits with credit — produced by `scripts/matte.swift` (the Vision
framework's foreground-instance mask; compile with
`swiftc -O scripts/matte.swift -o /tmp/matte`), then downscaled with ffmpeg
and stripped of metadata. `khaby-gesture.png` is a 1400×1300 crop of the
source at offset 330,170 before matting. The reel grades them to greyscale
at render time so a photograph never spends the frame's single accent.

## Own assets

`vibe-cloud-logo.png` and `yoloco-y.svg` are our own.
