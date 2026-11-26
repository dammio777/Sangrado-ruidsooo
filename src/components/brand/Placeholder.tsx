import type { SiteImage } from "../../config/site";
import { copy } from "../../config/site";

/**
 * Imagen desde config. Sin `src` → placeholder de DESIGN.md:
 * marco + marca de disco al 30 % + "Foto próximamente".
 */
export function SiteImg({
  image,
  className = "",
  label = copy.photoSoon,
  priority = false,
  round = false,
}: {
  image: SiteImage;
  className?: string;
  label?: string;
  priority?: boolean;
  round?: boolean;
}) {
  if (image.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={`site-img ${className}`}
      />
    );
  }
  return (
    <div
      className={`ph ${round ? "ph--round" : ""} ${className}`}
      role="img"
      aria-label={`${image.alt} (${label.toLowerCase()})`}
      data-pending={`Imagen ${image.wanted}`}
    >
      <svg className="ph__mark" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="38" className="ph__g" />
        <circle cx="50" cy="50" r="30" className="ph__g" />
        <circle cx="50" cy="50" r="17" className="ph__l" />
        <circle cx="50" cy="50" r="2.5" className="ph__h" />
      </svg>
      <span className="ph__label mono">{label}</span>
    </div>
  );
}
