import { describe, expect, it } from "vitest";
import {
  isConverseOffer,
  isGreeting,
  isHaltOrder,
  isHearCheck,
  isListenOrder,
  heardTopic,
  isOfficerAsk,
  isSpeakNow,
  isTalkOpen,
  pilotOrder,
  wantsVoice,
} from "@/lib/pilot-orders";

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

  it("halts when any short order contains stop", () => {
    expect(isHaltOrder("пилот стоп")).toBe(true);
    expect(isHaltOrder("заткнись")).toBe(true);
    expect(isHaltOrder("stop talking now")).toBe(true);
  });

  it("keeps listen as listen, not a chat turn", () => {
    expect(isListenOrder("слушай")).toBe(true);
    expect(pilotOrder("listen please")).toBe("listen");
    expect(pilotOrder("Pilot, listen to the radar")).toBe("ask");
  });

  it("treats a real question as an ask that can cut speech", () => {
    expect(isOfficerAsk("Ты меня слышишь?")).toBe(true);
    expect(isOfficerAsk("Can you hear me")).toBe(true);
    expect(isOfficerAsk("Pilot, instruments")).toBe(true);
    expect(isOfficerAsk("стоп")).toBe(false);
    expect(isOfficerAsk("слушай")).toBe(false);
    expect(isOfficerAsk("да")).toBe(false);
    expect(isOfficerAsk("ok")).toBe(false);
    expect(isHearCheck("Ты меня слышишь?")).toBe(true);
    expect(isHearCheck("Can you hear me")).toBe(true);
    expect(isHearCheck("Pilot, instruments")).toBe(false);
  });

  it("treats talk-to-me as a converse order, not a watch dump", () => {
    for (const said of [
      "говори со мной",
      "Pilot, говори со мной",
      "Talk to me",
      "speak with me",
      "let's talk",
      "слушай меня",
      "привет",
      "hello",
    ]) {
      expect(isTalkOpen(said)).toBe(true);
      expect(isHaltOrder(said)).toBe(false);
    }
    expect(isConverseOffer("говори со мной")).toBe(true);
    expect(isConverseOffer("Pilot, instruments")).toBe(false);
    expect(isGreeting("привет")).toBe(true);
    expect(isGreeting("What should I do?")).toBe(false);
    expect(isOfficerAsk("говори")).toBe(true);
    expect(isTalkOpen("на какое расстояние меряет радар")).toBe(false);
    expect(isTalkOpen("говори со мной какая дальность радара")).toBe(false);
  });

  it("treats answer-me as speak-now, not a leftover radar question", () => {
    for (const said of [
      "отвечай мне",
      "Pilot, отвечай мне",
      "отвечай голосом",
      "ответь голосом",
      "говори голосом",
      "answer me",
      "answer with voice",
      "speak out loud",
    ]) {
      expect(isSpeakNow(said)).toBe(true);
      expect(wantsVoice(said)).toBe(true);
      expect(isTalkOpen(said)).toBe(false);
      expect(isHaltOrder(said)).toBe(false);
      expect(isOfficerAsk(said)).toBe(true);
    }
    expect(isSpeakNow("говори со мной")).toBe(false);
    expect(isSpeakNow("Talk to me")).toBe(false);
    expect(isSpeakNow("на какое расстояние меряет радар")).toBe(false);
    expect(isSpeakNow("отвечай какая дальность радара")).toBe(false);
    expect(wantsVoice("отвечай какая дальность радара")).toBe(true);
    expect(isSpeakNow("answer me how far the radar measures")).toBe(false);
    expect(wantsVoice("answer me how far the radar measures")).toBe(true);
    expect(isTalkOpen("отвечай мне")).toBe(false);
  });

  it("hears a leftover topic and short radar asks", () => {
    expect(heardTopic("говори со мной какая дальность радара")).toMatch(/дальность/);
    expect(heardTopic("Pilot, расскажи про радар")).toMatch(/радар/);
    expect(heardTopic("говори со мной")).toBe("");
    expect(isOfficerAsk("радар?")).toBe(true);
    expect(isOfficerAsk("какая дальность")).toBe(true);
    expect(isTalkOpen("говори со мной какая дальность радара")).toBe(false);
  });
});
