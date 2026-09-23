"use client";

import { useId, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import {
  SCOPE,
  motionTowardOwnShip,
  radarScene,
  toneColor,
  trackHue,
  type ContactMotion,
  type PictureContact,
} from "@/lib/picture-scenes";

type Tooltip = {
  x: number;
  y: number;
  name: string;
  type: string;
  dist: string;
  extra?: string;
};

type BridgeRadarProps = {
  scenarioId?: string;
  degraded?: "radar" | "ais" | null;
  empty?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

const { size: SZ, cx: CX, cy: CY, ring: RING, maxNm: MAX_NM } = SCOPE;
const RANGE_RINGS = [1, 2, 3, 4, 5, 6] as const;
const BEARING_TICKS = Array.from({ length: 72 }, (_, index) => index * 5);
const CARDINALS: Array<{ deg: number; label: string; major: boolean }> = [
  { deg: 0, label: "N", major: true },
  { deg: 45, label: "NE", major: false },
  { deg: 90, label: "E", major: true },
  { deg: 135, label: "SE", major: false },
  { deg: 180, label: "S", major: true },
  { deg: 225, label: "SW", major: false },
  { deg: 270, label: "W", major: true },
  { deg: 315, label: "NW", major: false },
];

function polarPoint(deg: number, radius: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function motionClass(motion?: ContactMotion) {
  if (motion === "close") return "contact-close";
  if (motion === "inbound") return "contact-inbound";
  if (motion === "orbit") return "contact-orbit";
  if (motion === "hold") return "contact-hold";
  return undefined;
}

function ContactMark({ contact }: { contact: PictureContact }) {
  const color = trackHue(contact);
  const alarm = toneColor(contact.tone);
  const pulse = contact.tone === "ok" ? color : alarm;
  const shape = contact.shape ?? "vessel";
  if (shape === "uav") {
    return (
      <g fill="none" stroke={pulse} strokeWidth="1.3">
        <circle className="hud-contact-pulse" r="14" />
        <path d="M0,-7 L6,0 L0,7 L-6,0 Z" fill={color} stroke="none" />
        <g className="uav-rotor">
          <path d="M-10,0 H10 M0,-10 V10" />
        </g>
      </g>
    );
  }
  if (shape === "usv") {
    return (
      <g fill="none" stroke={pulse} strokeWidth="1.3">
        <circle className="hud-contact-pulse" r="13" />
        <path d="M-8,4 L-5,-5 H5 L8,4 Z" fill={color} fillOpacity="0.85" />
      </g>
    );
  }
  if (shape === "mob") {
    return (
      <g fill="none" stroke={pulse} strokeWidth="1.5">
        <circle className="hud-contact-pulse" r="16" />
        <circle r="5" fill={color} stroke="none" />
        <path d="M-7,8 L0,2 L7,8" />
      </g>
    );
  }
  return (
    <g>
      {contact.tone !== "ok" ? (
        <circle className="hud-contact-pulse" r="14" fill="none" stroke={pulse} strokeWidth="1.2" />
      ) : null}
      <circle r="5" fill="none" stroke={color} strokeWidth="1.4" />
      <circle r="3.5" fill={color} />
    </g>
  );
}

export function BridgeRadar({
  scenarioId = "",
  degraded,
  empty,
  selectedId,
  onSelect,
}: BridgeRadarProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const scene = radarScene(scenarioId);
  const uid = useId().replace(/:/g, "");
  const selected = scene.contacts.find((item) => item.id === selectedId);

  function onContactEnter(
    event: MouseEvent<SVGGElement>,
    contact: PictureContact,
  ) {
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      name: contact.name,
      type: contact.object ?? contact.type,
      dist: contact.dist,
      extra: [contact.threat, contact.size, contact.tempC != null ? `${contact.tempC}°C` : ""]
        .filter(Boolean)
        .join(" · "),
    });
  }

  function onContactMove(event: MouseEvent<SVGGElement>) {
    setTooltip((current) =>
      current ? { ...current, x: event.clientX, y: event.clientY } : current,
    );
  }

  return (
    <div
      className="instrument-radar relative overflow-hidden"
      data-testid="picture-scene"
      data-scene={scenarioId || "watch"}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#13432C] bg-[#07150E] px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-[#7DCF9A]">
        <span>S-BAND ARPA · RDR-6</span>
        <span className="hidden truncate sm:inline">{scene.extra}</span>
        <span>GAIN 72 · SEA 18 · RAIN 0 · TRAILS 6M</span>
      </div>
      <svg viewBox={`0 0 ${SZ} ${SZ}`} className="h-auto w-full" data-testid="radar-ppi">
        <defs>
          <linearGradient id={`sweepGrad-${uid}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#2EE59A" stopOpacity="0" />
            <stop offset="100%" stopColor="#2EE59A" stopOpacity="0.32" />
          </linearGradient>
          <radialGradient id={`scopeGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0C321C" />
            <stop offset="72%" stopColor="#052014" />
            <stop offset="100%" stopColor="#03140C" />
          </radialGradient>
        </defs>
        <rect width={SZ} height={SZ} fill={`url(#scopeGlow-${uid})`} />
        <circle cx={CX} cy={CY} r={RING + 36} fill="none" stroke="#0F3A24" strokeWidth="22" />
        <circle cx={CX} cy={CY} r={RING + 24} fill="none" stroke="#1A5C3A" strokeWidth="1.2" />
        {RANGE_RINGS.map((nm) => {
          const r = (nm / MAX_NM) * RING;
          return (
            <g key={nm}>
              <circle
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke={nm === MAX_NM ? "#2A7A4C" : "#164E32"}
                strokeWidth={nm === MAX_NM ? 1.6 : nm % 2 === 0 ? 1.1 : 0.7}
                strokeDasharray={nm % 2 === 0 ? undefined : "2 5"}
              />
              <text
                x={CX + 8}
                y={CY - r + 4}
                fontFamily="monospace"
                fontSize="13"
                fill="#4C8A64"
              >
                {nm} NM
              </text>
            </g>
          );
        })}
        <line x1={CX - RING} y1={CY} x2={CX + RING} y2={CY} stroke="#164E32" strokeWidth="0.7" />
        <line x1={CX} y1={CY - RING} x2={CX} y2={CY + RING} stroke="#164E32" strokeWidth="0.7" />
        {BEARING_TICKS.map((deg) => {
          const major = deg % 30 === 0;
          const ten = deg % 10 === 0;
          const inner = RING - (major ? 18 : ten ? 12 : 7);
          const a = polarPoint(deg, inner);
          const b = polarPoint(deg, RING);
          return (
            <line
              key={deg}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={major ? "#3E8A58" : "#1A5C3A"}
              strokeWidth={major ? 1.8 : ten ? 1.2 : 0.8}
            />
          );
        })}
        {BEARING_TICKS.filter((deg) => deg % 10 === 0).map((deg) => {
          const p = polarPoint(deg, RING + 20);
          return (
            <text
              key={`brg-${deg}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="monospace"
              fontSize={deg % 30 === 0 ? 13 : 10}
              fill={deg % 30 === 0 ? "#7DCF9A" : "#3E7A58"}
            >
              {String(deg).padStart(3, "0")}
            </text>
          );
        })}
        {CARDINALS.map((item) => {
          const p = polarPoint(item.deg, RING + 40);
          return (
            <text
              key={item.label}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="monospace"
              fontSize={item.major ? 18 : 12}
              fontWeight={item.major ? "bold" : "normal"}
              fill={item.major ? "#7DCF9A" : "#4C8A64"}
            >
              {item.label}
            </text>
          );
        })}
        <line
          x1={CX}
          y1={CY}
          x2={polarPoint(22, RING).x}
          y2={polarPoint(22, RING).y}
          stroke="#2A6A48"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        {degraded === "radar" || empty ? null : (
          <g className="bridge-sweep">
            <path
              d={`M${CX},${CY} L${CX},${CY - RING} A${RING},${RING} 0 0,1 ${polarPoint(42, RING).x},${polarPoint(42, RING).y} Z`}
              fill={`url(#sweepGrad-${uid})`}
            />
          </g>
        )}
        <g transform={`translate(${CX},${CY})`}>
          <circle r="16" fill="none" stroke="#7DCF9A" strokeWidth="1" />
          <circle r="4" fill="#E7ECEF" />
          <path d="M0,-20 L7,12 L0,6 L-7,12 Z" fill="#E7ECEF" />
          {empty ? null : (
            <text x="18" y="28" fontFamily="monospace" fontSize="12" fill="#7DCF9A">
              {scene.heading}
            </text>
          )}
        </g>
        {selected && !empty ? (
          <g pointerEvents="none">
            <line
              x1={CX}
              y1={CY}
              x2={selected.x}
              y2={selected.y}
              stroke={trackHue(selected)}
              strokeWidth="1.2"
              strokeDasharray="3 4"
              opacity="0.75"
            />
            <circle
              cx={selected.x}
              cy={selected.y}
              r="26"
              fill="none"
              stroke={trackHue(selected)}
              strokeWidth="1.4"
            />
          </g>
        ) : null}
        {empty
          ? null
          : scene.contacts.map((contact) => {
              const shift = motionTowardOwnShip(
                contact.x,
                contact.y,
                contact.motion === "inbound" ? 36 : 18,
              );
              const active = contact.id === selectedId;
              return (
                <g
                  key={contact.id}
                  transform={`translate(${contact.x} ${contact.y})`}
                  style={{ cursor: "pointer" }}
                  data-testid={`radar-contact-${contact.id}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect?.(contact.id);
                  }}
                  onMouseEnter={(event) => onContactEnter(event, contact)}
                  onMouseMove={onContactMove}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <g
                    className={cn(motionClass(contact.motion))}
                    style={{
                      ["--mx" as string]: `${shift.mx}px`,
                      ["--my" as string]: `${shift.my}px`,
                    }}
                  >
                    <circle r="18" fill="transparent" />
                    <ContactMark contact={contact} />
                    <text
                      x="12"
                      y="4"
                      fontFamily="monospace"
                      fontSize="12"
                      fontWeight={active ? "bold" : "normal"}
                      fill={trackHue(contact)}
                    >
                      {contact.trackNo ? `${contact.trackNo} ` : ""}
                      {contact.label}
                    </text>
                    {active && contact.rangeText ? (
                      <text x="12" y="16" fontFamily="monospace" fontSize="10" fill="#9ec9ae">
                        {contact.rangeText}
                        {contact.object ? ` · ${contact.object}` : ""}
                      </text>
                    ) : null}
                  </g>
                </g>
              );
            })}
      </svg>
      {tooltip && typeof document !== "undefined"
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[80] border border-bridge-line bg-bridge-panel px-2 py-1.5 font-mono text-[10px] text-bridge-text shadow-lg"
              style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
            >
              <p className="text-bridge-text">{tooltip.name}</p>
              <p className="text-bridge-dim">{tooltip.type}</p>
              <p className="text-bridge-dim">{tooltip.dist}</p>
              {tooltip.extra ? <p className="text-bridge-dim">{tooltip.extra}</p> : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
