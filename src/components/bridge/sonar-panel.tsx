import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";
import {
  SCOPE,
  motionTowardOwnShip,
  sonarScene,
  toneColor,
  trackHue,
} from "@/lib/picture-scenes";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";
const { size: SZ, cx: CX, cy: CY, ring: RING } = SCOPE;
const DEPTH_RINGS = [
  { frac: 1 / 3, label: "0–20 m" },
  { frac: 2 / 3, label: "20–50 m" },
  { frac: 1, label: "50 m+" },
] as const;

export function SonarView({
  scenarioId = "",
  selectedId,
  focusIds = [],
  onSelect,
}: {
  scenarioId?: string;
  selectedId?: string | null;
  focusIds?: string[];
  onSelect?: (id: string) => void;
}) {
  const scene = sonarScene(scenarioId);

  return (
    <div
      className="instrument-sonar relative overflow-hidden"
      data-testid="picture-scene"
      data-scene={scenarioId || "watch"}
    >
      <div className="flex items-center justify-between border-b border-[#0E4A55] bg-[#031418] px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-[#6DE4F2]">
        <span>HF SONAR · 200 kHz</span>
        <span>PASSIVE / ACTIVE · DEPTH SCALE</span>
      </div>
      <svg viewBox={`0 0 ${SZ} ${SZ}`} className="h-auto w-full" data-testid="sonar-ppi">
        <rect width={SZ} height={SZ} fill="#02161C" />
        <circle cx={CX} cy={CY} r={RING + 28} fill="none" stroke="#083038" strokeWidth="18" />
        {DEPTH_RINGS.map((item) => {
          const r = RING * item.frac;
          return (
            <g key={item.label}>
              <circle
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke={item.frac === 1 ? "#1A6A78" : "#0A3A44"}
                strokeWidth={item.frac === 1 ? 1.6 : 1}
              />
              <text x={CX + 10} y={CY - r + 5} fontFamily={MONO} fontSize="13" fill="#3C8A98">
                {item.label}
              </text>
            </g>
          );
        })}
        {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const inner = RING - (deg % 30 === 0 ? 16 : 8);
          return (
            <line
              key={deg}
              x1={CX + inner * Math.cos(rad)}
              y1={CY + inner * Math.sin(rad)}
              x2={CX + RING * Math.cos(rad)}
              y2={CY + RING * Math.sin(rad)}
              stroke="#0E4A55"
              strokeWidth={deg % 30 === 0 ? 1.6 : 1}
            />
          );
        })}
        <circle
          className="sonar-ping-ring"
          cx={CX}
          cy={CY}
          r={RING}
          fill="none"
          stroke="#2DD4E8"
          strokeWidth="1.6"
        />
        <circle cx={CX} cy={CY} r="4" fill="#2DD4E8" />
        <circle cx={CX} cy={CY} r="10" fill="none" stroke="#2DD4E8" strokeWidth="1.2" />
        <text
          x={CX}
          y={SZ - 22}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="13"
          fill="#7C8894"
        >
          {scene.note}
        </text>
        {scene.contacts.map((contact) => {
          const shift = motionTowardOwnShip(
            contact.x,
            contact.y,
            contact.motion === "inbound" ? 28 : 12,
          );
          const color = trackHue(contact);
          const alarm = toneColor(contact.tone);
          const active = contact.id === selectedId;
          const bound = focusIds.includes(contact.id);
          const dimmed = focusIds.length > 0 && !bound;
          return (
            <g
              key={contact.id}
              transform={`translate(${contact.x} ${contact.y})`}
              style={{ cursor: "pointer" }}
              data-layer-focus={bound ? "true" : undefined}
              className={cn(dimmed && "radar-contact-dim")}
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.(contact.id);
              }}
            >
              {bound ? (
                <circle r="22" fill="none" stroke="#F15A00" strokeWidth="1.6" className="radar-layer-ring" />
              ) : null}
              {active ? (
                <circle r="20" fill="none" stroke={color} strokeWidth="1.2" />
              ) : null}
              <g
                className={cn(
                  contact.motion === "inbound" && "contact-inbound",
                  contact.motion === "close" && "contact-close",
                  contact.motion === "hold" && "contact-hold",
                )}
                style={{
                  ["--mx" as string]: `${shift.mx}px`,
                  ["--my" as string]: `${shift.my}px`,
                }}
              >
                <circle className="hud-contact-pulse" r="16" fill="none" stroke={alarm} />
                <circle r="5" fill="none" stroke={color} strokeWidth="1.4" />
                <circle r="3.5" fill={color} />
                <text x="10" y="4" fontFamily={MONO} fontSize="12" fill={color}>
                  {contact.trackNo ? `${contact.trackNo} ` : ""}
                  {contact.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SonarPanel() {
  return (
    <HudPanel
      testId="sonar-panel"
      title="UNDERWATER PICTURE"
      glyph="sonar"
      extra={
        <span className="font-mono text-[10px] text-bridge-dim">
          RANGE 1.0 NM · SONAR ACTIVE
        </span>
      }
    >
      <SonarView />
    </HudPanel>
  );
}
