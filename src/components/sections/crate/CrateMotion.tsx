import { useEffect, useRef } from "react";
import { animate, m, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { pose, type CrateListProps } from "./pose";
import { spring } from "../../../lib/motion";
import { motionOK } from "../../../lib/env";

const STEP = 120; // px de arrastre por funda

function Slot({ i, pos, pulled, children }: { i: number; pos: MotionValue<number>; pulled: boolean; children: React.ReactNode }) {
  const d = useTransform(pos, (p) => i - p);
  const rotateX = useTransform(d, (v) => pose(v, pulled).rotateX);
  const y = useTransform(d, (v) => pose(v, pulled).y);
  const z = useTransform(d, (v) => pose(v, pulled).z);
  const opacity = useTransform(d, (v) => pose(v, pulled).opacity);
  const zIndex = useTransform(d, (v) => pose(v, pulled).zIndex);
  return (
    <m.li className={`crate__slot ${pulled ? "is-pulled" : ""}`} style={{ rotateX, y, z, opacity, zIndex }}>
      {children}
    </m.li>
  );
}

/** Caja interactiva (chunk diferido): arrastre con Motion (pan) con inercia y ajuste a cada funda. */
export default function CrateMotion({ count, active, pulled, renderSlot, onSettle, label, onKeyDown }: CrateListProps) {
  const pos = useMotionValue(active);
  const start = useRef(0);
  const anim = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    anim.current?.stop();
    anim.current = animate(pos, active, motionOK() ? spring.soft : { duration: 0 });
  }, [active, pos]);

  return (
    <m.div
      className="crate__stage"
      data-cursor="view"
      onPanStart={() => {
        anim.current?.stop();
        start.current = pos.get();
      }}
      onPan={(_e, info) => {
        const v = start.current - info.offset.y / STEP;
        pos.set(Math.max(-0.35, Math.min(count - 1 + 0.35, v)));
      }}
      onPanEnd={(_e, info) => {
        const projected = pos.get() - (info.velocity.y / STEP) * 0.22;
        const t = Math.max(0, Math.min(count - 1, Math.round(projected)));
        if (t === active) {
          anim.current = animate(pos, t, spring.soft);
        }
        onSettle(t);
      }}
    >
      <ol className="crate__list" aria-label={label} onKeyDown={onKeyDown}>
        {Array.from({ length: count }, (_, i) => (
          <Slot key={i} i={i} pos={pos} pulled={pulled === i}>
            {renderSlot(i)}
          </Slot>
        ))}
      </ol>
    </m.div>
  );
}
