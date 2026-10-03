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

## gasoline-inflation

Credit line: `templates/gasoline-inflation/scenes/OutroScene.tsx`.

| file | subject | author | licence | source |
|---|---|---|---|---|
| `gas-queue.jpg` | Petrol queue, London N14 | Christine Matthews | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Queuing_for_Petrol,_London_N14_-_geograph.org.uk_-_6984115.jpg) |
| `fuel-nozzle.jpg` | Fuel nozzle at a petrol station | Shixart1985 | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Control_panel_and_fuel_nozzle_at_a_gas_station.jpg) |
| `combine.mp4` | Combine harvester in Harjumaa, Estonia | Sillerkiil | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Video_of_combine_harvester_on_a_field_in_Harjumaa,_Estonia_(July_2022).webm) |
| `delivery-truck.jpg` | Delivery service truck | Takashi Hososhima | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Delivery_service_truck_(16277420261).jpg) |
| `bakery.mp4` | Bakery production process | Lycée Georges Baptiste | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Reflet_boulangerie.webm) |
| `checkout.jpg` | Grocery checkout line | Sonny doe | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Checkout_line_for_grocery_store.jpg) |

The two `.mp4` files are H.264 derivatives trimmed from their credited source
videos; the photographs were resized for the vertical composition. Attribution
and ShareAlike requirements remain attached to those derivatives.

## Own assets

`vibe-cloud-logo.png` and `yoloco-y.svg` are our own.

## yoloco-mcp — demo creator portraits (Pexels)

The six creators in the chat demo are real photographs, not silhouettes.
Pexels photos are free to use with no attribution required; they are credited
here anyway, and they are graded (desaturated, violet-cast) at render time so
they sit inside the reel's palette. Files:
`public/footage/yoloco-mcp/avatars/<name>.png`, square face-centred crops made
with `scripts/facecrop.swift` (Vision).

| file | photographer | source |
|---|---|---|
| `miamifitkate.png` | Mikhail Nilov | https://www.pexels.com/photo/blonde-woman-in-active-wear-6739935/ |
| `coach_dre305.png` | Instituto Alpha Fitness | https://www.pexels.com/photo/back-view-of-a-man-doing-pull-ups-33777755/ |
| `tampa_lift.png` | Andrea Musto | https://www.pexels.com/photo/confident-female-athlete-in-sportswear-studio-shot-31245340/ |
| `orlandoyoga_j.png` | Angela Roma | https://www.pexels.com/photo/fit-smiling-african-american-female-sitting-and-folding-hands-7479762/ |
| `flbeachbody.png` | cottonbro studio | https://www.pexels.com/photo/silhouette-of-a-boxer-in-a-gym-4761779/ |
| `run_jax.png` | MART PRODUCTION | https://www.pexels.com/photo/portrait-of-a-young-man-wearing-earbuds-outdoors-during-sunset-7879997/ |

The handles beside them are invented, and no real creator is named or quoted.
**The two accounts the reel flags as having a fake audience deliberately use
faceless photographs** — a back view and a silhouette. Pairing an identifiable
person's face with an on-screen "bots 59%" verdict is a reputational claim
about that person, and stock licensing does not make it one we may imply. It
also happens to be the better design: a profile picture with no face is what a
bought-follower account actually looks like, so the reveal is foreshadowed by
the picture instead of contradicted by it. Keep this rule if the demo data
ever changes: whichever creators get flagged must be the faceless ones.
