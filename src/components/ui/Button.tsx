import { forwardRef, type ReactNode, type MouseEvent } from "react";

interface BtnProps {
  children: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
  iconLeft?: ReactNode;
  external?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const Button = forwardRef<HTMLElement, BtnProps>(function Button(
  { children, href, onClick, variant = "primary", icon, iconLeft, external, className = "", type = "button", disabled, ariaLabel, ariaDescribedBy },
  fwd,
) {
  const setRef = (n: HTMLElement | null) => {
    if (typeof fwd === "function") fwd(n);
    else if (fwd) fwd.current = n;
  };
  const inner = (
    <>
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
