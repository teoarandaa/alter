/**
 * Datos del titular de la web para el aviso legal y la política de privacidad.
 *
 * El nombre, el NIF y la dirección se leen de variables de entorno (frontend/.env.local en local
 * y las variables de entorno del hosting al publicar), para que no queden en el repositorio.
 * La LSSI obliga a mostrarlos: si falta alguno, la web enseña un hueco «[…]» resaltado en amarillo.
 *
 * Solo se pueden usar en componentes de servidor: no llevan el prefijo NEXT_PUBLIC_.
 */
export const LEGAL = {
  owner: process.env.ALTER_LEGAL_OWNER || "[Nombre y apellidos o razón social]",
  taxId: process.env.ALTER_LEGAL_TAX_ID || "[NIF]",
  address: process.env.ALTER_LEGAL_ADDRESS || "[Dirección postal completa]",
  email: "hola@alter2mano.es",
  domain: "alter2mano.es",
  updated: "26 de noviembre de 2026",
};

export const LEGAL_PAGES = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
];
