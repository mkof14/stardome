import { describe, expect, it } from "vitest";
import {
  BARGE_GRACE_MS,
  isEchoOfSpoken,
  maySpeak,
  shouldCutIn,
  vadHotFrames,
  vadTriggered,
  heardWhilePilotTalks,
  ECHO_COOLDOWN_MS,
} from "@/lib/barge-in";

describe("barge-in", () => {
  it("treats playback echo as Pilot, not the officer", () => {
    const spoken =
      "Pilot on watch. Radar, AIS, cameras, perimeter, sonar, satcom — all on me.";
    expect(isEchoOfSpoken("radar AIS cameras", spoken)).toBe(true);
    expect(isEchoOfSpoken("Pilot on watch", spoken)).toBe(true);
    expect(isEchoOfSpoken("Pilot, instruments", spoken)).toBe(false);
    expect(isEchoOfSpoken("stop", spoken)).toBe(false);
    expect(isEchoOfSpoken("  ", spoken)).toBe(true);
  });

  it("waits out the grace window then takes the officer first", () => {
    const spoken = "Hold standard watch.";
    expect(shouldCutIn("Pilot, instruments", spoken, 0, BARGE_GRACE_MS - 10)).toBe(
      false,
    );
    expect(shouldCutIn("Pilot, instruments", spoken, 0, BARGE_GRACE_MS + 20)).toBe(
      true,
    );
    expect(shouldCutIn("Hold standard", spoken, 0, 4000)).toBe(false);
    expect(shouldCutIn("стоп", spoken, 0, BARGE_GRACE_MS + 20)).toBe(true);
  });

  it("trips voice-activity after sustained real mic energy", () => {
    let hot = 0;
    for (let i = 0; i < 9; i += 1) hot = vadHotFrames(0.2, hot);
    expect(vadTriggered(hot)).toBe(false);
    hot = vadHotFrames(0.2, hot);
    expect(vadTriggered(hot)).toBe(true);
    expect(heardWhilePilotTalks(true, 0, 10_000)).toBe(true);
    expect(heardWhilePilotTalks(false, 0, ECHO_COOLDOWN_MS - 10)).toBe(true);
    expect(heardWhilePilotTalks(false, 0, ECHO_COOLDOWN_MS + 20)).toBe(false);
    hot = vadHotFrames(0.01, hot);
    expect(hot).toBeLessThan(10);
  });

  it("keeps Pilot silent after Stop unless the officer asks again", () => {
    expect(maySpeak(true)).toBe(false);
    expect(maySpeak(true, true)).toBe(true);
    expect(maySpeak(false)).toBe(true);
  });
});
