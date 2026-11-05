// Shared beat pieces: the figure column (kicker → slammed number → source),
// and the series bar text for each part.
import React from "react";
import { useCurrentFrame } from "remotion";
import { imColors as colors } from "../palette";
import { Burst, Flash, Label, Slam } from "../ui";
import { usePunch } from "../../../reel";

export const PART = {
  1: "ЧАСТЬ 1 · ПЕСОК И ЧИП",
  2: "ЧАСТЬ 2 · ВИДЕОКАРТА",
  3: "ЧАСТЬ 3 · ДАТА-ЦЕНТР",
  4: "ЧАСТЬ 4 · ЭНЕРГИЯ",
  5: "ЧАСТЬ 5 · ТОКЕН",
  6: "ЧАСТЬ 6 · КВОТЫ",
  7: "ИТОГ",
} as const;
export const bar = (n: keyof typeof PART, episode: string) => `${PART[n]}  /  ${episode}`;

/** A spoken figure: what it is (kicker), the number slammed on its word, where it comes from. */
export const Fig: React.FC<{
  x: number;
  y: number;
  at: number;
  value: string;
  size?: number;
  bad?: boolean;
  kicker?: string;
  source?: string;
  roll?: { from: number; to: number; prefix?: string; suffix?: string };
  burst?: boolean;
}> = ({ x, y, at, value, size = 150, bad = false, kicker, source, roll, burst = true }) => {
  const frame = useCurrentFrame();
  const hit = usePunch(at, 16);
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, zIndex: 9, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
        {kicker && frame >= at - 6 && <Label at={at - 6} size={24}>{kicker}</Label>}
        {frame >= at && <Slam text={value} at={at} size={size} color={bad ? colors.bad : undefined} roll={roll} />}
        {source && frame >= at + 10 && <Label at={at + 10} size={18}>{source}</Label>}
      </div>
      {burst && <Burst at={at} x={x + size * 1.6} y={y + size * 0.9} color={bad ? colors.bad : undefined} />}
      <Flash amount={hit.energy * 0.7} color={bad ? colors.bad : undefined} />
    </>
  );
};
