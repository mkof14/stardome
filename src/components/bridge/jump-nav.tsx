"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useAuthSession } from "@/lib/auth-session";
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
  icon: ReactNode;
};

const ICON = "h-4 w-4";

const ITEMS: JumpItem[] = [
  {
    id: "picture",
    kind: "scroll",
    targetId: "situational-picture",
    icon: <HudGlyph name="picture" className={ICON} />,
  },
  {
    id: "risk",
    kind: "scroll",
    targetId: "risk-level-panel",
    hideInCrisis: true,
    icon: <HudGlyph name="risk" className={ICON} />,
  },
  {
    id: "systems",
    kind: "scroll",
    targetId: "connected-systems-panel",
    hideInCrisis: true,
    icon: <HudGlyph name="systems" className={ICON} />,
  },
  {
    id: "action",
    kind: "scroll",
    targetId: "recommended-action-panel",
    hideInCrisis: true,
    icon: <HudGlyph name="action" className={ICON} />,
  },
  {
    id: "library",
    kind: "scroll",
    targetId: "scenario-library",
    hideInCrisis: true,
    icon: <HudGlyph name="library" className={ICON} />,
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
        return true;
      }),
    [crisis, helmAllowed],
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
      if (detail?.open) setActive("helm");
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
      className={cn(
        "fixed bottom-0 left-0 top-16 z-30 flex flex-col border-r border-bridge-line bg-bridge-panel/95 text-bridge-text backdrop-blur-md",
        expanded ? "w-56" : "w-[4.85rem]",
      )}
    >
      <div className="flex h-12 items-center justify-between border-b border-bridge-line px-2">
        {expanded ? (
          <p className="px-1 font-body text-xs font-medium text-bridge-dim">{hud.jump.kicker}</p>
        ) : (
          <span className="sr-only">{hud.jump.sections}</span>
        )}
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

      <nav aria-label={hud.jump.sections} className="flex-1 overflow-y-auto py-1">
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
                <span
                  className={cn(
                    "font-body font-medium",
                    expanded
                      ? "min-w-0 flex-1 truncate text-left text-sm"
                      : "mt-1 line-clamp-2 w-full text-center text-[10px] leading-tight",
                  )}
                >
                  {label}
                </span>
                {expanded && key ? (
                  <span className="font-body text-[11px] text-bridge-dim">{key}</span>
                ) : null}
              </>
            );
            const className = cn(
              "relative flex w-full rounded-xl",
              expanded ? "flex-row items-center gap-2 px-2 py-1.5" : "flex-col items-center px-1 py-2",
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
