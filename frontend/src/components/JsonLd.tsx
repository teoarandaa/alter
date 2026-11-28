import { jsonLd } from "@/lib/site";

/** Datos estructurados (schema.org) para que Google entienda la página. Deben coincidir con lo visible. */
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
