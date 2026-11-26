import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import MotionProvider from "@/components/MotionProvider";
import { ADSENSE_ERROR_PROTECTION } from "@/lib/adsense-error-protection";
import { UMAMI_DOMAINS, UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from "@/lib/analytics";
import "./globals.css";

/** Etiqueta de AdSense que avisa a Google de que la página ha cargado su mensaje de recuperación. */
const GOOGLEFC_PRESENT = `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`;

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alter · Alternativas de segunda mano que ayudan al planeta",
    template: "%s · Alter",
  },
  description:
    "Pega el enlace de lo que ibas a comprar nuevo, sube una foto o descríbelo: Alter busca ese objeto de segunda mano en Wallapop, Vinted, Milanuncios, eBay y más, y te dice cuánto te ahorras. Gratis.",
  keywords: [
    "segunda mano",
    "comparador segunda mano",
    "Wallapop",
    "Vinted",
    "Milanuncios",
    "eBay",
    "reciclaje",
    "consumo sostenible",
    "ahorro",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Alter",
    title: "Alter · Segunda mano. Primera opción.",
    description: "Encuentra de segunda mano lo que ibas a comprar nuevo y descubre cuánto ahorras.",
  },
  twitter: { card: "summary_large_image", title: "Alter · Segunda mano. Primera opción." },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <head>
        {/* Google AdSense: anuncios automáticos en todas las páginas */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7383693727799001"
          crossOrigin="anonymous"
        />
        {/* AdSense: mensaje para contrarrestar el bloqueo de anuncios (Privacidad y mensajes) */}
        <script async src="https://fundingchoicesmessages.google.com/i/pub-7383693727799001?ers=1" />
        <script dangerouslySetInnerHTML={{ __html: GOOGLEFC_PRESENT }} />
        {/* …y su «protección de errores», por si el bloqueador impide cargar ese mensaje */}
        <script dangerouslySetInnerHTML={{ __html: ADSENSE_ERROR_PROTECTION }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <MotionProvider>{children}</MotionProvider>
        {/* Umami: solo se carga si hay ID configurado; respeta «No rastrear» del navegador */}
        {UMAMI_WEBSITE_ID && (
          <Script
            src={UMAMI_SCRIPT_URL}
            data-website-id={UMAMI_WEBSITE_ID}
            data-do-not-track="true"
            {...(UMAMI_DOMAINS ? { "data-domains": UMAMI_DOMAINS } : {})}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
