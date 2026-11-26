import { useEffect, useRef, type MouseEvent } from "react";
import { ScrollTrigger } from "../../lib/gsap";
import { copy, person } from "../../config/site";
import { waHref } from "../../lib/whatsapp";
import { scrollToId } from "../../lib/scroll";
import { IconWhatsApp } from "../brand/Icons";

/** Píldora flotante "Hablemos": aparece tras el hero, se oculta en contacto. */
export function Floating() {
  const el = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contacto");
    let shown = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: () => {
        if (!hero || !contact) return;
        const vh = window.innerHeight;
        const next = hero.getBoundingClientRect().bottom < vh * 0.4 && contact.getBoundingClientRect().top > vh * 0.8;
        if (next !== shown) {
          shown = next;
          el.current?.classList.toggle("is-visible", next);
        }
      },
    });
    return () => st.kill();
  }, []);
  const click = (e: MouseEvent) => {
    if (person.whatsapp) return;
    e.preventDefault();
    scrollToId("contacto");
  };
  return (
    <a
      ref={el}
      href={waHref()}
      onClick={click}
      className="floating"
      data-surface="brand"
      {...(person.whatsapp ? { target: "_blank", rel: "noopener" } : {})}
      aria-label={copy.a11y.floating}
    >
      <IconWhatsApp size={18} />
      <span>{copy.floating}</span>
    </a>
  );
}
