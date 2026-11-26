import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { gsap, morph } from "../../lib/gsap";
import { contactTypes, copy, person } from "../../config/site";
import { buildMessage, waLink, type ContactData } from "../../lib/whatsapp";
import { Button } from "../ui/Button";
import { IconCheck, IconCopy, IconInstagram, IconMail, IconWhatsApp } from "../brand/Icons";
import { motionOK } from "../../lib/env";
import { sinePath, noisyPath, flatPath } from "../../lib/signal";
import { useUI } from "../../lib/store";
import { setMood } from "../../lib/mood";

type Field = keyof ContactData;
const EMPTY: ContactData = { nombre: "", celular: "", tipo: "", fecha: "", personas: "", lugar: "", mensaje: "" };
const C = copy.contact;

function validate(d: ContactData): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (d.nombre.trim().length < 2) e.nombre = C.errors.nombre;
  if (!/^3\d{9}$/.test(d.celular.replace(/\D/g, ""))) e.celular = C.errors.celular;
  if (!d.tipo) e.tipo = C.errors.tipo;
  if (d.personas && !/^\d{1,5}$/.test(d.personas.trim())) e.personas = C.errors.personas;
  if (d.mensaje.trim().length < 10) e.mensaje = C.errors.mensaje;
  return e;
}

const W = 600;
const H = 80;

/** 09 · Contacto — formulario de un paso → WhatsApp prellenado. */
export function Contact() {
  const uid = useId();
  const [data, setData] = useState<ContactData>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState("");
  const errors = useMemo(() => validate(data), [data]);
  const valid = Object.keys(errors).length === 0;
  const wave = useRef<SVGPathElement>(null);
  const check = useRef<SVGPathElement>(null);
  const root = useRef<HTMLElement>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const d = new Date();
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, []);

  // mood crema → vino al entrar
  useEffect(() => {
    if (!motionOK() || !root.current) return;
    const proxy = { v: 0 };
    const tw = gsap.fromTo(
      proxy,
      { v: 0 },
      {
        v: 1,
        ease: "none",
        onUpdate: () => setMood("contact", proxy.v),
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 35%", scrub: 0.6 },
      },
    );
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, []);

  // confirmación: la onda se dibuja y se asienta en una línea limpia
  useEffect(() => {
    if (state !== "sent") return;
    if (!motionOK()) return;
    const tl = gsap.timeline();
    tl.fromTo(wave.current, { drawSVG: "0%", ...morph(noisyPath(W, H, 26, 80, 5)) }, { drawSVG: "100%", duration: 0.7, ease: "power2.inOut" })
      .to(wave.current, { ...morph(sinePath(W, H, 3, 14, 80)), duration: 0.5, ease: "power3.out" })
      .to(wave.current, { ...morph(flatPath(W, H, 80)), duration: 0.6, ease: "power3.inOut" })
      .fromTo(check.current, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: "power2.out" }, 0.9);
    return () => {
      tl.kill();
    };
  }, [state]);

  const set = (k: Field) => (e: { target: { value: string } }) => setData((d) => ({ ...d, [k]: e.target.value }));
  const blur = (k: Field) => () => setTouched((t) => ({ ...t, [k]: true }));
  const show = (k: Field) => touched[k] && errors[k];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ nombre: true, celular: true, tipo: true, mensaje: true, personas: true });
    if (!valid) return;
    const msg = buildMessage(data);
    setMessage(msg);
    setState("sending");
    window.open(waLink(msg), "_blank", "noopener");
    window.setTimeout(() => setState("sent"), 450);
  };

  const copyMsg = async () => {
    try {
      await navigator.clipboard.writeText(message);
      useUI.getState().showToast(C.copied);
    } catch {
      useUI.getState().showToast(C.copyError);
    }
  };

  const id = (k: string) => `${uid}-${k}`;
  const describe = (k: Field) => (show(k) ? id(`${k}-err`) : undefined);

  return (
    <section ref={root} id="contacto" className="contact section" data-surface="brand" data-nav-surface="brand" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <header className="contact__head">
          <span className="eyebrow" data-reveal="up">
            {C.label}
          </span>
          <h2 id="contact-title" className="heading contact__title" data-reveal="lines" data-focus-target>
            {C.heading}
          </h2>
          <p className="lead contact__lead" data-reveal="up" data-delay="0.1" data-pending="Lead contacto [AJUSTAR]">
            {C.lead}
          </p>
          <ul className="direct" data-reveal="up" data-delay="0.2" aria-label={C.direct}>
            <li>
              <span className="mono direct__label">{C.whatsappLabel}</span>
              {person.whatsapp ? (
                <a href={`https://wa.me/${person.whatsapp}`} target="_blank" rel="noopener" className="direct__link">
                  <IconWhatsApp size={18} /> +{person.whatsapp.replace(/^57(\d{3})(\d{3})(\d{4})$/, "57 $1 $2 $3")}
                </a>
              ) : (
                <span className="direct__link is-pending" data-pending="WhatsApp [PONER]">
                  <IconWhatsApp size={18} /> {C.pendingValue}
                </span>
              )}
            </li>
            <li>
              <span className="mono direct__label">{C.instagramLabel}</span>
              <a href={person.instagram.url} target="_blank" rel="noopener" className="direct__link">
                <IconInstagram size={18} /> {person.instagram.handle}
              </a>
            </li>
            <li>
              <span className="mono direct__label">{C.emailLabel}</span>
              {person.email ? (
                <a href={`mailto:${person.email}`} className="direct__link">
                  <IconMail size={18} /> {person.email}
                </a>
              ) : (
                <span className="direct__link is-pending" data-pending="Correo [PONER]">
                  <IconMail size={18} /> {C.pendingValue}
                </span>
              )}
            </li>
          </ul>
        </header>

        <div className="contact__panel" data-reveal="up" data-delay="0.1">
          {state !== "sent" ? (
            <form className="form" noValidate onSubmit={submit} aria-describedby={id("status")}>
              <div className="form__row">
                <div className={`field ${show("nombre") ? "is-invalid" : ""} ${touched.nombre && !errors.nombre ? "is-valid" : ""}`}>
                  <label htmlFor={id("nombre")}>{C.fields.nombre}</label>
                  <input id={id("nombre")} name="nombre" autoComplete="name" required value={data.nombre} onChange={set("nombre")} onBlur={blur("nombre")} placeholder={C.placeholders.nombre} aria-invalid={!!show("nombre")} aria-describedby={describe("nombre")} />
                  <FieldCheck />
                  {show("nombre") && <p id={id("nombre-err")} className="field__err">{errors.nombre}</p>}
                </div>
                <div className={`field ${show("celular") ? "is-invalid" : ""} ${touched.celular && !errors.celular ? "is-valid" : ""}`}>
                  <label htmlFor={id("celular")}>{C.fields.celular}</label>
                  <input id={id("celular")} name="celular" type="tel" inputMode="numeric" autoComplete="tel-national" required value={data.celular} onChange={set("celular")} onBlur={blur("celular")} placeholder={C.placeholders.celular} aria-invalid={!!show("celular")} aria-describedby={describe("celular")} maxLength={14} />
                  <FieldCheck />
                  {show("celular") && <p id={id("celular-err")} className="field__err">{errors.celular}</p>}
                </div>
              </div>

              <fieldset className={`field field--chips ${show("tipo") ? "is-invalid" : ""}`} aria-describedby={describe("tipo")}>
                <legend>{C.fields.tipo}</legend>
                <div className="chips">
                  {contactTypes.map((t) => (
                    <label key={t} className="chip">
                      <input type="radio" name="tipo" value={t} checked={data.tipo === t} onChange={set("tipo")} onBlur={blur("tipo")} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
                {show("tipo") && <p id={id("tipo-err")} className="field__err">{errors.tipo}</p>}
              </fieldset>

              <div className="form__row form__row--3">
                <div className="field">
                  <label htmlFor={id("fecha")}>
                    {C.fields.fecha} <span className="field__opt">({C.fields.optional})</span>
                  </label>
                  <input id={id("fecha")} name="fecha" type="date" min={today || undefined} value={data.fecha} onChange={set("fecha")} />
                </div>
                <div className={`field ${show("personas") ? "is-invalid" : ""}`}>
                  <label htmlFor={id("personas")}>
                    {C.fields.personas} <span className="field__opt">({C.fields.optional})</span>
                  </label>
                  <input id={id("personas")} name="personas" inputMode="numeric" value={data.personas} onChange={set("personas")} onBlur={blur("personas")} placeholder={C.placeholders.personas} aria-invalid={!!show("personas")} aria-describedby={describe("personas")} />
                  {show("personas") && <p id={id("personas-err")} className="field__err">{errors.personas}</p>}
                </div>
                <div className="field">
                  <label htmlFor={id("lugar")}>
                    {C.fields.lugar} <span className="field__opt">({C.fields.optional})</span>
                  </label>
                  <input id={id("lugar")} name="lugar" autoComplete="address-level2" value={data.lugar} onChange={set("lugar")} placeholder={C.placeholders.lugar} />
                </div>
              </div>

              <div className={`field ${show("mensaje") ? "is-invalid" : ""} ${touched.mensaje && !errors.mensaje ? "is-valid" : ""}`}>
                <label htmlFor={id("mensaje")}>{C.fields.mensaje}</label>
                <textarea id={id("mensaje")} name="mensaje" rows={4} required value={data.mensaje} onChange={set("mensaje")} onBlur={blur("mensaje")} placeholder={C.placeholders.mensaje} aria-invalid={!!show("mensaje")} aria-describedby={describe("mensaje")} />
                {show("mensaje") && <p id={id("mensaje-err")} className="field__err">{errors.mensaje}</p>}
              </div>

              <div className="form__submit">
                <Button type="submit" disabled={!valid || state === "sending"} icon={<IconWhatsApp size={18} />} ariaDescribedBy={id("status")}>
                  {state === "sending" ? C.submitting : C.submit}
                </Button>
                <p id={id("status")} className="form__status mono" role="status" aria-live="polite">
                  {state === "sending" ? C.submitting : !valid ? "Completa los campos obligatorios" : "Todo listo"}
                </p>
              </div>
            </form>
          ) : (
            <div className="sent" role="status" aria-live="polite">
              <svg className="sent__wave" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                <path ref={wave} d={flatPath(W, H, 80)} />
              </svg>
              <p className="subheading sent__title">
                <svg viewBox="0 0 24 24" className="sent__check" aria-hidden="true">
                  <path ref={check} d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                {C.sent}
              </p>
              <p className="sent__hint">{C.sentHint}</p>
              <pre className="sent__msg mono">{message}</pre>
              <div className="sent__ctas">
                <Button variant="secondary" onClick={() => void copyMsg()} icon={<IconCopy />}>
                  {C.copy}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setState("idle");
                    setData(EMPTY);
                    setTouched({});
                  }}
                >
                  {C.again}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FieldCheck() {
  return (
    <span className="field__ok" aria-hidden="true">
      <IconCheck size={16} />
    </span>
  );
}
