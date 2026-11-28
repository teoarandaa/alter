import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { Ext, Field } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidad">): Promise<Metadata> {
  const { lang } = await params;
  // Los textos legales solo están en castellano: en los demás idiomas la canónica es la versión en castellano.
  return pageMetadata({
    title: "Política de privacidad",
    description: "Qué datos trata Alter cuando buscas alternativas de segunda mano, para qué, con quién los compartimos y cómo ejercer tus derechos.",
    path: "/privacidad",
    locale: isLocale(lang) ? lang : DEFAULT_LOCALE,
    translated: false,
  });
}

export default function PrivacidadPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      intro={
        <p>
          En Alter no necesitas cuenta para buscar y tratamos los mínimos datos posibles. Aquí te explicamos cuáles son,
          para qué los usamos y qué puedes hacer con ellos, conforme al Reglamento General de Protección de Datos (RGPD) y
          a la Ley Orgánica 3/2018 de Protección de Datos y garantía de los derechos digitales (LOPDGDD).
        </p>
      }
    >
      <h2>1. Responsable del tratamiento</h2>
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
      </ul>

      <h2>2. Qué datos tratamos y para qué</h2>

      <h3>Lo que nos envías al buscar</h3>
      <p>
        Para encontrar alternativas de segunda mano usamos lo que nos das en cada búsqueda: el <strong>enlace</strong> del
        producto, la <strong>foto</strong> que subes o el <strong>texto</strong> con el que lo describes, y el precio si lo
        indicas. Con ello identificamos el objeto y buscamos anuncios parecidos.
      </p>
      <ul>
        <li>
          Las fotos se procesan en el momento y <strong>no las guardamos</strong>. No subas fotos en las que aparezcan
          personas, documentos u otros datos personales: no los necesitamos.
        </li>
        <li>
          El texto de la búsqueda y los enlaces pueden quedar en los registros técnicos del servidor durante un tiempo
          limitado, para detectar errores y abusos.
        </li>
      </ul>
      <p>
        <strong>Base legal:</strong> la prestación del servicio que nos pides (art. 6.1.b RGPD) y nuestro interés
        legítimo en mantener la web funcionando y segura (art. 6.1.f RGPD).
      </p>

      <h3>Recuento de usuarios únicos</h3>
      <p>
        Para saber cuántas personas usan Alter cada mes, calculamos una huella cifrada e irreversible a partir de la
        dirección IP y del tipo de navegador. No guardamos la IP ni usamos cookies para esto; solo conservamos esa huella
        y el número de búsquedas, agrupados por mes.
      </p>
      <p>
        <strong>Base legal:</strong> interés legítimo en conocer el uso y el coste del servicio (art. 6.1.f RGPD).
      </p>

      <h3>Estadísticas de visitas</h3>
      <p>
        Usamos <Ext href="https://umami.is/privacy">Umami</Ext>, una herramienta de analítica que <strong>no usa cookies</strong>{" "}
        ni guarda datos que te identifiquen. Nos da cifras agregadas (páginas vistas, país, tipo de dispositivo) y algunos
        eventos, como que se hizo una búsqueda o se abrió un anuncio. Nunca le enviamos tus textos, fotos ni enlaces
        completos. Respeta la opción «No rastrear» de tu navegador.
      </p>
      <p>
        <strong>Base legal:</strong> interés legítimo en mejorar la web (art. 6.1.f RGPD).
      </p>

      <h3>Publicidad</h3>
      <p>
        Alter es gratis gracias a los anuncios de <strong>Google AdSense</strong>. Google y otros proveedores usan cookies
        para mostrar anuncios basados en tus visitas anteriores a esta y a otras webs. Solo lo hacen si lo aceptas en el
        aviso de cookies; si no, verás anuncios no personalizados. Más detalles en nuestra{" "}
        <Link href="/cookies">política de cookies</Link>.
      </p>
      <ul>
        <li>
          Cómo usa Google los datos:{" "}
          <Ext href="https://policies.google.com/technologies/partner-sites">
            Cómo utiliza Google la información de los sitios web o aplicaciones que usan sus servicios
          </Ext>
          .
        </li>
        <li>
          Puedes desactivar la publicidad personalizada de Google en{" "}
          <Ext href="https://myadcenter.google.com/">Mi Centro de Anuncios</Ext> y la de otros proveedores en{" "}
          <Ext href="https://www.youronlinechoices.com/es/">Your Online Choices</Ext>.
        </li>
      </ul>
      <p>
        <strong>Base legal:</strong> tu consentimiento (art. 6.1.a RGPD), que puedes retirar cuando quieras.
      </p>

      <h3>Si nos escribes</h3>
      <p>
        Si nos escribes a <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>, usaremos tu dirección y lo que nos cuentes
        solo para responderte. <strong>Base legal:</strong> tu consentimiento al contactarnos y nuestro interés legítimo en
        atenderte.
      </p>

      <h2>3. Con quién compartimos los datos</h2>
      <p>
        No vendemos tus datos. Para que Alter funcione, algunos proveedores los tratan en nuestro nombre, como encargados
        del tratamiento y solo para el fin indicado:
      </p>
      <table>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Para qué</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Anthropic, PBC (EE. UU.)</td>
            <td>Inteligencia artificial que analiza la foto, el texto o la página del producto. No usa estos datos para entrenar sus modelos.</td>
          </tr>
          <tr>
            <td>Apify Technologies s.r.o. (República Checa)</td>
            <td>Busca en las webs de segunda mano los términos de tu búsqueda.</td>
          </tr>
          <tr>
            <td>Render Services, Inc. (EE. UU.)</td>
            <td>Alojamiento de la web y del servidor.</td>
          </tr>
          <tr>
            <td>Umami Software, Inc. (EE. UU.)</td>
            <td>Estadísticas de visitas sin cookies.</td>
          </tr>
          <tr>
            <td>Google Ireland Limited (Irlanda)</td>
            <td>
              Publicidad (Google AdSense), gestión del consentimiento de cookies y aviso a quien navega con un bloqueador
              de anuncios.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Cuando abres un anuncio, sales de Alter y pasas a la web de esa plataforma (Wallapop, Vinted, eBay…), que trata tus
        datos según su propia política de privacidad.
      </p>

      <h2>4. Transferencias internacionales</h2>
      <p>
        Algunos proveedores están en Estados Unidos o pueden acceder a los datos desde allí. En esos casos la transferencia
        se ampara en el Marco de Privacidad de Datos UE-EE. UU., cuando el proveedor está adherido, o en las cláusulas
        contractuales tipo aprobadas por la Comisión Europea.
      </p>

      <h2>5. Cuánto tiempo los conservamos</h2>
      <ul>
        <li>Fotos: no se guardan; se descartan en cuanto termina la búsqueda.</li>
        <li>Registros técnicos del servidor: unos días, según la retención del proveedor de alojamiento.</li>
        <li>Huellas cifradas para el recuento mensual: mientras sean necesarias para las estadísticas de uso.</li>
        <li>Correos que nos envíes: el tiempo necesario para atenderte y, después, mientras puedan surgir responsabilidades.</li>
        <li>Cookies publicitarias: el plazo indicado en la <Link href="/cookies">política de cookies</Link>.</li>
      </ul>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes pedirnos el <strong>acceso</strong>, la <strong>rectificación</strong> o la <strong>supresión</strong> de
        tus datos, la <strong>limitación</strong> del tratamiento, la <strong>portabilidad</strong> y{" "}
        <strong>oponerte</strong> al tratamiento, así como <strong>retirar tu consentimiento</strong> en cualquier momento.
        Escríbenos a <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> indicando qué derecho quieres ejercer.
      </p>
      <p>
        Como no tienes cuenta y no guardamos tu IP, a menudo no podremos asociar datos a tu persona; si es así, te lo
        diremos.
      </p>
      <p>
        Si crees que no hemos tratado bien tus datos, puedes reclamar ante la{" "}
        <Ext href="https://www.aepd.es/">Agencia Española de Protección de Datos</Ext>.
      </p>

      <h2>7. Menores</h2>
      <p>Alter está dirigido a mayores de 14 años. Si eres menor de esa edad, no nos envíes datos personales.</p>

      <h2>8. Cambios en esta política</h2>
      <p>
        Si cambiamos cómo tratamos los datos, actualizaremos esta página y la fecha de arriba. Si el cambio es importante,
        lo avisaremos en la web.
      </p>
    </LegalPage>
  );
}
