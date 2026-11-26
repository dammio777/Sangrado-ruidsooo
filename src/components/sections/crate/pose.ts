/** Pose de una funda según su distancia continua `d` al disco activo. */
export function pose(d: number, pulled: boolean) {
  // positivo = el borde superior se aleja (se recuesta hacia atrás); negativo = cae hacia el frente
  const rotateX = d >= 0 ? Math.min(d, 1) * 28 : -Math.min(-d, 1) * 62;
  const y = (d >= 0 ? -d * 30 : -d * 140) + (pulled ? -40.8 : 0);
  const z = (d >= 0 ? -d * 70 : -d * 60) + (Math.abs(d) < 0.5 ? 40 * (1 - Math.abs(d) * 2) : 0);
  const opacity = d >= 0 ? (d > 3 ? Math.max(0, 1 - (d - 3)) : 1) : Math.max(0, 1 + d * 0.95);
  const zIndex = Math.round(100 - d * 10);
  return { rotateX, y, z, opacity, zIndex };
}

export function poseStyle(d: number, pulled: boolean): React.CSSProperties {
  const p = pose(d, pulled);
  return {
    transform: `translateY(${p.y}px) translateZ(${p.z}px) rotateX(${p.rotateX}deg)`,
    opacity: p.opacity,
    zIndex: p.zIndex,
  };
}

export interface CrateListProps {
  count: number;
  active: number;
  pulled: number | null;
  renderSlot: (i: number) => React.ReactNode;
  onSettle: (i: number) => void;
  label: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
}
