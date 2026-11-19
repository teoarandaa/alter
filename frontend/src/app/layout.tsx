import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const body = Inter({ variable: "--font-inter", subsets: ["latin"] });

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
    title: "Alter · Alternativas sostenibles",
    description: "Encuentra de segunda mano lo que ibas a comprar nuevo y descubre cuánto ahorras.",
  },
  twitter: { card: "summary_large_image", title: "Alter · Alternativas sostenibles" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#6C3CE1" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
