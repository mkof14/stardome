"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useHud } from "@/lib/i18n/use-hud";
import { CLEAR_SCREENS_EVENT } from "@/lib/helm-events";

type ExpandablePictureProps = {
  children: ReactNode;
};

export function ExpandablePicture({ children }: ExpandablePictureProps) {
  const [open, setOpen] = useState(false);
  const { hud } = useHud();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    function onClear() {
      setOpen(false);
    }
    window.addEventListener(CLEAR_SCREENS_EVENT, onClear);
    return () => window.removeEventListener(CLEAR_SCREENS_EVENT, onClear);
  }, []);

  return (
    <>
      <div data-testid="picture-expand" className="group relative">
        {children}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-2 end-2 border border-bridge-line bg-bridge-panel/90 px-2 py-1 font-mono text-[10px] tracking-wider text-bridge-text hover:border-orange hover:text-orange"
          aria-label={hud.chrome.openPicture}
        >
          {hud.chrome.openPicture}
        </button>
      </div>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              data-testid="picture-lightbox"
              className="fixed inset-0 z-[90] flex items-center justify-center bg-bridge-bg/80 p-3 md:p-8"
              onClick={() => setOpen(false)}
            >
              <div
                className="relative w-full max-w-6xl border border-stroke bg-panel text-ink shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-stroke px-4 py-2">
                  <p className="font-mono text-[10px] tracking-[0.22em] text-orange">
                    {hud.chrome.fullPicture}
                  </p>
                  <button
                    type="button"
                    data-testid="picture-collapse"
                    onClick={() => setOpen(false)}
                    className="border border-stroke px-2 py-1 font-mono text-[10px] text-ink hover:border-orange hover:text-orange"
                  >
                    {hud.chrome.closePicture}
                  </button>
                </div>
                <div className="p-2 md:p-4">{children}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
