import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { matches, MQ, motionOK } from "../../lib/env";
import { copy } from "../../config/site";

/** Cursor (escritorio): punto + anillo. Sobre el disco: "GIRAR"; sobre fundas/reels: "VER". */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEnabled(matches(MQ.isDesktop) && motionOK());
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.4, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.4, ease: "power3.out" });
    let mode = "";
    const setMode = (m: string) => {
      if (m === mode) return;
      mode = m;
      ring.current!.dataset.mode = m;
      dot.current!.dataset.mode = m;
      if (label.current) label.current.textContent = m === "record" ? copy.cursor.record : m === "view" ? copy.cursor.view : "";
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      html.classList.add("cursor-on");
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea,select,[contenteditable]")) return setMode("text");
      const c = t.closest<HTMLElement>("[data-cursor]");
      if (c) return setMode(c.dataset.cursor ?? "");
      if (t.closest("a,button,label,[role=button]")) return setMode("link");
      setMode("");
    };
    const leave = () => html.classList.remove("cursor-on");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      html.classList.remove("has-cursor", "cursor-on");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring">
        <svg viewBox="0 0 80 80" className="cursor__dash">
          <circle cx="40" cy="40" r="38" />
        </svg>
        <span ref={label} className="cursor__label mono" />
      </div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
