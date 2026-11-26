import { useUI } from "../../lib/store";
import { setSound } from "../../lib/sound";
import { copy } from "../../config/site";

export function SoundToggle({ className = "" }: { className?: string }) {
  const on = useUI((s) => s.soundOn);
  const armed = useUI((s) => s.soundArmed);
  const intro = useUI((s) => s.introPlaying);
  return (
    <button
      type="button"
      data-sound-toggle
      className={`sound ${on ? "is-on" : ""} ${armed ? "is-armed" : ""} ${className}`}
      aria-pressed={on}
      aria-label={on ? copy.sound.on : copy.sound.off}
      title={armed ? copy.sound.pending : on ? copy.sound.on : copy.sound.off}
      onClick={() => void setSound(!on, intro)}
    >
      <span className="sound__dot" aria-hidden="true" />
      <span className="sound__label mono" aria-hidden="true">
        {copy.sound.label}
      </span>
    </button>
  );
}
