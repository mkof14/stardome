import { afterEach, describe, expect, it } from "vitest";
import { fullscreenTarget } from "@/lib/fullscreen";

describe("fullscreen target", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "document");
  });

  it("uses the document so the top header stays with Exit", () => {
    const html = { tag: "html" };
    const hud = { id: "bridge-root" };
    (globalThis as { document?: unknown }).document = {
      documentElement: html,
      getElementById: (id: string) => (id === "bridge-root" ? hud : null),
    };
    expect(fullscreenTarget()).toBe(html);
    expect(fullscreenTarget()).not.toBe(hud);
  });
});
