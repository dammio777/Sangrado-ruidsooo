import { forwardRef } from "react";

/** Brazo de latón (el ref apunta al grupo que gira; la base queda fija). Pivote en (96, 36) del viewBox; reposo −24°, sobre el disco 0°. */
export const Tonearm = forwardRef<SVGGElement, { className?: string }>(function Tonearm({ className = "" }, ref) {
  return (
    <svg className={`tonearm ${className}`} viewBox="0 0 130 320" aria-hidden="true" focusable="false">
      <g ref={ref} className="tonearm__arm">
        {/* contrapeso */}
        <rect x="84" y="2" width="24" height="16" rx="3" className="tonearm__weight" />
        <line x1="96" y1="18" x2="96" y2="36" className="tonearm__tube" />
        {/* tubo en S */}
        <path d="M96 36 C 96 120, 104 170, 88 236 S 60 282, 56 292" className="tonearm__tube" />
        {/* cápsula */}
        <g transform="rotate(28 56 296)">
          <rect x="44" y="288" width="26" height="18" rx="2.5" className="tonearm__head" />
          <line x1="50" y1="306" x2="50" y2="312" className="tonearm__stylus" />
        </g>
      </g>
      <circle cx="96" cy="36" r="17" className="tonearm__base" />
      <circle cx="96" cy="36" r="6" className="tonearm__pivot" />
    </svg>
  );
});
