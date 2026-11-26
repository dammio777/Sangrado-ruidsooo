import { useEffect, useState } from "react";
import { pendingList } from "../../config/site";

const PALETTES = {
  a: { name: "A · Vino tinto", vars: {} as Record<string, string> },
  b: {
    name: "B · Whisky",
    vars: { "--c-brand": "#4A2412", "--c-brand-deep": "#2E160A", "--c-brand-soft": "#D8AE8C", "--c-light": "#F3E7D3", "--c-light-2": "#E6D2B3", "--c-dark": "#1A0E07", "--c-dark-2": "#2A170C", "--c-accent": "#D9A55A" },
  },
  c: {
    name: "C · Verde sala",
    vars: { "--c-brand": "#1F3A2E", "--c-brand-deep": "#13241C", "--c-brand-soft": "#A9C4B2", "--c-light": "#F1E8D6", "--c-light-2": "#E3D7BE", "--c-dark": "#0D1712", "--c-dark-2": "#16251D", "--c-accent": "#D4A659" },
  },
} as const;
type Key = keyof typeof PALETTES;

/** `?demo` (paletas con View Transition) y `?pending` (material faltante). */
export default function Overlays({ demo, pending }: { demo: boolean; pending: boolean }) {
  const [pal, setPal] = useState<Key>("a");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (pending) document.documentElement.classList.add("show-pending");
  }, [pending]);

  const apply = (k: Key) => {
    const run = () => {
      const root = document.documentElement;
      Object.keys(PALETTES.b.vars).forEach((v) => root.style.removeProperty(v));
      Object.entries(PALETTES[k].vars).forEach(([v, val]) => root.style.setProperty(v, val));
      root.dataset.palette = k;
      setPal(k);
    };
    const d = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (d.startViewTransition) d.startViewTransition(run);
    else run();
  };

  return (
    <>
      {demo && (
        <div className="devpanel devpanel--demo" role="region" aria-label="Paletas de demostración">
          <p className="mono">PALETA · DEMO</p>
          {(Object.keys(PALETTES) as Key[]).map((k) => (
            <button key={k} type="button" aria-pressed={pal === k} onClick={() => apply(k)}>
              {PALETTES[k].name}
            </button>
          ))}
          <p className="devpanel__note">B y C: contraste por re-medir.</p>
        </div>
      )}
      {pending && open && (
        <div className="devpanel devpanel--pending" role="region" aria-label="Material pendiente">
          <div className="devpanel__head">
            <p className="mono">PENDIENTE · {pendingList().length}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar lista de pendientes">
              ×
            </button>
          </div>
          <ul>
            {pendingList().map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
