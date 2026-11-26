import { useCallback, useRef } from "react";
import { AnimatePresence, m, useDragControls } from "motion/react";
import { useFocusTrap, useScrollLock } from "../../lib/a11y";
import { matches, MQ } from "../../lib/env";
import { spring } from "../../lib/motion";
import { IconX } from "../brand/Icons";
import { copy } from "../../config/site";

/** Hoja inferior (móvil) / modal 640 px (escritorio). Trampa de foco, Esc, retorno de foco. */
export default function Sheet({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(panel, open, close);
  useScrollLock(open);
  const mobile = matches(MQ.isMobile);
  const reduce = matches(MQ.reduceMotion);

  return (
    <AnimatePresence>
      {open && (
        <div className="sheet" data-surface="brand">
          <m.div
            className="sheet__scrim"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.12 : 0.32 }}
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="sheet__panel"
            initial={reduce ? { opacity: 0 } : mobile ? { y: "100%" } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : mobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : mobile ? { y: "100%" } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={reduce ? { duration: 0.12 } : spring.ui}
            drag={mobile && !reduce ? "y" : false}
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) close();
            }}
          >
            <div className="sheet__handle" onPointerDown={(e) => controls.start(e)} aria-hidden="true">
              <span />
            </div>
            <button type="button" className="sheet__close icon-btn" onClick={close} aria-label={copy.services.close}>
              <IconX />
            </button>
            <span className="screw screw--tl" aria-hidden="true" />
            <span className="screw screw--tr" aria-hidden="true" />
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
