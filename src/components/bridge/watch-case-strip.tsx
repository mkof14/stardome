"use client";

export function WatchCaseStrip({
  kicker,
  name,
  meta,
}: {
  kicker: string;
  name: string;
  meta: string;
}) {
  return (
    <div
      data-testid="picture-scenario-banner"
      className="rounded-2xl border border-orange/35 bg-bridge-panel px-4 py-3 shadow-[inset_3px_0_0_#F15A00]"
    >
      <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-orange">
        {kicker}
      </p>
      <p className="mt-1 font-body text-xl font-semibold tracking-tight text-bridge-text">
        {name}
      </p>
      <p className="mt-0.5 font-body text-sm text-bridge-dim">{meta}</p>
    </div>
  );
}
