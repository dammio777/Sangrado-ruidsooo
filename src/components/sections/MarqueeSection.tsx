import { Fragment } from "react";
import { copy } from "../../config/site";
import { MarqueeRow } from "../ui/Marquee";
import { IconSpark } from "../brand/Icons";

function MiniDisc() {
  return (
    <span className="mdisc" aria-hidden="true">
      <span className="mdisc__label" />
    </span>
  );
}

export function MarqueeSection() {
  const r1 = copy.marquee.row1;
  const r2 = copy.marquee.row2;
  const row1 = (
    <>
      {[0, 1].map((k) => (
        <Fragment key={k}>
          {r1.map((w) => (
            <Fragment key={w}>
              <span className="marquee__word">{w}</span>
              <IconSpark className="marquee__spark" />
            </Fragment>
          ))}
          <MiniDisc />
        </Fragment>
      ))}
    </>
  );
  const row2 = (
    <>
      {[0, 1].map((k) => (
        <Fragment key={k}>
          {r2.map((w) => (
            <Fragment key={w}>
              <span className="marquee__mono">{w}</span>
              <span className="marquee__dot">·</span>
            </Fragment>
          ))}
          <MiniDisc />
        </Fragment>
      ))}
    </>
  );
  return (
    <section className="marquee" data-surface="brand" data-nav-surface="brand" aria-label="Géneros y ciudad">
      <p className="sr-only">
        {r1.join(", ")}. {r2.join(", ").toLowerCase()}.
      </p>
      <div aria-hidden="true">
        <MarqueeRow speed={2.6}>{row1}</MarqueeRow>
        <MarqueeRow speed={2.2} reverse>
          {row2}
        </MarqueeRow>
      </div>
    </section>
  );
}
