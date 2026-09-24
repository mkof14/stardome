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
    <div data-testid="picture-scenario-banner" className="px-0.5 py-1">
      <p className="font-body text-xs font-medium uppercase tracking-[0.18em] text-bridge-dim">
        {kicker}
      </p>
      <p className="mt-1 font-body text-xl font-semibold tracking-tight text-bridge-text">
        {name}
      </p>
      <p className="mt-0.5 font-body text-sm text-bridge-dim">{meta}</p>
    </div>
  );
}
