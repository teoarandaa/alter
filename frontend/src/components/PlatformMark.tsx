/** Texto que acompaña al logo cuando el logo no lo dice todo. */
const SUFFIX: Record<string, string> = { etsyvintage: "vintage" };

// Alto fijo y ancho máximo: los logos alargados se limitan por el ancho y los compactos por el alto,
// así todos tienen un peso visual parecido.
const SIZES = {
  sm: { logo: "h-5 w-auto max-w-24", dot: "size-1.5", text: "text-xs" },
  md: { logo: "h-8 w-auto max-w-36", dot: "size-2.5", text: "text-[17px]" },
};

/**
 * Marca de una web de segunda mano: su logo si lo hay (public/logos/), o el punto de color y el nombre.
 * El nombre siempre queda disponible para lectores de pantalla.
 */
export default function PlatformMark({
  platformKey,
  name,
  color,
  logo = null,
  size = "md",
}: {
  platformKey: string;
  name: string;
  color: string;
  /** URL del logo (p. ej. "/logos/wallapop.svg") o null si no hay. */
  logo?: string | null;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  const suffix = SUFFIX[platformKey];

  if (logo) {
    return (
      <span className="inline-flex items-center gap-2" title={name}>
        <span className="sr-only">{name}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" aria-hidden="true" className={`${s.logo} object-contain object-left`} />
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
