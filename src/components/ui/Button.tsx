import { forwardRef, useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "../../lib/gsap";
import { matches, MQ, motionOK } from "../../lib/env";

interface BtnProps {
  children: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
  iconLeft?: ReactNode;
  magnetic?: boolean;
  external?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

/** `magnetic`: máx 6 px, quickTo 0.4 s power3.out, solo puntero fino. */
export function useMagnetic(ref: React.RefObject<HTMLElement | null>, max = 6, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !motionOK() || !matches(MQ.isDesktop)) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      xTo(gsap.utils.clamp(-1, 1, dx) * max);
      yTo(gsap.utils.clamp(-1, 1, dy) * max);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, max, enabled]);
}

export const Button = forwardRef<HTMLElement, BtnProps>(function Button(
  { children, href, onClick, variant = "primary", icon, iconLeft, magnetic = false, external, className = "", type = "button", disabled, ariaLabel, ariaDescribedBy },
  fwd,
) {
  const local = useRef<HTMLElement | null>(null);
  useMagnetic(local, 6, magnetic);
  const setRef = (n: HTMLElement | null) => {
    local.current = n;
    if (typeof fwd === "function") fwd(n);
    else if (fwd) fwd.current = n;
  };
  const inner = (
    <>
      {variant === "primary" && <span className="btn__led" aria-hidden="true" />}
      {iconLeft}
      <span className="btn__roll">
        <span className="btn__label">{children}</span>
        <span className="btn__label btn__label--dup" aria-hidden="true">
          {children}
        </span>
      </span>
      {icon}
    </>
  );
  const cls = `btn btn--${variant} ${className}`;
  if (href) {
    return (
      <a
        ref={setRef as (n: HTMLAnchorElement | null) => void}
        href={href}
        className={cls}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={setRef as (n: HTMLButtonElement | null) => void}
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {inner}
    </button>
  );
});
