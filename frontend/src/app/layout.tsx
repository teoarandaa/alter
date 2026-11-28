import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import MotionProvider from "@/components/MotionProvider";
import { ADSENSE_ERROR_PROTECTION } from "@/lib/adsense-error-protection";
import { UMAMI_DOMAINS, UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from "@/lib/analytics";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo-copy";
import { INDEXABLE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

/** Etiqueta de AdSense que avisa a Google de que la página ha cargado su mensaje de recuperación. */
const GOOGLEFC_PRESENT = `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`;

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

/**
 * Metadatos comunes. Cada página define los suyos (título, descripción, canónica y tarjetas sociales)
 * con pageMetadata() de lib/site.ts; aquí solo va lo que comparten todas.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, address: false, email: false },
  // Solo se indexa el dominio de producción; preproducción y local quedan fuera de Google.
  robots: INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
      }
    : { index: false, follow: false },
  // Verificación de Google Search Console por meta etiqueta (opcional; mejor verificar por DNS).
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  openGraph: { type: "website", locale: "es_ES", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
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
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: GOOGLEFC_PRESENT }} />
        {/* …y su «protección de errores», por si el bloqueador impide cargar ese mensaje */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: ADSENSE_ERROR_PROTECTION }} />
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
