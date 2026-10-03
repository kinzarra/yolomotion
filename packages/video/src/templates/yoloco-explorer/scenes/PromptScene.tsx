// 02 prompt — /explorer/new as the app draws it: step 1 «Каких блогеров
// ищем?» with the brief typed in words, «Дальше», «AI разбирает запрос», then
// step 2 «AI понял так» with the parameter chips and «Запустить поиск».
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { exPalette } from "../palette";
import { COPY, Lang } from "../copy";
import { cues } from "../timeline";
import { APP, AppHeader, AppScreen, Chip, GradButton, Ico, IconKey, Panel, PlatformGlyph, SceneShell, Tap, ease, springAt } from "../ui";

const Stepper: React.FC<{ step: 1 | 2; copy: (typeof COPY)["en"] }> = ({ step, copy }) => {
  const item = (n: 1 | 2, title: string, hint: string) => {
    const on = step === n;
    const done = step > n;
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "9px 10px",
          borderRadius: 16,
          border: `1px solid ${on ? "#C7CCFF" : APP.slate200}`,
          background: on ? "#EEF0FF" : "#fff",
          opacity: on || done ? 1 : 0.55,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: on || done ? exPalette.primary : APP.slate100,
            color: on || done ? "#fff" : APP.slate400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {done ? <Ico k="check" size={15} color="#fff" stroke={3} /> : n}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: APP.slate900, whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ fontSize: 10, color: APP.slate500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hint}</div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ display: "flex", gap: 8, margin: "12px 16px 0" }}>
      {item(1, copy.step1, copy.step1Hint)}
      {item(2, copy.step2, copy.step2Hint)}
    </div>
  );
};

const TAG_ICON: Record<string, IconKey> = { tag: "tag", lang: "translate", people: "group" };

export const PromptScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = COPY[lang];
  const c = cues(lang, "prompt").map((s) => Math.round(s * fps));
  const enter = springAt(frame, fps, 0, "smooth");

  // step 1: typing from "describe…" until "AI reads…"
  const typeFrom = c[1] - 4;
  const typeTo = c[3] - 14;
  const typed = Math.floor(copy.brief.length * ease(frame, typeFrom, typeTo, (x) => x));
  const nextTap = c[3] - 6;
  const analyzing = frame >= nextTap + 4;
  const toStep2 = ease(frame, c[3] + 14, c[3] + 24);
  const step: 1 | 2 = toStep2 > 0.5 ? 2 : 1;
  const launchTap = c[4] + 26;

  // camera: push into the field while typing, settle for step 2
  const zoomIn = ease(frame, typeFrom - 10, typeFrom + 14) * (1 - toStep2);
  const zoom = 1 + zoomIn * 0.08;
  const scroll = interpolate(zoomIn, [0, 1], [0, 150]) + ease(frame, c[3] + 16, c[3] + 34, theme.ease.inOut) * 205;

  const shimmer = (frame % 30) / 30;

  const step1 = (
    <div style={{ opacity: 1 - toStep2, position: "absolute", left: 0, right: 0, top: 0 }}>
      <Panel style={{ margin: "12px 16px 0", padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: APP.slate900 }}>{copy.briefLabel}</div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: APP.slate400 }}>{typed} / 5000</div>
        </div>
        <div
          style={{
            marginTop: 10,
            height: 118,
            borderRadius: 16,
            border: `1px solid ${typed > 0 ? "#B9C0FF" : APP.slate200}`,
            boxShadow: typed > 0 ? "0 0 0 4px rgba(96,113,255,0.10)" : undefined,
            padding: "10px 12px",
            fontSize: 15,
            lineHeight: "22px",
            color: APP.slate900,
            background: "#fff",
          }}
        >
          {typed > 0 ? (
            <>
              {copy.brief.slice(0, typed)}
              <span style={{ color: exPalette.primary, opacity: Math.floor(frame / 8) % 2 ? 1 : 0 }}>|</span>
            </>
          ) : (
            <span style={{ color: APP.slate400 }}>…</span>
          )}
        </div>
        <div style={{ marginTop: 8, fontSize: 10.5, color: APP.slate500, lineHeight: "14px" }}>{copy.briefHint}</div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 18px",
              borderRadius: 999,
              background: analyzing ? "#EEF0FF" : exPalette.primary,
              color: analyzing ? exPalette.primary : "#fff",
              fontSize: 13.5,
              fontWeight: 800,
              transform: `scale(${frame >= nextTap && frame < nextTap + 5 ? 0.94 : 1})`,
              backgroundImage: analyzing
                ? `linear-gradient(100deg, transparent ${shimmer * 100 - 30}%, rgba(96,113,255,0.22) ${shimmer * 100}%, transparent ${shimmer * 100 + 30}%)`
                : undefined,
            }}
          >
            {analyzing ? <Ico k="sparkle" size={14} color={exPalette.primary} fill /> : null}
            {analyzing ? copy.analyzing : copy.next}
            {analyzing ? null : <span style={{ transform: "rotate(180deg)", display: "flex" }}><Ico k="back" size={14} color="#fff" stroke={2.4} /></span>}
          </div>
        </div>
      </Panel>
      <Tap x={360} y={252} at={nextTap} />
    </div>
  );

  const chipsAt = c[3] + 24;
  const step2 = (
    <div style={{ opacity: toStep2, position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${(1 - toStep2) * 30}px)` }}>
      <Panel style={{ margin: "12px 16px 0", padding: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: APP.slate500 }}>{lang === "ru" ? "ВАШ ЗАПРОС" : "YOUR REQUEST"}</div>
        <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: "19px", color: APP.slate700 }}>{copy.brief}</div>
        <div
          style={{
            marginTop: 12,
            borderRadius: 16,
            border: `1px solid ${APP.violet200}`,
            background: APP.violet50,
            padding: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: APP.violet800 }}>
            <Ico k="sparkle" size={14} color={APP.violet500} fill />
            {copy.aiUnderstood}
          </div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[...copy.tags.map((t) => ({ ...t, net: false })), { icon: "nets", label: "", net: true }, { icon: "list", label: copy.limitTag, net: false }].map((t, i) => {
              const p = springAt(frame, fps, chipsAt + i * 4, "bouncy");
              return (
                <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${0.7 + 0.3 * p})` }}>
                  {t.net ? (
                    <Chip>
                      <span style={{ display: "inline-flex", gap: 4 }}>
                        {(["instagram", "tiktok", "youtube", "telegram"] as const).map((n) => (
                          <PlatformGlyph key={n} p={n} size={15} />
                        ))}
                      </span>
                    </Chip>
                  ) : t.icon.length > 2 && TAG_ICON[t.icon] ? (
                    <Chip icon={TAG_ICON[t.icon]}>{t.label}</Chip>
                  ) : t.icon === "list" ? (
                    <Chip icon="table">{t.label}</Chip>
                  ) : (
                    <Chip flag={t.icon}>{t.label}</Chip>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <GradButton label={copy.launch} cost={copy.launchCost} pressed={frame >= launchTap && frame < launchTap + 6 ? 1 : 0} />
        </div>
      </Panel>
      <Tap x={300} y={312} at={launchTap} />
    </div>
  );

  return (
    <SceneShell>
      <AppScreen url={copy.url} enter={enter} scroll={scroll} zoom={zoom} focus={{ x: 215, y: 330 }}>
        <AppHeader title={copy.appTitle} />
        {/* hero card of /explorer/new */}
        <div
          style={{
            margin: "12px 16px 0",
            padding: 16,
            borderRadius: 24,
            border: `1px solid ${APP.slate200}`,
            background: "linear-gradient(120deg, #F8F7FF 0%, #FFFFFF 55%, #F2F7FF 100%)",
            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 999,
              background: "#fff",
              border: `1px solid ${APP.slate200}`,
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: exPalette.primary,
            }}
          >
            <Ico k="sparkle" size={11} color={exPalette.primary} fill />
            {copy.eyebrow}
          </div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 900, color: APP.slate900, letterSpacing: "-0.02em" }}>{copy.newTitle}</div>
          <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: "16px", color: APP.slate500 }}>{copy.newSubtitle}</div>
        </div>
        <Stepper step={step} copy={copy} />
        <div style={{ position: "relative", height: 420 }}>
          {step1}
          {step2}
        </div>
      </AppScreen>
    </SceneShell>
  );
};
