import { describe, expect, it } from "vitest";
import { isHaltOrder, isListenOrder, pilotOrder } from "@/lib/pilot-orders";

describe("pilot orders", () => {
  it("halts on stop in every StarWall language", () => {
    for (const said of [
      "стоп",
      "Стоп!",
      "остановись",
      "остановись пожалуйста",
      "тишина",
      "молчи",
      "хватит",
      "зупинись",
      "stop",
      "Stop.",
      "enough",
      "quiet",
      "basta",
      "arrête",
      "stopp",
      "停止",
      "ストップ",
      "עצור",
      "توقف",
    ]) {
      expect(pilotOrder(said)).toBe("halt");
    }
  });

  it("does not treat a watch ask as a halt", () => {
    for (const said of [
      "Pilot, instruments",
      "Pilot, what do you recommend",
      "Pilot, известить назначенного",
      "Hold standard watch",
      "Что на приборах",
      "Какие тарифы у StarWall",
      "wait",
      "still",
      "para",
      "Hold the picture",
    ]) {
      expect(isHaltOrder(said)).toBe(false);
      expect(pilotOrder(said)).toBe("ask");
    }
  });

  it("keeps listen as listen, not a chat turn", () => {
    expect(isListenOrder("слушай")).toBe(true);
    expect(pilotOrder("listen please")).toBe("listen");
    expect(pilotOrder("Pilot, listen to the radar")).toBe("ask");
  });
});
