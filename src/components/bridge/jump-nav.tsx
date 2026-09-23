"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useAuthSession } from "@/lib/auth-session";
import { useAgronView, type AgronView } from "@/lib/agron-view";
import { useCrisisMode } from "@/lib/crisis-mode";
import { HELM_STATE_EVENT, focusWatchComms, openHelm, startPilotDemo } from "@/lib/helm-events";
import { useHud } from "@/lib/i18n/use-hud";
import { canUseHelm } from "@/lib/rbac";
import { HudGlyph } from "@/components/bridge/hud-icons";
import type { WatchParty } from "@/lib/watch-comms";

type JumpKind = "scroll" | "helm" | "link" | "demo";

type JumpItem = {
  id: keyof import("@/lib/i18n/hud").HudCopy["jump"];
  kind: JumpKind;
  href?: string;
  targetId?: string;
  party?: WatchParty;
  crisisOnly?: boolean;
  hideInCrisis?: boolean;
  views?: AgronView[];
  icon: ReactNode;
};

const ICON = "h-4 w-4";

const ITEMS: JumpItem[] = [
  {
    id: "picture",
    kind: "scroll",
    targetId: "situational-picture",
    views: ["watch"],
    icon: <HudGlyph name="picture" className={ICON} />,
  },
  {
    id: "risk",
    kind: "scroll",
    targetId: "risk-level-panel",
    hideInCrisis: true,
    views: ["watch"],
    icon: <HudGlyph name="risk" className={ICON} />,
  },
  {
    id: "systems",
    kind: "scroll",
    targetId: "connected-systems-panel",
    hideInCrisis: true,
    views: ["watch"],
    icon: <HudGlyph name="systems" className={ICON} />,
  },
  {
    id: "action",
    kind: "scroll",
    targetId: "recommended-action-panel",
    hideInCrisis: true,
    views: ["watch"],
    icon: <HudGlyph name="action" className={ICON} />,
  },
  {
    id: "library",
    kind: "scroll",
    targetId: "scenario-library",
    hideInCrisis: true,
    views: ["watch"],
    icon: <HudGlyph name="library" className={ICON} />,
  },
  {
    id: "plant",
    kind: "scroll",
    targetId: "plant-container-panel",
    views: ["plant"],
    icon: <HudGlyph name="shield" className={ICON} />,
  },
  {
    id: "power",
    kind: "scroll",
    targetId: "plant-power-panel",
    views: ["plant"],
    icon: <HudGlyph name="power" className={ICON} />,
  },
  {
    id: "cooling",
    kind: "scroll",
    targetId: "plant-cooling-panel",
    views: ["plant"],
    icon: <HudGlyph name="sun" className={ICON} />,
  },
  {
    id: "compute",
    kind: "scroll",
    targetId: "plant-compute-panel",
    views: ["plant"],
    icon: <HudGlyph name="settings" className={ICON} />,
  },
  {
    id: "storage",
    kind: "scroll",
    targetId: "plant-storage-panel",
    views: ["plant"],
    icon: <HudGlyph name="drive" className={ICON} />,
  },
  {
    id: "crisis",
    kind: "scroll",
    targetId: "crisis-protocol-panel",
    crisisOnly: true,
    icon: <HudGlyph name="crisis" className={ICON} />,
  },
  {
    id: "log",
    kind: "scroll",
    targetId: "event-log-panel",
    icon: <HudGlyph name="log" className={ICON} />,
  },
  {
    id: "blackbox",
    kind: "scroll",
    targetId: "black-box-panel",
    icon: <HudGlyph name="drive" className={ICON} />,
  },
  {
    id: "helm",
    kind: "helm",
    icon: <HudGlyph name="talk" className={ICON} />,
  },
  {
    id: "demo",
    kind: "demo",
    icon: <HudGlyph name="demo" className={ICON} />,
  },
  {
    id: "comms",
    kind: "scroll",
    targetId: "watch-comms-panel",
    icon: <HudGlyph name="comms" className={ICON} />,
  },
  {
    id: "captain",
    kind: "scroll",
    targetId: "watch-comms-panel",
    party: "captain",
    icon: <HudGlyph name="captain" className={ICON} />,
  },
  {
    id: "designated",
    kind: "scroll",
    targetId: "watch-comms-panel",
    party: "designated",
    icon: <HudGlyph name="person" className={ICON} />,
  },
  {
    id: "supportTeam",
    kind: "scroll",
    targetId: "watch-comms-panel",
    party: "support",
    icon: <HudGlyph name="support" className={ICON} />,
  },
  {
    id: "learning",
    kind: "scroll",
    targetId: "adaptive-learning-panel",
    hideInCrisis: true,
    icon: <HudGlyph name="learn" className={ICON} />,
  },
  {
    id: "map",
    kind: "link",
    href: "/interface/connections",
    icon: <HudGlyph name="map" className={ICON} />,
  },
];

function typingInField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function JumpNav() {
  const { hud } = useHud();
  const { crisis } = useCrisisMode();
  const { view } = useAgronView();
  const { session } = useAuthSession();
  const helmAllowed = !session || canUseHelm(session.role);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState("picture");
  const expanded = pinned || hovered;
  const lockUntil = useRef(0);

  const visible = useMemo(
    () =>
      ITEMS.filter((item) => {
        if (item.crisisOnly && !crisis) return false;
        if (item.hideInCrisis && crisis) return false;
        if (item.kind === "helm" && !helmAllowed) return false;
        if (item.kind === "demo" && !helmAllowed) return false;
        if (item.views && !item.views.includes(view)) return false;
        return true;
      }),
    [crisis, helmAllowed, view],
  );

  const numbered = useMemo(
    () =>
      visible
        .filter((item) => item.kind !== "link")
        .slice(0, 9)
        .map((item, index) => ({ item, key: String(index + 1) })),
    [visible],
  );

  const jump = useCallback((item: JumpItem) => {
    if (item.kind === "link" && item.href) return;
    if (item.kind === "helm") {
      lockUntil.current = Date.now() + 1200;
      openHelm();
      setActive(item.id);
      return;
    }
    if (item.kind === "demo") {
      lockUntil.current = Date.now() + 1200;
      startPilotDemo();
      setActive(item.id);
      return;
    }
    if (item.party) {
      focusWatchComms(item.party);
    } else if (item.id === "comms") {
      focusWatchComms();
    }
    const target = item.targetId ? document.getElementById(item.targetId) : null;
    if (!target) return;
    lockUntil.current = Date.now() + 1200;
    setActive(item.id);
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  useEffect(() => {
    function onHelm(event: Event) {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (detail?.open && Date.now() >= lockUntil.current) setActive("helm");
    }
    window.addEventListener(HELM_STATE_EVENT, onHelm);
    return () => window.removeEventListener(HELM_STATE_EVENT, onHelm);
  }, []);

  useEffect(() => {
    const observed = visible
      .filter((item) => item.kind === "scroll" && item.targetId)
      .map((item) => ({
        item,
        el: document.getElementById(item.targetId ?? ""),
      }))
      .filter((row): row is { item: JumpItem; el: HTMLElement } => Boolean(row.el));

    if (!observed.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntil.current) return;
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const match = observed.find((row) => row.el === hit.target);
        if (match) setActive(match.item.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    observed.forEach((row) => io.observe(row.el));
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (typingInField(event.target)) return;
      const found = numbered.find((row) => row.key === event.key);
      if (!found) return;
      event.preventDefault();
      jump(found.item);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, numbered]);

  return (
    <aside
      data-testid="jump-nav"
      data-expanded={expanded ? "true" : "false"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-0 left-0 top-16 z-30 flex w-[4.85rem] flex-col border-r border-bridge-line bg-bridge-panel/95 text-bridge-text backdrop-blur-md"
    >
      <div className="flex h-12 items-center justify-center border-b border-bridge-line px-2">
        <span className="sr-only">{hud.jump.sections}</span>
        <button
          type="button"
          data-testid="jump-nav-toggle"
          aria-expanded={expanded}
          aria-label={pinned ? hud.jump.unpin : hud.jump.pin}
          onClick={() => setPinned((value) => !value)}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg text-bridge-dim hover:bg-bridge-bg hover:text-orange",
            pinned && "bg-orange/10 text-orange",
          )}
        >
          <HudGlyph name={expanded ? "collapse" : "expand"} className="h-4 w-4" />
        </button>
      </div>

      <nav aria-label={hud.jump.sections} className="flex-1 overflow-y-auto overflow-x-visible py-1">
        <ul>
          {visible.map((item) => {
            const key = numbered.find((row) => row.item.id === item.id)?.key;
            const current = active === item.id;
            const label = hud.jump[item.id];
            const inner = (
              <>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    current ? "bg-orange/15 text-orange" : "bg-bridge-bg text-bridge-text",
                  )}
                >
                  {item.icon}
                </span>
                <span className="mt-1 line-clamp-2 w-full text-center font-body text-[11px] font-medium leading-tight">
                  {label}
                </span>
                {expanded ? (
                  <span className="pointer-events-none absolute start-full top-1/2 z-40 ms-1.5 -translate-y-1/2 whitespace-nowrap rounded-lg border border-bridge-line bg-bridge-panel px-2 py-1 font-body text-sm text-bridge-text shadow-lg">
                    {label}
                    {key ? <span className="ms-2 text-[11px] text-bridge-dim">{key}</span> : null}
                  </span>
                ) : null}
              </>
            );
            const className = cn(
              "relative flex w-full flex-col items-center rounded-xl px-1 py-2",
              current
                ? "bg-orange/10 text-orange"
                : "text-bridge-text hover:bg-bridge-bg hover:text-orange",
            );

            if (item.kind === "link" && item.href) {
              return (
                <li key={item.id} className="px-1">
                  <Link
                    href={item.href}
                    title={label}
                    data-testid={`jump-${item.id}`}
                    className={className}
                  >
                    {inner}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.id} className="px-1">
                <button
                  type="button"
                  title={label}
                  data-testid={`jump-${item.id}`}
                  aria-current={current ? "location" : undefined}
                  data-active={current ? "true" : "false"}
                  onClick={() => jump(item)}
                  className={className}
                >
                  {inner}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
