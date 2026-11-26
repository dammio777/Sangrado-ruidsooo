/** Monograma "CC" sobre label de disco (nav, loader, avatar). */
export function Monogram({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={`monogram ${className}`} aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="var(--c-dark)" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="var(--c-brand-deep)" strokeWidth="1" />
      <circle cx="32" cy="32" r="19" fill="var(--c-brand)" />
      <text x="32" y="38.5" textAnchor="middle" className="monogram__cc">
        CC
      </text>
    </svg>
  );
}
