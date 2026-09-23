import { describe, expect, it } from "vitest";
import { starlinkIdForBearer, starlinkLinks } from "@/lib/starlink";
import { WATCH_KIT, kitReading, kitStatus } from "@/lib/watch-kit";
import { plantSections } from "@/lib/plant-metrics";
import { WATCH_CIRCUITS } from "@/lib/watch-comms";
import { ENDPOINTS } from "@/lib/connections";

const ctx = { live: false, scenarioId: "", faultId: null };

describe("Starlink services", () => {
  it("monitors Maritime and Priority as two distinct paths", () => {
    const links = starlinkLinks(ctx);
    expect(links).toHaveLength(2);
    expect(links.map((link) => link.id)).toEqual(["maritime", "priority"]);
    expect(links.every((link) => link.state === "lock")).toBe(true);
    expect(links[0]?.name).toMatch(/Maritime/);
    expect(links[1]?.name).toMatch(/Priority/);
    expect(links[0]?.downMbps).not.toBe(links[1]?.downMbps);
  });

  it("goes dark in LIVE and degrades Maritime under jamming", () => {
    const live = starlinkLinks({ ...ctx, live: true });
    expect(live.every((link) => link.state === "dark")).toBe(true);
    const jammed = starlinkLinks({ ...ctx, scenarioId: "comms-jamming" });
    expect(jammed[0]?.state).toBe("obstructed");
    expect(jammed[1]?.state).toBe("search");
  });

  it("shows both Starlink rows on the watch kit and plant comms", () => {
    const kit = WATCH_KIT.filter((item) => item.id.startsWith("starlink-"));
    expect(kit).toHaveLength(2);
    expect(kitStatus(kit[0]!, { ...ctx, panelType: "radar" })).toBe("watching");
    expect(kitReading(kit[0]!, { ...ctx, panelType: "radar" })).toMatch(/184/);
    const comms = plantSections({
      ...ctx,
      panelType: "radar",
      blackBoxCount: 0,
    }).find((section) => section.id === "comms")!;
    expect(comms.rows.filter((row) => row.id.startsWith("starlink-"))).toHaveLength(2);
  });

  it("exposes Starlink on the watch net and the connections map", () => {
    expect(WATCH_CIRCUITS.some((row) => row.bearer === "starlinkMaritime")).toBe(true);
    expect(WATCH_CIRCUITS.some((row) => row.bearer === "starlinkPriority")).toBe(true);
    expect(starlinkIdForBearer("starlinkMaritime")).toBe("maritime");
    expect(starlinkIdForBearer("starlinkPriority")).toBe("priority");
    expect(ENDPOINTS.some((item) => item.id === "starlink-maritime")).toBe(true);
    expect(ENDPOINTS.some((item) => item.id === "starlink-priority")).toBe(true);
  });
});
