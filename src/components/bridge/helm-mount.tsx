"use client";

import dynamic from "next/dynamic";

const Helm = dynamic(
  () => import("@/components/bridge/starwall-assistant").then((mod) => mod.Helm),
  { ssr: false },
);

/** Pilot loads after first paint so marketing routes stay light. */
export function HelmMount() {
  return <Helm />;
}
