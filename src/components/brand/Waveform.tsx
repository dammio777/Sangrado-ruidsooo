import { waveformBars } from "../../lib/signal";

/** Mini forma de onda 120×24 para el tracklist. CSS reproduce el playhead al hover/focus. */
export function MiniWaveform({ seed }: { seed: number }) {
  const bars = waveformBars(seed, 40);
  const d = bars
    .map((v, i) => {
      const x = 1.5 + i * 3;
      const hh = Math.max(1.5, v * 20);
      return `M${x},${12 - hh / 2}V${12 + hh / 2}`;
    })
    .join("");
  return (
    <span className="mwave" aria-hidden="true">
      <svg viewBox="0 0 120 24" className="mwave__base">
        <path d={d} />
      </svg>
      <svg viewBox="0 0 120 24" className="mwave__played">
        <path d={d} />
      </svg>
      <span className="mwave__head" />
    </span>
  );
}
