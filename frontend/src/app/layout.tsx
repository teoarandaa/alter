import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alter · Alternativas de segunda mano que ayudan al planeta",
    template: "%s · Alter",
  },
  description:
    "Pega el enlace de lo que ibas a comprar nuevo o sube una foto: Alter busca ese objeto de segunda mano en Wallapop, Vinted, Milanuncios, eBay y más, y te dice cuánto te ahorras. Gratis.",
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
      <body className="flex min-h-full flex-col font-sans">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
