import { siEbay, siEtsy, siVinted } from "simple-icons";

/** Iconos de Simple Icons (licencia CC0) para las webs que lo tienen. */
const SIMPLE_ICONS: Record<string, { path: string; hex: string }> = {
  ebay: siEbay,
  vinted: siVinted,
  etsyvintage: siEtsy,
};

/** Texto que acompaña al logo cuando el logo no lo dice todo. */
const SUFFIX: Record<string, string> = { etsyvintage: "vintage", amazonrenewed: "Reacondicionados" };

const SIZES = {
  sm: { logo: "h-3.5", icon: "h-6 -my-1.5", dot: "size-1.5", text: "text-xs" },
  md: { logo: "h-6", icon: "h-10 -my-2", dot: "size-2.5", text: "text-[21px]" },
};

/**
 * Marca de una web de segunda mano: su logo SVG si lo hay, o el punto de color y el nombre.
 * El nombre siempre queda disponible para lectores de pantalla.
 */
export default function PlatformMark({
  platformKey,
  name,
  color,
  hasLogoFile = false,
  size = "md",
}: {
  platformKey: string;
  name: string;
  color: string;
  hasLogoFile?: boolean;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  const icon = SIMPLE_ICONS[platformKey];
  const suffix = SUFFIX[platformKey];

  if (hasLogoFile || icon) {
    return (
      <span className="inline-flex items-center gap-1.5" title={name}>
        <span className="sr-only">{name}</span>
        {hasLogoFile ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/logos/${platformKey}.svg`} alt="" aria-hidden="true" className={`${s.logo} w-auto max-w-[9rem] object-contain`} />
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className={`${s.icon} w-auto`}>
            <path d={icon.path} fill={`#${icon.hex}`} />
          </svg>
        )}
        {suffix && (
          <span aria-hidden="true" className={`${s.text} font-medium text-ink-2`}>
            {suffix}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className={`${s.dot} shrink-0 rounded-full`} style={{ background: color }} aria-hidden="true" />
      {name}
    </span>
  );
}
