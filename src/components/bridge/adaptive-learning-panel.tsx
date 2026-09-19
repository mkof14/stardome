"use client";

import { useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";
import { useCrisisMode } from "@/lib/crisis-mode";
import { useHud } from "@/lib/i18n/use-hud";
import { useAppMode } from "@/lib/mode";

type DayId = "1" | "30" | "90";
type ContactKind = "unknown" | "routine" | "review" | "anomaly";

type Stage = {
  id: DayId;
  vessels: number;
  baseline: 0 | 45 | 100;
  fp: number | null;
  contacts: { x: number; y: number; kind: ContactKind }[];
};

const STAGES: Record<DayId, Stage> = {
  "1": {
    id: "1",
    vessels: 3,
    baseline: 0,
    fp: null,
    contacts: [
      { x: 18, y: 36, kind: "unknown" },
      { x: 72, y: 28, kind: "unknown" },
      { x: 80, y: 68, kind: "unknown" },
    ],
  },
  "30": {
    id: "30",
    vessels: 14,
    baseline: 45,
    fp: 22,
    contacts: [
      { x: 14, y: 42, kind: "routine" },
      { x: 28, y: 24, kind: "routine" },
      { x: 36, y: 70, kind: "review" },
      { x: 58, y: 30, kind: "routine" },
      { x: 70, y: 62, kind: "unknown" },
      { x: 84, y: 38, kind: "review" },
    ],
  },
  "90": {
    id: "90",
    vessels: 37,
    baseline: 100,
    fp: 6,
    contacts: [
      { x: 12, y: 40, kind: "routine" },
      { x: 22, y: 22, kind: "routine" },
      { x: 34, y: 68, kind: "routine" },
      { x: 48, y: 28, kind: "routine" },
      { x: 62, y: 72, kind: "routine" },
      { x: 74, y: 34, kind: "routine" },
      { x: 82, y: 58, kind: "anomaly" },
    ],
  },
};

const KIND_CLASS: Record<ContactKind, string> = {
  unknown: "bg-[#8d939c]",
  routine: "bg-ok",
  review: "bg-attn",
  anomaly: "bg-crit",
};

export function AdaptiveLearningPanel() {
  const { hud } = useHud();
  const [day, setDay] = useState<DayId>("1");
  const [expanded, setExpanded] = useState(true);
  const { crisis } = useCrisisMode();
  const { live } = useAppMode();
  const days: { id: DayId; label: string; stage: string }[] = [
    { id: "1", label: hud.learning.day1, stage: hud.learning.stageNew },
    { id: "30", label: hud.learning.day30, stage: hud.learning.stageLearning },
    { id: "90", label: hud.learning.day90, stage: hud.learning.stageKnown },
  ];
  const copy = {
    "1": { stats: hud.learning.stats1, blurb: hud.learning.blurb1, sees: hud.learning.seesNew },
    "30": { stats: hud.learning.stats30, blurb: hud.learning.blurb30, sees: hud.learning.seesLearning },
    "90": { stats: hud.learning.stats90, blurb: hud.learning.blurb90, sees: hud.learning.seesKnown },
  }[day];
  const stage = STAGES[day];
  const baselineLabel =
    stage.baseline === 0
      ? hud.learning.baselineNone
      : stage.baseline === 45
        ? hud.learning.baselinePartial
        : hud.learning.baselineYes;

  if (crisis) return null;

  return (
    <div className="bg-bridge-bg px-4 pb-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <HudPanel
          id="adaptive-learning-panel"
          testId="adaptive-learning-panel"
          className="scroll-mt-20"
          title={hud.learning.title}
          glyph="learn"
          extra={
            <div className="flex items-center gap-3">
              <span className="hidden font-body text-xs text-bridge-dim sm:inline">
                {live ? hud.learning.noHistory : hud.learning.illustrative}
              </span>
              <button
                type="button"
                data-testid="learning-toggle"
                onClick={() => setExpanded((open) => !open)}
                className="font-body text-sm text-orange hover:underline"
              >
                {expanded ? hud.learning.hide : hud.learning.show}
              </button>
            </div>
          }
        >
          {expanded ? (
            <>
              <p className="mb-5 max-w-3xl text-sm leading-relaxed text-bridge-dim">
                {hud.learning.lead}
              </p>

              <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label={hud.learning.timeline}>
                {live ? (
                  <span
                    className="rounded-xl bg-orange px-3 py-2 font-body text-sm text-white"
                    data-testid="learning-day-0"
                  >
                    {hud.learning.day0}
                  </span>
                ) : null}
                {days.map((item, index) => {
                  const locked = live && item.id !== "1";
                  const active = !live && item.id === day;
                  return (
                    <div key={item.id} className="flex items-center gap-2">
                      {index > 0 ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "hidden h-px w-8 sm:block",
                            Number(day) >= Number(item.id) ? "bg-orange" : "bg-bridge-line",
                          )}
                        />
                      ) : null}
                      <button
                        type="button"
                        role="tab"
                        aria-selected={active}
                        data-testid={`learning-day-${item.id}`}
                        disabled={locked}
                        title={locked ? hud.learning.lockedTip : undefined}
                        onClick={() => {
                          if (!locked) setDay(item.id);
                        }}
                        className={cn(
                          "min-w-[6.5rem] rounded-xl px-3 py-2 text-start",
                          live && item.id === "1" && "hidden",
                          active
                            ? "bg-orange text-white"
                            : "border border-bridge-line bg-bridge-bg text-bridge-text hover:border-orange hover:text-orange",
                          locked && "cursor-not-allowed opacity-40 hover:border-bridge-line hover:text-bridge-text",
                        )}
                      >
                        <span className="block font-body text-sm font-semibold">{item.label}</span>
                        <span className={cn("block text-xs", active ? "text-white/80" : "text-bridge-dim")}>
                          {item.stage}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {live ? (
                <p
                  data-testid="learning-live-empty"
                  className="rounded-xl border border-bridge-line bg-bridge-bg px-4 py-6 font-body text-sm text-bridge-dim"
                >
                  {hud.learning.liveEmpty}
                </p>
              ) : (
                <>
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    <section
                      aria-labelledby="learning-scene-title"
                      className="overflow-hidden rounded-2xl border border-bridge-line bg-bridge-bg p-4"
                    >
                      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                        <h3 id="learning-scene-title" className="font-body text-sm font-semibold text-bridge-text">
                          {hud.learning.whatItSees}
                        </h3>
                        <p className="text-xs text-bridge-dim">{copy.sees}</p>
                      </div>
                      <LearningScene
                        stage={stage}
                        objectLabel={hud.learning.objectHere}
                        knownLabel={hud.learning.knownActivity}
                      />
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-bridge-dim">
                        {(
                          [
                            ["unknown", hud.learning.legendUnknown],
                            ["routine", hud.learning.legendRoutine],
                            ["review", hud.learning.legendReview],
                            ["anomaly", hud.learning.legendAnomaly],
                          ] as const
                        ).map(([kind, label]) => (
                          <li key={kind} className="inline-flex items-center gap-1.5">
                            <span className={cn("h-2 w-2 rounded-full", KIND_CLASS[kind])} />
                            {label}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      <Metric
                        label={hud.learning.knownVessels}
                        value={String(stage.vessels)}
                      />
                      <Metric
                        label={hud.learning.baseline}
                        value={baselineLabel}
                        bar={stage.baseline}
                      />
                      <Metric
                        label={hud.learning.falsePositives}
                        value={stage.fp === null ? hud.learning.notMeasured : `~${stage.fp}%`}
                        bar={stage.fp === null ? 0 : Math.max(8, 100 - stage.fp * 3)}
                        inverse
                      />
                    </div>
                  </div>

                  <p data-testid="learning-stats" className="sr-only">
                    {copy.stats}
                  </p>
                  <p data-testid="learning-blurb" className="mt-4 text-sm leading-relaxed text-bridge-text">
                    {copy.blurb}
                  </p>
                  <p className="mt-3 text-xs text-bridge-dim">{hud.learning.footnote}</p>
                </>
              )}
            </>
          ) : (
            <p className="font-body text-xs text-bridge-dim">{hud.learning.illustrative}</p>
          )}
        </HudPanel>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  bar,
  inverse,
}: {
  label: string;
  value: string;
  bar?: number;
  inverse?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-bridge-line bg-bridge-bg px-4 py-3">
      <p className="font-body text-xs text-bridge-dim">{label}</p>
      <p className="mt-1 font-body text-2xl font-semibold tracking-tight text-bridge-text">{value}</p>
      {typeof bar === "number" ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bridge-line/70" aria-hidden="true">
          <div
            className={cn("h-full rounded-full", inverse ? "bg-ok" : "bg-orange")}
            style={{ width: `${Math.min(100, bar)}%` }}
          />
        </div>
      ) : null}
    </article>
  );
}

function LearningScene({
  stage,
  objectLabel,
  knownLabel,
}: {
  stage: Stage;
  objectLabel: string;
  knownLabel: string;
}) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-bridge-line bg-[#12151b]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgb(230 228 223 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(230 228 223 / 0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {stage.id !== "1" ? (
        <div
          aria-hidden="true"
          className="absolute left-[8%] top-[18%] h-[64%] w-[54%] rounded-[40%] border border-orange/35 bg-orange/10"
        />
      ) : null}
      {stage.id === "90" ? (
        <div
          aria-hidden="true"
          className="absolute right-[10%] top-[22%] h-[38%] w-[32%] rounded-[40%] border border-dashed border-orange/40 bg-orange/5"
        />
      ) : null}

      <div className="absolute left-1/2 top-1/2 z-[1] w-[7.5rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-bridge-line bg-[var(--panel)] px-3 py-2 text-center shadow-[0_8px_24px_rgb(0_0_0/0.28)]">
        <span className="mx-auto mb-1 block h-2 w-2 rounded-full bg-orange" />
        <span className="block font-body text-xs font-medium text-bridge-text">{objectLabel}</span>
      </div>

      {stage.contacts.map((contact, index) => (
        <span
          key={`${contact.x}-${contact.y}-${index}`}
          className={cn(
            "absolute z-[2] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_0_3px_rgb(20_24_30/0.7)]",
            KIND_CLASS[contact.kind],
            contact.kind === "anomaly" && "h-3.5 w-3.5",
          )}
          style={{ left: `${contact.x}%`, top: `${contact.y}%` }}
          title={contact.kind}
        />
      ))}

      <p className="absolute bottom-2 start-3 z-[1] font-body text-[10px] uppercase tracking-wide text-bridge-dim">
        {knownLabel}
      </p>
    </div>
  );
}
