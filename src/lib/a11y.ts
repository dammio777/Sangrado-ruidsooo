import { useEffect } from "react";
import { startScroll, stopScroll } from "./scroll";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Trampa de foco + Esc + retorno del foco. */
export function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;
    const prev = document.activeElement as HTMLElement | null;
    const first = root.querySelector<HTMLElement>("[data-autofocus]") ?? root.querySelector<HTMLElement>(FOCUSABLE);
    window.requestAnimationFrame(() => first?.focus({ preventScroll: true }));
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const f = items[0]!;
      const l = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === f) {
        e.preventDefault();
        l.focus();
      } else if (!e.shiftKey && document.activeElement === l) {
        e.preventDefault();
        f.focus();
      }
    };
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("keydown", key, true);
      prev?.focus?.({ preventScroll: true });
    };
  }, [ref, active, onClose]);
}

/** Bloqueo de scroll sin salto (scrollbar-gutter: stable en <html>). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    html.classList.add("is-locked");
    stopScroll();
    return () => {
      html.classList.remove("is-locked");
      startScroll();
    };
  }, [active]);
}
