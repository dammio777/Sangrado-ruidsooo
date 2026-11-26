import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent, type MouseEvent } from "react";
import { copy, sessions, type Session } from "../../config/site";
import { dayMonth, isUpcoming, time12, weekdayDayMonth } from "../../lib/format";
import { Record } from "../brand/Record";
import { Button } from "../ui/Button";
import { IconArrowRight, IconCaret } from "../brand/Icons";
import { matches, MQ, motionOK } from "../../lib/env";
import { createSpin, type Spinner } from "../../lib/spin";
import { scrollToId } from "../../lib/scroll";
import { tick } from "../../lib/sound";
import { poseStyle, type CrateListProps } from "./crate/pose";
import { watchVisible } from "../../lib/ticker";

const N = sessions.length;

function status(s: Session, now: number) {
  if (!s.date) return { upcoming: false, text: copy.sessions.noDate };
  if (isUpcoming(s.date, now)) return { upcoming: true, text: copy.sessions.upcoming };
  return { upcoming: false, text: `${copy.sessions.played} ${dayMonth(s.date).toUpperCase()}` };
}

function catalogLine(s: Session) {
  const date = s.date ? dayMonth(s.date).toUpperCase() : "FECHA [CONFIRMAR]";
  return `${s.catalog} · ${date} · ${s.venue.split(" · ")[0]!.toUpperCase()}`;
}

function fullLabel(s: Session, now: number) {
  const parts = [s.title, s.subtitle, s.venue];
  if (s.date) parts.push(weekdayDayMonth(s.date));
  if (s.time) parts.push(time12(s.time));
  parts.push(status(s, now).text.toLowerCase());
  return parts.join(", ");
}

/** Versión estática (SSR / móvil / antes de cargar la interacción). */
function CrateStatic({ count, active, pulled, renderSlot, label, onKeyDown }: CrateListProps) {
  return (
    <div className="crate__stage crate__stage--static" data-cursor="view">
      <ol className="crate__list" aria-label={label} onKeyDown={onKeyDown}>
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={`crate__slot ${pulled === i ? "is-pulled" : ""}`} style={poseStyle(i - active, pulled === i)}>
            {renderSlot(i)}
          </li>
        ))}
      </ol>
    </div>
  );
}

const loadCrate = () => import("./crate/CrateMotion");

export function Sessions() {
  const [active, setActive] = useState(0);
  const [pulled, setPulled] = useState<number | null>(null);
  const [now, setNow] = useState<number>(__BUILD_TIME__);
  const [Interactive, setInteractive] = useState<ComponentType<CrateListProps> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const vinyl = useRef<(HTMLDivElement | null)[]>([]);
  const spin = useRef<Spinner | null>(null);

  useEffect(() => setNow(Date.now()), []);

  // la interacción (Motion drag) se carga solo en escritorio y cerca de la sección
  useEffect(() => {
    if (!sectionRef.current || !matches(MQ.isDesktop)) return;
    let off = () => {};
    off = watchVisible(
      sectionRef.current,
      (v) => {
        if (!v) return;
        off();
        void loadCrate().then((m) => setInteractive(() => m.default));
      },
      "900px 0px",
    );
    return () => off();
  }, []);

  const goTo = (i: number, focus = false) => {
    const t = Math.max(0, Math.min(N - 1, i));
    setActive(t);
    if (pulled !== null && pulled !== t) setPulled(null);
    if (t !== active) tick(1 + t * 0.06);
    if (focus) buttons.current[t]?.focus({ preventScroll: true });
    // móvil: carrusel nativo
    if (matches(MQ.isMobile)) buttons.current[t]?.closest("li")?.scrollIntoView({ inline: "center", block: "nearest", behavior: motionOK() ? "smooth" : "auto" });
  };

  // `sleeve-pull`: el vinilo sale y gira
  useEffect(() => {
    spin.current?.destroy();
    spin.current = null;
    if (pulled === null) return;
    const disc = vinyl.current[pulled]?.querySelector<SVGSVGElement>(".record__disc");
    if (disc && motionOK()) spin.current = createSpin(disc, { boost: false });
    return () => {
      spin.current?.destroy();
      spin.current = null;
    };
  }, [pulled]);

  const onKey = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      goTo(active + 1, true);
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      goTo(active - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(N - 1, true);
    } else if (e.key === "Escape" && pulled !== null) {
      setPulled(null);
    }
  };

  const onSleeve = (i: number) => (e: MouseEvent) => {
    e.preventDefault();
    if (i !== active) {
      goTo(i);
      return;
    }
    setPulled(pulled === i ? null : i);
    tick(0.7);
  };

  const renderSlot = (i: number) => {
    const s = sessions[i]!;
    const stt = status(s, now);
    return (
      <>
        <div ref={(n) => void (vinyl.current[i] = n)} className="crate__vinyl" aria-hidden="true">
          <Record ring={null} center="CC" sheen={false} grooveCount={14} />
        </div>
        <button
          ref={(n) => void (buttons.current[i] = n)}
          type="button"
          className={`sleeve sleeve--${i % 3} ${i === active ? "is-active" : ""}`}
          tabIndex={i === active ? 0 : -1}
          aria-pressed={pulled === i}
          aria-label={`${fullLabel(s, now)}. ${pulled === i ? copy.sessions.putBack : copy.sessions.pull}`}
          onClick={onSleeve(i)}
          data-pending={s.pending.join(" · ")}
        >
          <span className="sleeve__art" aria-hidden="true">
            <span className="sleeve__disc" />
            <span className="sleeve__kicker mono">{s.presenter ?? s.venue}</span>
            <span className="sleeve__title">{s.title}</span>
            <span className="sleeve__sub">{s.subtitle}</span>
            <span className="sleeve__soon mono">{copy.sessions.posterSoon}</span>
            <span className={`sleeve__stamp mono ${stt.upcoming ? "is-upcoming" : ""}`}>{stt.text}</span>
          </span>
          <span className="sleeve__strip mono" aria-hidden="true">
            {catalogLine(s)}
          </span>
        </button>
      </>
    );
  };
  const listProps: CrateListProps = {
    count: N,
    active,
    pulled,
    renderSlot,
    onSettle: (i) => goTo(i),
    label: copy.sessions.heading,
    onKeyDown: onKey,
  };

  const sel = sessions[pulled ?? active]!;
  const st = status(sel, now);

  return (
    <section ref={sectionRef} id="sesiones" className="sessions section" data-surface="dark" data-nav-surface="brand" aria-labelledby="sessions-title">
      <div className="container">
        <header className="section-head">
          <h2 id="sessions-title" className="heading" data-reveal="lines" data-focus-target>
            {copy.sessions.heading}
          </h2>
          <p className="lead sessions__lead" data-reveal="up" data-delay="0.1">
            {copy.sessions.lead}
          </p>
        </header>

        <div className="crate" data-reveal="up" data-delay="0.15">
          <div className="crate__box">
            <span className="eyebrow crate__eyebrow">{copy.sessions.label}</span>
            {Interactive ? <Interactive {...listProps} /> : <CrateStatic {...listProps} />}
            <div className="crate__controls">
              <button type="button" className="icon-btn icon-btn--line" onClick={() => goTo(active - 1, false)} disabled={active === 0} aria-label={copy.sessions.prev}>
                <IconCaret dir="up" />
              </button>
              <span className="mono crate__count" aria-live="polite">
                {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
              <button type="button" className="icon-btn icon-btn--line" onClick={() => goTo(active + 1, false)} disabled={active === N - 1} aria-label={copy.sessions.next}>
                <IconCaret dir="down" />
              </button>
              <span className="mono crate__hint">{copy.sessions.hint}</span>
            </div>
          </div>

          <div className={`crate__detail ${pulled !== null ? "is-pulled" : ""}`} aria-live="polite">
            <p className="mono crate__detail-cat">
              {sel.catalog} · {pulled !== null ? "AFUERA DE LA FUNDA" : "EN LA CAJA"}
            </p>
            <h3 className="subheading crate__detail-title">{sel.title}</h3>
            <p className="crate__detail-sub">{sel.subtitle}</p>
            <dl className="crate__meta mono">
              <div>
                <dt>LUGAR</dt>
                <dd>{sel.venue}</dd>
              </div>
              {sel.presenter && (
                <div>
                  <dt>PRESENTA</dt>
                  <dd>{sel.presenter}</dd>
                </div>
              )}
              <div>
                <dt>FECHA</dt>
                <dd>
                  {sel.date ? weekdayDayMonth(sel.date) : copy.sessions.noDate}
                  {sel.time ? ` · ${time12(sel.time)}` : ""}
                </dd>
              </div>
              {sel.address && (
                <div>
                  <dt>DÓNDE</dt>
                  <dd>{sel.address}</dd>
                </div>
              )}
              {sel.genres.length > 0 && (
                <div>
                  <dt>SUENA</dt>
                  <dd>{sel.genres.join(" · ")}</dd>
                </div>
              )}
              <div>
                <dt>ESTADO</dt>
                <dd className={st.upcoming ? "is-upcoming" : ""}>{st.text}</dd>
              </div>
            </dl>
            <button type="button" className="crate__pull mono" onClick={() => setPulled(pulled === null ? active : null)}>
              {pulled !== null ? copy.sessions.putBack : copy.sessions.pull} ↑
            </button>
          </div>
        </div>

        <div className="sessions__cta" data-reveal="up">
          <Button
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("contacto");
            }}
            icon={<IconArrowRight />}
          >
            {copy.sessions.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
