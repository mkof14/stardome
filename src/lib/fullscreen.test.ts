import { afterEach, describe, expect, it, vi } from "vitest";
import { exitFullscreen, fullscreenTarget, restoreWindowedPage } from "@/lib/fullscreen";

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

  it("leaves the browser fullscreen page and restores roomy density", async () => {
    const exit = vi.fn(async () => undefined);
    (globalThis as { document?: unknown }).document = {
      fullscreenElement: { tag: "html" },
      exitFullscreen: exit,
    };
    const setDensity = vi.fn();
    await restoreWindowedPage(setDensity);
    expect(setDensity).toHaveBeenCalledWith("roomy");
    expect(exit).toHaveBeenCalledTimes(1);
    await exitFullscreen();
    expect(exit).toHaveBeenCalledTimes(2);
  });
});
