# Цифровой рубль: что изменится с 1 сентября?

- **id**: digital-ruble
- **format**: reel (1080×1920), ~65s (the script is 56s of on-screen time,
  the spoken lines are longer — the voiceover sets the beat lengths)
- **series**: личный финблог, `ДЕНЬГИ · ПРОСТО`
- **hero color**: acid lime `#CDFF3B` = the digital ruble / the fix / "yes";
  hot red `#FF3B3B` = alarm, "no", things that are NOT provided.
  Thermal paper `#F1EDE2` is a surface, not a signal.
- **hook (first 2s)**: a bank card fills the frame, slow float — at 0.7s the
  frame alarms (red flash + shake), the card tears into glitch slices and
  collapses into a glowing pixel ₽ glyph. Headline `ЦИФРОВОЙ РУБЛЬ —
  УЖЕ С 1 СЕНТЯБРЯ` prints above it.

## Style — «ЧЕК × ПИКСЕЛЬ» (receipt-punk × acid ledger)

The reel's identity is a collision of two visual languages, because that is
what the topic is:

| world | how it is drawn |
|---|---|
| **paper money / the familiar** | thermal receipts: warm off-white paper, zigzag torn bottom edge, monospaced "printed" ink that fades the way thermal print does, dashed separators, `ИТОГО` lines. Receipts *print* onto the frame under a lime print head. |
| **digital ruble / the new** | glitch-slice reveals (RGB split, horizontal bands), a dot-matrix ₽ glyph that glows, pixel grid in the background, scanline sweeps. Digital elements never fade in — they *snap* in through a glitch. |

Type: Unbounded 800–900 for every headline and for the karaoke captions
(wide, heavy, native Cyrillic). JetBrains Mono for receipt text, chips and
data. Inter for footnotes. No emoji — every ✓ / ✗ is drawn.

Rhythm: HIT → hold → print/build → HIT. Every beat opens with something
moving in the first 10 frames; every beat has one stamp, slam or tear.

## Beats

1. **hook** — bank card close-up → alarm (red flash, shake) → glitch tears the
   card into slices → it collapses into the lime pixel ₽ → headline prints
   `ЦИФРОВОЙ РУБЛЬ — УЖЕ С 1 СЕНТЯБРЯ`; a red `КОНТРОЛЬ?` chip flickers on
   the question.
2. **stop** — red `СТОП.` stamp slams; three cards fan in: ₿, a banknote, the
   ₽ glyph. Red crosses strike the first two, they get thrown off-frame with
   spin; the ₽ card stays and glows. Receipt lines: `НЕ КРИПТА ✗`,
   `НАЛИЧНЫЕ НЕ ОТМЕНЯЮТ ✗`.
3. **forms** — one ₽ token splits into three (clone pop) and each lands in a
   row of a ledger: `НАЛИЧНЫЕ → КОШЕЛЁК`, `БЕЗНАЛИЧНЫЕ → БАНК`,
   `ЦИФРОВЫЕ → ПЛАТФОРМА ЦБ`. The third row is the only lime thing.
4. **parity** — full-frame: `₽1` slams from the left, `1 ЦИФРОВОЙ ₽` from the
   right, `=` punches in the middle with a shockwave ring (the "coin hit",
   carried visually). Captions hidden — the frame is the line.
5. **launch** — tear-off calendar: `31 АВГ` rips away, `1 СЕН 2026` underneath;
   phone with a bank app slides up, the `Цифровой кошелёк` row gets tapped
   and lights up. Chips: `1 СЕНТЯБРЯ 2026`, `СТАРТ МАССОВОГО ВНЕДРЕНИЯ`.
6. **voluntary** — a big red button `ОТКРЫТЬ АВТОМАТИЧЕСКИ` shatters into
   shards that fall out of frame; a toggle `ТОЛЬКО ПО ЖЕЛАНИЮ` flips to lime.
   Lines: `ДОБРОВОЛЬНО ✓`, `АВТОМАТИЧЕСКИ — НЕТ`.
7. **pros** — a receipt prints: `ПЕРЕВОД 0 ₽`, `ОПЛАТА 0 ₽`, `КОМИССИЯ 0 ₽`,
   `ИТОГО 0 ₽*`; headline `0 ₽ КОМИССИИ*`; chip `В ПРИЛОЖЕНИИ БАНКА`;
   footnote `* для операций граждан с цифровыми рублями`.
8. **cons** — `КЕШБЭК?` `ПРОЦЕНТЫ?` `КРЕДИТ?` stack up; a lime portal opens,
   `%` glyphs and a credit card spiral into it; red stamp `НЕ ПРЕДУСМОТРЕНЫ`.
9. **question** — the frame tears in two: bank card (paper world) vs phone
   wallet with the ₽ glyph (digital world), `VS` on the tear.
   Headline `УДОБНЕЕ КАРТЫ?`.
10. **cta** — `ОТКРОЕТЕ?`; two buttons `ДА` (lime) / `НЕТ` (outline); a
    comment counter races up; `ОТПРАВЬ ТОМУ, КТО ДУМАЕТ, ЧТО НАЛИЧНЫЕ
    ОТМЕНЯЮТ` prints as the last receipt line.

## Voiceover

- `01-hook`: Через несколько дней в России массово запускают цифровой рубль.
  Ваши деньги теперь сможет контролировать государство?
- `02-stop`: Стоп. Не паникуйте: это не новая валюта, не крипта и не замена
  наличным.
- `03-forms`: Это третья форма тех же российских денег. Наличные лежат в
  кошельке, безналичные — в банке, а цифровые рубли — на платформе
  Центробанка.
- `04-parity`: Но цена у них одна: один рубль равен одному цифровому рублю.
- `05-launch`: С первого сентября две тысячи двадцать шестого года
  крупнейшие банки должны дать клиентам доступ к цифровым кошелькам,
  переводам и оплате покупок.
- `06-voluntary`: А теперь главное: для обычного человека это добровольно.
  Автоматически кошелёк вам не откроют.
- `07-pros`: Переводы и платежи для граждан обещают сделать бесплатными.
  Пользоваться кошельком можно будет через привычное банковское приложение.
- `08-cons`: Но процентов на цифровой остаток не будет. И кредит в цифровых
  рублях Центробанк тоже не выдаёт.
- `09-question`: То есть цифровой рубль — удобный платёжный инструмент. Но
  станет ли он удобнее банковской карты лично для вас — вот настоящий
  вопрос.
- `10-cta`: Вы бы открыли цифровой кошелёк? Напишите одним словом: «да» или
  «нет». И отправьте это видео тому, кто думает, что наличные отменяют.

Lime `+` words: ЦИФРОВОЙ, ДОБРОВОЛЬНО, БЕСПЛАТНЫМИ, «ДА». Red `!` words:
КОНТРОЛИРОВАТЬ, НЕ (крипта / откроют / будет), «НЕТ». Pages carried by a
scene headline are hidden (`~`): the parity line, the date.

## CTA

ОТКРОЕТЕ? — ДА / НЕТ. Share it with the one who thinks cash is being
cancelled.

## Deviations from the brief

- **No SFX.** The brief asks for an alarm hit, digital noise and a coin hit;
  this repo ships voiceover only (standing decision). Each hit is carried
  visually instead: red full-frame flash + frame shake on the alarm, glitch
  slices for the noise, a shockwave ring + punch on the coin.
- **Timings follow the voice, not the brief's clock.** The brief's 56s has
  ~69s of spoken text in it; beats are sized from the measured clips.
- **The date is spoken in words** («с первого сентября две тысячи двадцать
  шестого года») so the TTS reads it right; the screen shows `1 СЕНТЯБРЯ 2026`.
- **No emoji.** `❌` / `✅` from the brief are drawn as lime checks and red
  crosses so they stay inside the palette.
