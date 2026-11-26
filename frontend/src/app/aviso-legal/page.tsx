import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { Field } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Quién está detrás de Alter y las condiciones de uso de la web.",
  alternates: { canonical: "/aviso-legal" },
};

export default function AvisoLegalPage() {
  return (
    <LegalPage
      title="Aviso legal"
      intro={
        <p>
          Este aviso recoge la información que exige la Ley 34/2002 de Servicios de la Sociedad de la Información y de
          Comercio Electrónico (LSSI) y las condiciones de uso de {LEGAL.domain}.
        </p>
      }
    >
      <h2>1. Titular de la web</h2>
      <ul>
        <li>
          <strong>Titular:</strong> <Field value={LEGAL.owner} />
        </li>
        <li>
          <strong>NIF:</strong> <Field value={LEGAL.taxId} />
        </li>
        <li>
          <strong>Dirección:</strong> <Field value={LEGAL.address} />
        </li>
        <li>
          <strong>Correo electrónico:</strong> <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </li>
        <li>
          <strong>Web:</strong> {LEGAL.domain}
        </li>
      </ul>

      <h2>2. Qué es Alter</h2>
      <p>
        Alter es un buscador gratuito de alternativas de segunda mano. A partir de un enlace, una foto o una descripción,
        busca anuncios parecidos en otras webs de compraventa y te enseña cuánto podrías ahorrar frente a comprarlo nuevo.
      </p>
      <p>
        <strong>Alter no vende nada ni participa en las compraventas.</strong> Los anuncios pertenecen a cada plataforma y
        a sus anunciantes, y cualquier compra, pago, envío o reclamación se hace directamente con ellos y según sus
        condiciones.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>Al usar Alter te comprometes a:</p>
      <ul>
        <li>Usarlo de forma lícita y para buscar productos, no para fines comerciales masivos.</li>
        <li>No automatizar búsquedas, saturar el servicio ni intentar acceder a partes no públicas de la web.</li>
        <li>No subir contenido ilícito, ofensivo o que vulnere derechos de terceros, incluidas fotos de otras personas.</li>
      </ul>
      <p>Podemos limitar o bloquear el acceso a quien no cumpla estas condiciones.</p>

      <h2>4. Precisión de los resultados</h2>
      <p>
        Los resultados se obtienen de forma automática, en parte con inteligencia artificial, y pueden contener errores. Los
        precios, la disponibilidad, el estado de los productos y el ahorro estimado son orientativos y pueden cambiar en
        cualquier momento. Comprueba siempre los detalles en la web del anuncio antes de comprar.
      </p>
      <p>
        Los resultados marcados como «Patrocinado» aparecen destacados por un acuerdo comercial con esa plataforma. La web
        también muestra publicidad de Google AdSense.
      </p>

      <h2>5. Enlaces a otras webs</h2>
      <p>
        Alter enlaza a webs de terceros (Wallapop, Vinted, Milanuncios, eBay y otras). No controlamos su contenido ni
        respondemos de él, de sus condiciones ni de sus políticas de privacidad.
      </p>

      <h2>6. Propiedad intelectual e industrial</h2>
      <p>
        El diseño, los textos, el logotipo y el código de Alter pertenecen a su titular. No puedes copiarlos ni
        reutilizarlos sin permiso. Los nombres, logotipos y anuncios de las plataformas pertenecen a sus respectivos
        propietarios y se muestran solo para identificarlas; su uso no implica ninguna relación con ellas salvo que se
        indique.
      </p>

      <h2>7. Responsabilidad</h2>
      <p>
        Hacemos lo posible para que Alter funcione bien, pero no garantizamos que esté siempre disponible ni libre de
        errores. No respondemos de los daños derivados de interrupciones, de errores en los resultados ni de las
        transacciones que hagas con terceros, salvo en los casos en que la ley no permita excluir esa responsabilidad.
      </p>

      <h2>8. Datos personales y cookies</h2>
      <p>
        Cómo tratamos tus datos se explica en la <Link href="/privacidad">política de privacidad</Link>, y qué cookies se
        usan, en la <Link href="/cookies">política de cookies</Link>.
      </p>

      <h2>9. Legislación aplicable</h2>
      <p>
        Este aviso se rige por la legislación española. Si eres consumidor, cualquier conflicto se resolverá en los
        juzgados de tu domicilio.
      </p>
    </LegalPage>
  );
}
