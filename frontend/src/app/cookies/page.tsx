import type { Metadata } from "next";
import Link from "next/link";

import CookieSettingsButton from "@/components/CookieSettingsButton";
import LegalPage, { Ext } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Política de cookies",
  description: "Qué cookies usa Alter, para qué sirven y cómo aceptarlas, rechazarlas o cambiar tu elección.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de cookies"
      intro={
        <p>
          Las cookies son pequeños archivos que una web guarda en tu navegador. Alter no usa cookies propias: las únicas que
          puede haber son las de la publicidad de Google, y solo si las aceptas.
        </p>
      }
    >
      <h2>1. Cookies que usamos</h2>

      <h3>Cookies propias</h3>
      <p>
        Ninguna. Para contar visitas usamos Umami, que funciona <strong>sin cookies</strong> y sin guardar datos que te
        identifiquen (más detalles en la <Link href="/privacidad">política de privacidad</Link>).
      </p>

      <h3>Cookies de terceros: Google AdSense</h3>
      <p>
        Google Ireland Limited muestra anuncios en Alter. Google y sus socios usan cookies para mostrar anuncios, limitar
        cuántas veces ves el mismo, medir su rendimiento y, si lo aceptas, personalizarlos según tus visitas a esta y a
        otras webs. También guardan tu elección en el aviso de consentimiento.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Para qué</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>__gads, __gpi, __eoi</td>
            <td>Publicidad: mostrar anuncios y medir su rendimiento.</td>
            <td>Hasta 13 meses</td>
          </tr>
          <tr>
            <td>IDE (doubleclick.net)</td>
            <td>Publicidad personalizada, solo con tu consentimiento.</td>
            <td>Hasta 13 meses</td>
          </tr>
          <tr>
            <td>FCCDCF, FCNEC</td>
            <td>Técnicas: guardar tus preferencias del aviso de cookies.</td>
            <td>Hasta 13 meses</td>
          </tr>
        </tbody>
      </table>
      <p>
        Google puede cambiar los nombres y plazos de sus cookies. Tienes la lista completa en{" "}
        <Ext href="https://policies.google.com/technologies/cookies">Cómo utiliza Google las cookies</Ext> y la forma en que
        trata los datos en{" "}
        <Ext href="https://policies.google.com/technologies/partner-sites">
          Cómo utiliza Google la información de los sitios que usan sus servicios
        </Ext>
        .
      </p>

      <h2>2. Cómo aceptarlas, rechazarlas o cambiar de opinión</h2>
      <p>
        La primera vez que entras, un aviso te deja aceptar, rechazar o elegir qué cookies permites. Rechazarlas no te
        impide usar Alter: seguirás viendo anuncios, pero no personalizados. Puedes cambiar tu elección cuando quieras:
      </p>
      <CookieSettingsButton />
      <p>También puedes:</p>
      <ul>
        <li>
          Desactivar la publicidad personalizada de Google en <Ext href="https://myadcenter.google.com/">Mi Centro de Anuncios</Ext>.
        </li>
        <li>
          Gestionar la de otros proveedores en <Ext href="https://www.youronlinechoices.com/es/">Your Online Choices</Ext>.
        </li>
        <li>
          Borrar o bloquear las cookies desde tu navegador:{" "}
          <Ext href="https://support.google.com/chrome/answer/95647?hl=es">Chrome</Ext>,{" "}
          <Ext href="https://support.mozilla.org/es/kb/Borrar%20cookies">Firefox</Ext>,{" "}
          <Ext href="https://support.apple.com/es-es/guide/safari/sfri11471/mac">Safari</Ext> o{" "}
          <Ext href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">
            Edge
          </Ext>
          .
        </li>
      </ul>

      <h2>3. Cambios en esta política</h2>
      <p>Si empezamos a usar otras cookies, actualizaremos esta página y te volveremos a pedir el consentimiento si hace falta.</p>
    </LegalPage>
  );
}
