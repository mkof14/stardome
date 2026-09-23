"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AgronView = "watch" | "plant";
export type AgronDensity = "roomy" | "compact";

export const AGRON_DENSITY_KEY = "starwall-agron-density";

type AgronViewContextValue = {
  view: AgronView;
  setView: (next: AgronView) => void;
  density: AgronDensity;
  setDensity: (next: AgronDensity) => void;
  toggleDensity: () => void;
};

const AgronViewContext = createContext<AgronViewContextValue>({
  view: "watch",
  setView: () => {},
  density: "roomy",
  setDensity: () => {},
  toggleDensity: () => {},
});

function readDensity(): AgronDensity {
  if (typeof window === "undefined") return "roomy";
  return window.sessionStorage.getItem(AGRON_DENSITY_KEY) === "compact" ? "compact" : "roomy";
}

export function AgronViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AgronView>("watch");
  const [density, setDensityState] = useState<AgronDensity>("roomy");

  useEffect(() => {
    setDensityState(readDensity());
  }, []);

  const setDensity = (next: AgronDensity) => {
    setDensityState(next);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(AGRON_DENSITY_KEY, next);
    }
  };

  const value = useMemo(
    () => ({
      view,
      setView,
      density,
      setDensity,
      toggleDensity: () => setDensity(density === "compact" ? "roomy" : "compact"),
    }),
    [view, density],
  );
  return <AgronViewContext.Provider value={value}>{children}</AgronViewContext.Provider>;
}

export function useAgronView() {
  return useContext(AgronViewContext);
}
