"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AgronView = "watch" | "plant";

type AgronViewContextValue = {
  view: AgronView;
  setView: (next: AgronView) => void;
};

const AgronViewContext = createContext<AgronViewContextValue>({
  view: "watch",
  setView: () => {},
});

export function AgronViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AgronView>("watch");
  const value = useMemo(() => ({ view, setView }), [view]);
  return <AgronViewContext.Provider value={value}>{children}</AgronViewContext.Provider>;
}

export function useAgronView() {
  return useContext(AgronViewContext);
}
