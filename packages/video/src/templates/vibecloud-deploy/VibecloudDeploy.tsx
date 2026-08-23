// Write code → ask Claude → MCP deploy → live product → logo.
// Cuts land on the 120 BPM grid of the synthesized track (beat = fps/2).
import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SceneLayers } from "../../components/Layers";
import { vibe } from "./palette";
import { VibecloudDeployProps } from "./schema";
import { IdeScene } from "./scenes/IdeScene";
import { DeployScene } from "./scenes/DeployScene";
import { LiveScene } from "./scenes/LiveScene";
import { LogoScene } from "./scenes/LogoScene";

const sfx = (name: string) => staticFile(`sfx/${name}`);

export const VibecloudDeploy: React.FC<VibecloudDeployProps> = ({
  brandName,
  tagline,
  url,
  chatPrompt,
  headline,
}) => {
  const { fps } = useVideoConfig();
  const beat = (fps * 60) / 120; // track.wav is 120 BPM
  const T = {
    ide: { from: 0, len: 8 * beat },
    chat: { from: 8 * beat, len: 11 * beat },
    live: { from: 19 * beat, len: 14 * beat },
    logo: { from: 33 * beat, len: 7 * beat },
  };
  // SFX start 3 frames before their visual hit lands. Scene-cut impacts are
  // baked into track.wav (chords + booms land on the cuts), so no extra bass
  // layer here.
  const whooshes = [1, T.chat.from - 3, T.live.from - 3, T.logo.from - 3];
  const scrollWhoosh = T.live.from + 112; // page scroll after the CTA click
  const pops = [
    T.chat.from + 5, // user bubble
    T.chat.from + 55, // build ✓
    T.chat.from + 123, // deploy ✓
    T.chat.from + 131, // live URL
    T.live.from + 100, // cursor click on Get started
    T.logo.from + 1, // cloud
    T.logo.from + 11, // bolt
  ];

  return (
    <SceneLayers palette={vibe}>
      <Audio src={sfx("track.wav")} volume={0.55} />
      {whooshes.map((f) => (
        <Sequence key={`w${f}`} from={f}>
          <Audio src={sfx("whoosh.wav")} volume={0.4} />
        </Sequence>
      ))}
      {pops.map((f) => (
        <Sequence key={`p${f}`} from={f}>
          <Audio src={sfx("pop.wav")} volume={0.42} />
        </Sequence>
      ))}
      <Sequence from={scrollWhoosh}>
        <Audio src={sfx("whoosh.wav")} volume={0.3} />
      </Sequence>

      <Sequence from={T.ide.from} durationInFrames={T.ide.len}>
        <IdeScene len={T.ide.len} />
      </Sequence>
      <Sequence from={T.chat.from} durationInFrames={T.chat.len}>
        <DeployScene len={T.chat.len} prompt={chatPrompt} url={url} />
      </Sequence>
      <Sequence from={T.live.from} durationInFrames={T.live.len}>
        <LiveScene
          len={T.live.len}
          url={url}
          brandName={brandName}
          headline={headline}
        />
      </Sequence>
      <Sequence from={T.logo.from} durationInFrames={T.logo.len}>
        <LogoScene
          len={T.logo.len}
          brandName={brandName}
          tagline={tagline}
          url={url}
        />
      </Sequence>
    </SceneLayers>
  );
};
