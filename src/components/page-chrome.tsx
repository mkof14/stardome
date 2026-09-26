import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bridge-bg font-ui text-bridge-text">{children}</div>
  );
}

export function WatchKicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-body text-sm font-semibold uppercase tracking-[0.28em] text-orange">
      {children}
    </p>
  );
}

export function PageHero({
  kicker,
  title,
  lead,
  preface,
  children,
  aside,
}: {
  kicker: string;
  title: string;
  lead?: ReactNode;
  preface?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative">
      <div
        className={cn(
          "mx-auto max-w-6xl px-4 py-10 md:px-6 lg:py-14",
          aside
            ? "grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
            : undefined,
        )}
      >
        <div>
          {preface}
          <WatchKicker>{kicker}</WatchKicker>
          <h1 className="mt-2 max-w-[22ch] font-ui text-4xl font-bold tracking-tight text-bridge-text sm:text-6xl">
            {title}
          </h1>
          {lead ? (
            <div className="mt-4 max-w-2xl font-body text-lg font-semibold leading-snug text-bridge-text">
              {lead}
            </div>
          ) : null}
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
        {aside ? <div className="relative lg:pt-2">{aside}</div> : null}
      </div>
    </section>
  );
}

export function PageBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl space-y-10 px-4 pb-16 md:px-6", className)}>
      {children}
    </div>
  );
}

export function SectionKicker({ children }: { children: ReactNode }) {
  return <WatchKicker>{children}</WatchKicker>;
}

export function SectionTitle({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-2 max-w-[28ch] font-ui text-2xl font-bold tracking-tight text-bridge-text sm:text-3xl"
    >
      {children}
    </h2>
  );
}

export function NumberedGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>{children}</div>
  );
}

export function NumberedItem({
  index,
  title,
  body,
  href,
  meta,
}: {
  index: number;
  title: ReactNode;
  body?: ReactNode;
  href?: string;
  meta?: ReactNode;
}) {
  const inner = (
    <>
      <p className="font-mono text-[11px] text-orange">
        {String(index).padStart(2, "0")}
        {meta ? <span className="ms-3 text-bridge-dim">{meta}</span> : null}
      </p>
      <h3 className="mt-1 font-ui text-xl font-bold tracking-tight text-bridge-text group-hover:text-orange">
        {title}
      </h3>
      {body ? (
        <div className="mt-2 max-w-md font-body text-sm leading-relaxed text-bridge-dim">
          {body}
        </div>
      ) : null}
    </>
  );

  const frame =
    "rounded-2xl border border-bridge-line bg-bridge-panel px-5 py-5 shadow-[0_10px_28px_rgb(15_25_34/0.08)]";

  if (href) {
    return (
      <Link href={href} className={cn("group block", frame)}>
        {inner}
      </Link>
    );
  }

  return <article className={frame}>{inner}</article>;
}

export function RuleList({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-bridge-line overflow-hidden rounded-2xl border border-bridge-line bg-bridge-panel">
      {children}
    </div>
  );
}

export function RuleRow({
  title,
  body,
}: {
  title: ReactNode;
  body: ReactNode;
}) {
  return (
    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8">
      <h3 className="font-ui text-base font-bold text-bridge-text">{title}</h3>
      <div className="font-body text-sm leading-relaxed text-bridge-dim">{body}</div>
    </div>
  );
}

export function OrangeRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-xl space-y-3 border-s-2 border-orange ps-4 font-body text-sm leading-relaxed text-bridge-dim sm:text-[15px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function WatchPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-bridge-line bg-bridge-panel px-5 py-5 shadow-[0_10px_28px_rgb(15_25_34/0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionLead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-4 max-w-2xl font-body text-[1.02rem] leading-relaxed text-bridge-dim",
        className,
      )}
    >
      {children}
    </div>
  );
}

const watchButtonBase =
  "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-body text-sm font-semibold transition";

const watchButtonTone = {
  primary: "border border-orange/40 bg-orange/10 text-orange hover:bg-orange/15",
  ghost:
    "border border-bridge-line bg-bridge-panel text-bridge-text hover:border-orange/40 hover:text-orange",
} as const;

export function WatchButton({
  href,
  children,
  tone = "primary",
  className,
  type = "button",
  disabled,
  onClick,
  testId,
}: {
  href?: string;
  children: ReactNode;
  tone?: keyof typeof watchButtonTone;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  testId?: string;
}) {
  const cls = cn(
    watchButtonBase,
    watchButtonTone[tone],
    disabled && "pointer-events-none opacity-60",
    className,
  );
  if (href) {
    if (href.startsWith("#")) {
      return (
        <a href={href} className={cls} data-testid={testId} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-testid={testId} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      data-testid={testId}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function WatchLink({
  href,
  children,
  className,
  testId,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <Link
      href={href}
      data-testid={testId}
      className={cn(
        "inline-flex font-body text-sm font-semibold text-orange underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function WatchChip({
  href,
  children,
  className,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = cn(
    "inline-flex items-center gap-2 rounded-2xl border border-bridge-line bg-bridge-panel px-3 py-1.5 font-body text-sm font-semibold text-bridge-text hover:border-orange/40 hover:text-orange",
    className,
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return <span className={cls}>{children}</span>;
}

export function LogTable({
  columns,
  rows,
}: {
  columns: [string, string];
  rows: Array<{ name: string; value: string }>;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-bridge-line bg-bridge-panel">
      <table className="w-full min-w-[32rem] text-start text-sm">
        <thead className="border-b border-bridge-line text-orange">
          <tr>
            <th className="px-5 py-3 pe-6 font-ui text-base font-bold">{columns[0]}</th>
            <th className="px-5 py-3 font-ui text-base font-bold">{columns[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-bridge-line align-top">
              <th className="px-5 py-3 pe-6 font-ui text-base font-semibold text-bridge-text">
                {row.name}
              </th>
              <td className="px-5 py-3 font-body text-bridge-dim">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
