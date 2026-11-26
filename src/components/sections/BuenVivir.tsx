import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { copy, person, pillars, reels } from "../../config/site";
import { Button } from "../ui/Button";
import { SiteImg } from "../brand/Placeholder";
import { IconArrowUpRight, IconInstagram, IconPlay, IconShare, PillarIcon } from "../brand/Icons";
import { matches, MQ, motionOK } from "../../lib/env";
import { live } from "../../lib/live";
import { formatNumber } from "../../lib/format";
import { useUI } from "../../lib/store";
import { watchVisible } from "../../lib/ticker";

/** `counter`: los dígitos ruedan en columnas como un contador de cinta. */
function TapeCounter({ value }: { value: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const text = formatNumber(value);
  useEffect(() => {
    if (!motionOK() || !root.current) return;
    const cols = root.current.querySelectorAll<HTMLElement>(".tape__col");
    const tw = gsap.fromTo(
      cols,
      { yPercent: 0 },
      {
        yPercent: (_i: number, el: HTMLElement) => -Number(el.dataset.d) * 10,
        duration: 1.4,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      },
    );
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, []);
  return (
    <span className="tape" ref={root}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="tape__digits">
        {text.split("").map((c, i) =>
          /\d/.test(c) ? (
            <span className="tape__cell" key={i}>
              <span className="tape__col" data-d={c} style={{ "--d": c } as React.CSSProperties}>
                {"0123456789".split("").map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          ) : (
            <span className="tape__sep" key={i}>
              {c}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

/** 08 · El buen vivir (Lado B) */
export function BuenVivir() {
  const reelsRef = useRef<HTMLDivElement>(null);
  const sun = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionOK()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine)", () => {
      if (live.lowPower) return;
      // `parallax` (solo escritorio): sol detrás del título y reels a distintas velocidades
      gsap.fromTo(sun.current, { yPercent: 6 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: sun.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".reel").forEach((el, i) => {
        const amt = [6, -4, 3, -6, 4, -3][i % 6]!;
        gsap.fromTo(el, { yPercent: amt }, { yPercent: -amt, ease: "none", scrollTrigger: { trigger: reelsRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
    // reels: video solo en vista (y nunca en bajo consumo)
    const offs: (() => void)[] = [];
    reelsRef.current?.querySelectorAll("video").forEach((v) => {
      if (live.lowPower) return;
      offs.push(
        watchVisible(v, (vis) => {
          if (vis) void v.play().catch(() => {});
          else v.pause();
        }),
      );
    });
    return () => {
      mm.revert();
      offs.forEach((f) => f());
    };
  }, []);

  const share = async () => {
    const data = { title: person.name, text: copy.buenVivir.shareText, url: location.href.split("#")[0]! };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* cancelado */
      }
      return;
    }
    if (matches(MQ.isMobile)) {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`, "_blank", "noopener");
      return;
    }
    try {
      await navigator.clipboard.writeText(data.url);
      useUI.getState().showToast(copy.toast.linkCopied);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`, "_blank", "noopener");
    }
  };

  return (
    <section id="buen-vivir" className="bv section" data-surface="light" data-nav-surface="light" aria-labelledby="bv-title">
      <div className="container">
        <header className="bv__head">
          <div ref={sun} className="bv__sun" aria-hidden="true" />
          <p className="eyebrow" data-reveal="up">
            {copy.buenVivir.eyebrow}
          </p>
          <h2 id="bv-title" className="bv__title" data-reveal="lines" data-focus-target>
            {copy.buenVivir.heading.replace(copy.buenVivir.headingAccent, "")}
            <span className="serif-accent">{copy.buenVivir.headingAccent}</span>
          </h2>
          <p className="accent bv__accent" data-reveal="up" data-delay="0.15">
            {copy.buenVivir.accent}
          </p>
          <p className="lead bv__lead" data-reveal="up" data-delay="0.25" data-pending="Lead buen vivir [AJUSTAR]">
            {copy.buenVivir.lead}
          </p>
        </header>

        <ul className="pillars" data-pending="Pilares [AJUSTAR]">
          {pillars.map((p, i) => (
            <li key={p.id} className="pillar" data-reveal="up" data-delay={String(i * 0.07)}>
              <span data-reveal="draw" data-delay={String(0.1 + i * 0.1)} className="pillar__icon">
                <PillarIcon name={p.icon} />
              </span>
              <h3 className="subheading pillar__title">{p.title}</h3>
              <p className="pillar__text">{p.text}</p>
            </li>
          ))}
        </ul>

        <div className="reels" ref={reelsRef}>
          <p className="eyebrow reels__label">
            {copy.buenVivir.reelsLabel} · {person.instagram.handle.toUpperCase()}
          </p>
          <ul className="reels__list">
            {reels.map((r, i) => (
              <li key={i} className="reel" data-reveal="up" data-delay={String(i * 0.08)}>
                <a href={r.url} target="_blank" rel="noopener" className="reel__link" data-cursor="view" data-pending={r.pending ? "Reel [PONER]" : undefined}>
                  <span className="reel__frame">
                    {r.video ? (
                      <video src={r.video} muted loop playsInline preload="none" poster={r.poster.src ?? undefined} aria-label={r.caption} />
                    ) : (
                      <SiteImg image={r.poster} label={copy.buenVivir.reelSoon} />
                    )}
                    <span className="reel__play" aria-hidden="true">
                      <IconPlay size={18} />
                    </span>
                    <span className="reel__tag mono">REEL · {person.instagram.handle}</span>
                  </span>
                  <span className="reel__caption">
                    {r.caption}
                    <span className="sr-only"> (abre Instagram en una pestaña nueva)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="ig" data-reveal="up">
          <span className="screw screw--tl" aria-hidden="true" />
          <span className="screw screw--tr" aria-hidden="true" />
          <div className="ig__main">
            <h3 className="heading ig__title">{copy.buenVivir.igHeading}</h3>
            <a className="ig__handle mono" href={person.instagram.url} target="_blank" rel="noopener">
              <IconInstagram size={18} />
              <span>{person.instagram.handle}</span>
            </a>
          </div>
          <div className="ig__count" data-pending="Seguidores [ACTUALIZAR]">
            <TapeCounter value={person.instagram.followers} />
            <span className="mono ig__count-label">{copy.buenVivir.followers}</span>
          </div>
          <div className="ig__ctas">
            <Button href={person.instagram.url} external icon={<IconArrowUpRight />}>
              {copy.buenVivir.igButton}
            </Button>
            <Button variant="secondary" onClick={() => void share()} icon={<IconShare />}>
              {copy.buenVivir.share}
            </Button>
          </div>
          <p className="ig__thanks accent">{copy.buenVivir.gratitude}</p>
        </div>
      </div>
    </section>
  );
}
