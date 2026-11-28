import { ImageResponse } from "next/og";

/** Tamaño estándar de las imágenes para redes sociales (Open Graph). */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** La «A» con flecha de Alter, en blanco sobre el violeta de la marca. */
const LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#6C3CE1"/><path d="M7.6 24.6 L16 7.6 L24.4 24.6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.3 20.2 H15.6 M17.6 18.2 L15.6 20.2 L17.6 22.2" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
)}`;

/**
 * Imagen para compartir en redes: logo, una etiqueta pequeña, el título grande y el dominio.
 * Se genera al compilar (es estática) con la tipografía que trae Next.js.
 */
export function ogImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #ffffff 0%, #ffffff 55%, #f5f1fe 100%)",
          color: "#1d1d1f",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} width={72} height={72} alt="" />
          <span style={{ fontSize: 30, color: "#6C3CE1" }}>{eyebrow}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 48 ? 64 : 76, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 30, lineHeight: 1.35, color: "#6e6e73", maxWidth: 960 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#6C3CE1" }}>alter2mano.es</div>
      </div>
    ),
    OG_SIZE,
  );
}
