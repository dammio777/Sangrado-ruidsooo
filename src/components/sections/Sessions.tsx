import { useEffect, useRef, useState } from "react";
import { copy, sessions, type Session } from "../../config/site";
import { dayMonth, isUpcoming, time12, weekdayDayMonth } from "../../lib/format";
import { SiteImg } from "../brand/Placeholder";
import { Button } from "../ui/Button";
import { IconArrowRight, IconCaret } from "../brand/Icons";
import { matches, MQ } from "../../lib/env";
import { scrollToId } from "../../lib/scroll";

const N = sessions.length;

function status(s: Session, now: number) {
  if (!s.date) return { upcoming: false, text: copy.sessions.noDate };
  if (isUpcoming(s.date, now)) return { upcoming: true, text: copy.sessions.upcoming };
  return { upcoming: false, text: `${copy.sessions.played} ${dayMonth(s.date)}` };
}

/**
 * 06 · Sesiones — riel horizontal con scroll nativo (sin capturar la rueda ni teclas).
 * Flechas = botones; con foco en el riel, ←/→ desplazan de forma nativa.
 */
export function Sessions() {
  const [active, setActive] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [now, setNow] = useState<number>(__BUILD_TIME__);
  const rail = useRef<HTMLOListElement>(null);

  useEffect(() => setNow(Date.now()), []);

  // tarjeta activa = la primera visible dentro del riel
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const visible = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.i);
          if (e.isIntersecting) visible.add(i);
          else visible.delete(i);
        });
        if (visible.size) setActive(Math.min(...visible));
      },
      { root: el, threshold: 0.6 },
    );
    el.querySelectorAll("li").forEach((li) => io.observe(li));
    // extremos: primera / última tarjeta completamente visibles → deshabilitar flechas
    const ends = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const key = e.target === el.firstElementChild ? "start" : "end";
          setEdge((prev) => ({ ...prev, [key]: e.intersectionRatio > 0.97 }));
        }),
      { root: el, threshold: [0.97, 1] },
    );
    if (el.firstElementChild) ends.observe(el.firstElementChild);
    if (el.lastElementChild) ends.observe(el.lastElementChild);
    return () => {
      io.disconnect();
      ends.disconnect();
    };
  }, []);

  const go = (i: number) => {
    const el = rail.current;
    const card = el?.children[Math.max(0, Math.min(N - 1, i))] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: matches(MQ.reduceMotion) ? "auto" : "smooth" });
  };

  return (
    <section id="sesiones" className="sessions section" data-surface="dark" data-nav-surface="brand" aria-labelledby="sessions-title">
      <div className="container">
        <header className="section-head">
          <h2 id="sessions-title" className="heading" data-reveal="lines" data-focus-target>
            {copy.sessions.heading}
          </h2>
          <p className="lead sessions__lead" data-reveal="up" data-delay="0.1">
            {copy.sessions.lead}
          </p>
        </header>

        <div className="rail-head">
          <p className="eyebrow">{copy.sessions.label}</p>
          <div className="rail-controls">
            <span className="rail-count" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <button type="button" className="icon-btn icon-btn--line" onClick={() => go(active - 1)} disabled={edge.start} aria-label={copy.sessions.prev} aria-controls="sessions-rail">
              <IconCaret dir="left" />
            </button>
            <button type="button" className="icon-btn icon-btn--line" onClick={() => go(active + 1)} disabled={edge.end} aria-label={copy.sessions.next} aria-controls="sessions-rail">
              <IconCaret dir="right" />
            </button>
          </div>
        </div>

        <ol id="sessions-rail" ref={rail} className="rail" tabIndex={0} aria-label={copy.sessions.rail}>
          {sessions.map((s, i) => {
            const st = status(s, now);
            return (
              <li key={s.id} className="session" data-i={i} data-reveal="up" data-delay={String(i * 0.06)}>
                <article aria-labelledby={`session-${s.id}`} data-pending={s.pending.join(" · ")}>
                  <div className="session__poster">
                    <SiteImg image={s.poster} label={copy.sessions.posterSoon} />
                    {st.upcoming && <span className="session__tag">{st.text}</span>}
                  </div>
                  <div className="session__body">
                    <p className="session__kicker">{s.presenter ?? s.venue}</p>
                    <h3 id={`session-${s.id}`} className="session__title">
                      {s.title}
                    </h3>
                    <p className="session__sub">{s.subtitle}</p>
                    <dl className="session__meta">
                      <div>
                        <dt>{copy.sessions.meta.date}</dt>
                        <dd>
                          {s.date ? weekdayDayMonth(s.date) : copy.sessions.noDate}
                          {s.time ? ` · ${time12(s.time)}` : ""}
                        </dd>
                      </div>
                      <div>
                        <dt>{copy.sessions.meta.venue}</dt>
                        <dd>{s.venue}</dd>
                      </div>
                      {s.address && (
                        <div>
                          <dt>{copy.sessions.meta.where}</dt>
                          <dd>{s.address}</dd>
                        </div>
                      )}
                      {s.genres.length > 0 && (
                        <div>
                          <dt>{copy.sessions.meta.genres}</dt>
                          <dd>{s.genres.join(" · ")}</dd>
                        </div>
                      )}
                    </dl>
                    {!st.upcoming && <p className="session__status">{st.text}</p>}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
        <p className="rail-hint">{copy.sessions.hint}</p>

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
