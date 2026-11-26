import { forwardRef, useId } from "react";

interface RecordProps {
  /** texto circular del label (null = sin microtexto) */
  ring?: string | null;
  /** texto central (monograma "CC" o número de tema) */
  center?: string;
  variant?: "full" | "mini";
  className?: string;
  sheen?: boolean;
  /** id de capa interna para animar (label) */
  labelClass?: string;
  grooveCount?: number;
}

const R = 200;

function grooves(count: number) {
  const out: { r: number; o: number; w: number }[] = [];
  const inner = 84;
  const outer = 192;
  const gaps = [0.24, 0.47, 0.68, 0.86]; // separaciones entre temas
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const r = inner + t * (outer - inner);
    const nearGap = gaps.some((g) => Math.abs(g - t) < 0.5 / count);
    out.push({ r, o: nearGap ? 0.95 : i % 3 === 0 ? 0.6 : 0.42, w: nearGap ? 1.6 : 0.5 });
  }
  return out;
}

const fullGrooves = grooves(30);
const miniGrooves = grooves(6);

/** Disco: surcos concéntricos + label central. El brillo (sheen) va aparte y NO gira. */
export const Record = forwardRef<HTMLDivElement, RecordProps>(function Record(
  { ring = "CRISTIAN CALLE · HI-FI · LADO A · 33⅓ RPM · ", center = "CC", variant = "full", className = "", sheen = true, labelClass = "", grooveCount },
  ref,
) {
  const uid = useId().replace(/[:«»]/g, "");
  const gs = grooveCount ? grooves(grooveCount) : variant === "mini" ? miniGrooves : fullGrooves;
  return (
    <div ref={ref} className={`record record--${variant} ${className}`} aria-hidden="true">
      <svg className="record__disc" viewBox={`0 0 ${R * 2} ${R * 2}`} focusable="false">
        <circle cx={R} cy={R} r={R - 1} className="record__vinyl" />
        <g className="record__grooves">
          {gs.map((g, i) => (
            <circle key={i} cx={R} cy={R} r={g.r} strokeOpacity={g.o} strokeWidth={variant === "mini" ? 6 : g.w} />
          ))}
        </g>
        <circle cx={R} cy={R} r={R - 1.5} className="record__edge" />
        <g className={`record__label ${labelClass}`}>
          <circle cx={R} cy={R} r={74} className="record__label-bg" />
          <circle cx={R} cy={R} r={70} className="record__label-ring" />
          {variant === "full" && (
            <>
              <defs>
                <path id={`rp-${uid}`} d={`M ${R} ${R} m -58 0 a 58 58 0 1 1 116 0 a 58 58 0 1 1 -116 0`} />
              </defs>
              {ring && (
                <text className="record__ring-text">
                  <textPath href={`#rp-${uid}`}>{ring}</textPath>
                </text>
              )}
              <text x={R} y={R - 13} textAnchor="middle" className="record__center">
                {center}
              </text>
              {ring && (
                <text x={R} y={R + 28} textAnchor="middle" className="record__rpm">
                  33⅓
                </text>
              )}
            </>
          )}
          <circle cx={R} cy={R} r={variant === "mini" ? 16 : 4.5} className="record__hole" />
        </g>
      </svg>
      {sheen && variant === "full" && <div className="record__sheen" />}
    </div>
  );
});
