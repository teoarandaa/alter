/**
 * Guías de compra de segunda mano (/guias/[slug]).
 *
 * Son la parte de la web que más tráfico de Google puede traer: responden a lo que la gente busca
 * antes de comprar algo usado. Para que Google las valore tienen que ser útiles de verdad:
 * - Empezar por la respuesta (el «En resumen»), y luego el detalle.
 * - Consejos concretos y comprobables, nada de relleno ni de cifras inventadas.
 * - Actualizar `modified` cada vez que se revise una guía.
 *
 * Para añadir una guía: copia una entrada, cambia el slug y el texto, y enlázala en `related`
 * de otras guías parecidas. Aparece sola en /guias y en el sitemap.
 */
import Link from "next/link";
import type { ReactNode } from "react";

export type Guide = {
  slug: string;
  /** Nombre corto para menús (pie de página). */
  navLabel: string;
  /** Título visible (H1). */
  title: string;
  /** Título para Google (sin « · Alter»): ~50 caracteres como máximo. */
  metaTitle: string;
  /** Descripción para Google: ~155 caracteres. */
  description: string;
  /** Texto corto para la tarjeta en /guias. */
  excerpt: string;
  /** Fechas ISO (AAAA-MM-DD). */
  published: string;
  modified: string;
  readingMinutes: number;
  /** Respuesta directa al principio: lo esencial en 3–5 puntos. */
  summary: string[];
  /** Botón para buscar en Alter con el texto ya escrito. */
  search: { label: string; query: string };
  /** Webs de /plataformas que encajan con la guía (claves de lib/platforms.ts). */
  platforms: string[];
  /** Otras guías relacionadas (slugs). */
  related: string[];
  body: ReactNode;
};

export const GUIDES: Guide[] = [
  {
    slug: "comprar-segunda-mano-sin-riesgos",
    navLabel: "Comprar sin estafas",
    title: "Cómo comprar de segunda mano sin que te estafen",
    metaTitle: "Cómo comprar de segunda mano sin que te estafen",
    description:
      "Guía para comprar en Wallapop, Vinted, Milanuncios o eBay sin sustos: cómo detectar estafas, cómo pagar de forma segura y qué revisar antes de cerrar el trato.",
    excerpt: "Cómo pagar, qué estafas son las más comunes y qué derechos tienes al comprar a un particular o a una tienda.",
    published: "2026-11-27",
    modified: "2026-11-27",
    readingMinutes: 7,
    summary: [
      "Paga dentro de la plataforma (con su envío o pago protegido) o en mano después de revisar el producto. Nunca por adelantado con transferencia o Bizum a un desconocido.",
      "No salgas de la app para hablar con el vendedor ni abras enlaces de pago que te envíen por WhatsApp, SMS o correo: es el engaño más habitual.",
      "Desconfía de los precios muy por debajo de lo normal, de las prisas y de los perfiles sin valoraciones.",
      "Si quedas en persona, hazlo en un sitio público y prueba el producto antes de pagar.",
    ],
    search: { label: "Buscar de segunda mano", query: "" },
    platforms: ["wallapop", "vinted", "milanuncios", "ebay"],
    related: ["movil-segunda-mano", "portatil-segunda-mano", "muebles-segunda-mano"],
    body: (
      <>
        <h2>Antes de escribir al vendedor</h2>
        <p>
          La mayoría de los problemas se evitan antes de hablar con nadie. Dedica dos minutos a estas comprobaciones:
        </p>
        <ul>
          <li>
            <strong>Compara el precio.</strong> Si un producto cuesta mucho menos que en el resto de anuncios, pregúntate por
            qué. Con <Link href="/buscar">Alter</Link> ves de un vistazo lo que piden por lo mismo en varias webs a la vez.
          </li>
          <li>
            <strong>Mira el perfil.</strong> Valoraciones, antigüedad de la cuenta y qué más vende. Un perfil recién creado
            con un solo artículo muy deseado es una señal de alerta.
          </li>
          <li>
            <strong>Fíjate en las fotos.</strong> Las fotos de catálogo o sacadas de internet no demuestran que el vendedor
            tenga el producto. Si dudas, pídele una foto nueva con un papel con tu nombre y la fecha.
          </li>
          <li>
            <strong>Lee la descripción entera.</strong> Muchos vendedores avisan ahí de defectos, de si hacen envíos o de si
            el precio es negociable.
          </li>
        </ul>

        <h2>Cómo pagar de forma segura</h2>
        <p>
          La regla es sencilla: <strong>paga siempre por un camino que te permita reclamar</strong>.
        </p>
        <h3>Si te lo envían</h3>
        <p>
          Usa el envío o el pago protegido de la propia plataforma: los envíos de Wallapop, la protección al comprador de
          Vinted o la garantía al cliente de eBay. Con ellos el dinero no le llega al vendedor hasta que recibes el paquete
          y confirmas que todo está bien. Así, si no llega o no es lo que se anunciaba, puedes abrir una reclamación.
        </p>
        <h3>Si lo recoges en persona</h3>
        <p>
          Paga en el momento, en efectivo o con Bizum, <strong>después</strong> de haber revisado y probado el producto.
        </p>
        <h3>Lo que nunca debes hacer</h3>
        <ul>
          <li>Pagar por adelantado con transferencia o Bizum a alguien que no conoces para que «te lo reserve» o «te lo envíe».</li>
          <li>Pagar a través de un enlace que te manda el vendedor, aunque parezca la página de la plataforma o de una empresa de mensajería.</li>
          <li>Pagar con tarjetas regalo, criptomonedas o servicios de envío de dinero.</li>
          <li>Dar los datos de tu tarjeta o códigos que te lleguen por SMS para «recibir» un pago.</li>
        </ul>

        <h2>Las estafas más habituales</h2>
        <ul>
          <li>
            <strong>El enlace falso.</strong> El vendedor (o un supuesto comprador) te pide seguir la conversación por
            WhatsApp y te manda un enlace a una página que imita a la plataforma o a una mensajería. Ahí te piden la tarjeta.
            Las plataformas nunca gestionan pagos fuera de su app o su web.
          </li>
          <li>
            <strong>El chollo con prisas.</strong> Precio muy bajo, «tengo muchos interesados» y presión para que pagues ya.
            La prisa sirve para que no compruebes nada.
          </li>
          <li>
            <strong>El vendedor que está lejos.</strong> No puede quedar, el producto está en otra ciudad y solo acepta
            transferencia. Si de verdad quiere vender, aceptará el envío protegido de la plataforma.
          </li>
          <li>
            <strong>El falso transportista.</strong> Te escribe una supuesta empresa de mensajería que pide un pago o tus datos
            para entregarte el paquete. Comprueba siempre el seguimiento dentro de la app.
          </li>
          <li>
            <strong>Las imitaciones.</strong> En productos de marca (bolsos, zapatillas, auriculares), pide fotos de etiquetas,
            números de serie y del ticket. Para moda de lujo, plataformas como Vestiaire Collective verifican la autenticidad.
          </li>
        </ul>

        <h2>Si quedáis en persona</h2>
        <ul>
          <li>Queda en un sitio público y concurrido, de día, y si puedes ve acompañado.</li>
          <li>Prueba el producto: enciéndelo, cárgalo, pruébate la ropa o siéntate en el sofá. Lo que no compruebes allí difícilmente lo podrás reclamar después.</li>
          <li>En aparatos electrónicos, pide que lo restablezca de fábrica delante de ti para asegurarte de que no queda bloqueado con su cuenta.</li>
          <li>Si el precio es alto, pide un justificante de compra o la factura original: demuestra que el producto es suyo.</li>
        </ul>

        <h2>Qué derechos tienes</h2>
        <p>Depende de a quién le compres:</p>
        <ul>
          <li>
            <strong>A una tienda o vendedor profesional</strong> (también los reacondicionados): tienes garantía legal. En
            productos de segunda mano, la tienda puede acordar contigo un plazo más corto que en uno nuevo, pero nunca inferior a
            un año. Si compras por internet, además, tienes 14 días para devolverlo sin dar explicaciones.
          </li>
          <li>
            <strong>A un particular</strong>: no hay garantía de consumo. Te protegen la reclamación de la plataforma, si has
            pagado a través de ella, y el Código Civil si el producto tenía defectos ocultos que no podías ver al comprarlo.
          </li>
        </ul>

        <h2>Si algo sale mal</h2>
        <ol>
          <li>No confirmes la recepción en la app hasta haber revisado el pedido.</li>
          <li>Abre una reclamación en la plataforma cuanto antes: suelen tener plazos cortos.</li>
          <li>Guarda la conversación, los anuncios y los justificantes de pago.</li>
          <li>Si has dado los datos de tu tarjeta, llama a tu banco para bloquearla.</li>
          <li>Si te han estafado, denúncialo a la Policía Nacional o a la Guardia Civil.</li>
        </ol>
      </>
    ),
  },
  {
    slug: "movil-segunda-mano",
    navLabel: "Móviles",
    title: "Comprar un móvil de segunda mano: qué revisar antes de pagar",
    metaTitle: "Comprar un móvil de segunda mano: qué revisar",
    description:
      "Qué comprobar antes de comprar un móvil usado o reacondicionado: IMEI, bloqueo de iCloud o Google, batería, pantalla y garantía. Lista de revisión paso a paso.",
    excerpt: "IMEI, bloqueos de cuenta, batería y la prueba de 10 minutos antes de pagar por un móvil usado o reacondicionado.",
    published: "2026-11-27",
    modified: "2026-11-27",
    readingMinutes: 6,
    summary: [
      "Comprueba que el IMEI coincide con el de la caja y que el móvil no está bloqueado por robo o pérdida.",
      "Asegúrate de que no tiene ninguna cuenta de iCloud o Google vinculada: si la tiene, no podrás usarlo.",
      "Mira el estado de la batería y prueba pantalla, cámaras, altavoces, micrófono y carga.",
      "Un reacondicionado de tienda suele costar algo más que uno de particular, pero tiene garantía de al menos un año.",
    ],
    search: { label: "Buscar un móvil de segunda mano", query: "iPhone 13 128 GB" },
    platforms: ["backmarket", "refurbed", "amazonrenewed", "cex", "wallapop", "ebay"],
    related: ["comprar-segunda-mano-sin-riesgos", "portatil-segunda-mano"],
    body: (
      <>
        <h2>Particular, tienda o reacondicionado</h2>
        <ul>
          <li>
            <strong>De particular</strong> (Wallapop, Milanuncios, eBay): suele ser lo más barato, pero no tiene garantía
            legal y todo depende de lo que revises tú.
          </li>
          <li>
            <strong>Reacondicionado</strong> (Back Market, Refurbed, los reacondicionados de Amazon o CeX): lo revisa un
            profesional, se clasifica según su estado estético y tiene garantía de al menos un año. Es la opción más tranquila
            si no quieres hacer comprobaciones.
          </li>
        </ul>
        <p>
          Sea cual sea la opción, compara el mismo modelo, con la misma capacidad y en un estado parecido: la diferencia de
          precio entre webs puede ser grande.
        </p>

        <h2>1. El IMEI</h2>
        <p>
          El IMEI es el número que identifica cada móvil. Puedes verlo marcando <strong>*#06#</strong> o en los ajustes, y
          debe coincidir con el de la caja y la factura. Pídeselo al vendedor antes de quedar y compruébalo con un servicio de
          verificación de IMEI: si el móvil está denunciado por robo o pérdida, los operadores pueden bloquearlo y dejará de
          funcionar con cualquier SIM.
        </p>

        <h2>2. Que no tenga ninguna cuenta vinculada</h2>
        <p>Es el problema más grave, porque deja el móvil inservible:</p>
        <ul>
          <li>
            <strong>iPhone:</strong> el vendedor debe cerrar su sesión de iCloud y desactivar «Buscar mi iPhone». Si no, el
            Bloqueo de activación pedirá su contraseña al restablecerlo.
          </li>
          <li>
            <strong>Android:</strong> tiene que eliminar su cuenta de Google antes de borrar el móvil; si no, la protección
            contra el restablecimiento de fábrica pedirá esa cuenta.
          </li>
        </ul>
        <p>
          Lo más seguro es pedirle que lo restablezca de fábrica delante de ti y comprobar que llega a la pantalla de
          bienvenida sin pedir ninguna cuenta.
        </p>

        <h2>3. La batería</h2>
        <p>
          En iPhone, entra en <strong>Ajustes › Batería › Estado y carga</strong> y mira la capacidad máxima. Por debajo del
          80 % la batería está desgastada: cuenta con cambiarla y descuéntalo del precio. En Android depende de la marca:
          muchos la muestran en los ajustes de batería o en la app de diagnóstico del fabricante (en Samsung, Samsung Members).
        </p>

        <h2>4. La prueba de 10 minutos</h2>
        <ul>
          <li><strong>Pantalla:</strong> busca manchas, píxeles muertos o zonas amarillentas con un fondo blanco y otro negro. Arrastra un icono por toda la pantalla para comprobar el táctil.</li>
          <li><strong>Face ID o huella:</strong> configúralos y prueba que funcionan.</li>
          <li><strong>Cámaras:</strong> haz una foto y un vídeo con cada cámara, incluida la frontal, y prueba el enfoque y el flash.</li>
          <li><strong>Sonido:</strong> graba una nota de voz y escúchala, y haz una llamada con el altavoz.</li>
          <li><strong>Carga:</strong> enchúfalo con un cable y, si la tiene, prueba la carga inalámbrica.</li>
          <li><strong>Conexiones:</strong> mete tu SIM para ver que está libre y tiene cobertura, y prueba el wifi y el Bluetooth.</li>
          <li><strong>Botones:</strong> volumen, encendido y, si lo tiene, el interruptor de silencio.</li>
        </ul>
        <p>
          En los iPhone recientes, <strong>Ajustes › General › Información</strong> muestra el historial de piezas y
          reparaciones: así sabes si le han cambiado la pantalla o la batería por piezas que no son originales.
        </p>

        <h2>5. Garantía y factura</h2>
        <p>
          Si compras a una tienda, tienes garantía de al menos un año y, si es por internet, 14 días para devolverlo. Si
          compras a un particular, pide la factura original: demuestra que el móvil es suyo y a veces aún le queda garantía del
          fabricante.
        </p>
      </>
    ),
  },
  {
    slug: "portatil-segunda-mano",
    navLabel: "Portátiles",
    title: "Comprar un portátil de segunda mano: guía para acertar",
    metaTitle: "Comprar un portátil de segunda mano: qué revisar",
    description:
      "Cómo elegir y revisar un portátil usado o reacondicionado: batería, bloqueos de cuenta, teclado, pantalla y qué especificaciones necesitas para que te dure años.",
    excerpt: "Qué especificaciones buscar, cómo ver el desgaste de la batería en Windows y Mac y qué probar antes de pagar.",
    published: "2026-11-27",
    modified: "2026-11-27",
    readingMinutes: 6,
    summary: [
      "Para que te dure varios años, busca al menos 16 GB de RAM (8 GB para un uso básico) y disco SSD.",
      "Comprueba el desgaste de la batería: en Windows con un informe de batería y en Mac en la información del sistema.",
      "Asegúrate de que no está bloqueado por una cuenta de Apple, de Microsoft o de una empresa, ni con contraseña de BIOS.",
      "Prueba teclado, touchpad, pantalla, puertos, webcam y que no se calienta ni hace ruidos raros.",
    ],
    search: { label: "Buscar un portátil de segunda mano", query: "MacBook Air M1" },
    platforms: ["backmarket", "refurbed", "amazonrenewed", "cex", "rebuy", "wallapop"],
    related: ["movil-segunda-mano", "comprar-segunda-mano-sin-riesgos"],
    body: (
      <>
        <h2>Qué portátil necesitas</h2>
        <ul>
          <li>
            <strong>Memoria (RAM):</strong> 8 GB bastan para navegar y ofimática; 16 GB es lo recomendable para que vaya fluido
            varios años.
          </li>
          <li>
            <strong>Disco:</strong> siempre SSD. Un disco duro mecánico hace que cualquier portátil se sienta lento.
          </li>
          <li>
            <strong>Windows:</strong> Windows 10 dejó de recibir actualizaciones en octubre de 2025, así que el portátil debe
            ser compatible con Windows 11 (procesador relativamente reciente y chip TPM 2.0). Pregunta qué versión tiene
            instalada.
          </li>
          <li>
            <strong>Mac:</strong> mejor con chip de Apple (M1 o posterior) que con procesador Intel: son más eficientes y
            recibirán actualizaciones durante más tiempo.
          </li>
        </ul>

        <h2>La batería</h2>
        <p>Es lo que más se desgasta y lo que más cuesta cambiar. Compruébala así:</p>
        <ul>
          <li>
            <strong>Windows:</strong> abre el Símbolo del sistema, escribe <code>powercfg /batteryreport</code> y abre el
            informe que genera. Compara la capacidad de diseño («Design capacity») con la capacidad de carga completa actual
            («Full charge capacity»): cuanto más se acerquen, mejor.
          </li>
          <li>
            <strong>Mac:</strong> en <strong>Información del sistema › Alimentación</strong> verás el número de ciclos y el
            estado de la batería.
          </li>
        </ul>
        <p>Pruébalo también unos minutos sin enchufar para ver que la carga no cae de golpe.</p>

        <h2>Bloqueos y portátiles de empresa</h2>
        <ul>
          <li>
            <strong>Mac:</strong> el vendedor debe cerrar su sesión de Apple y desactivar «Buscar mi Mac»; si no, el Bloqueo de
            activación lo dejará inservible.
          </li>
          <li>
            <strong>Portátiles de empresa:</strong> algunos están gestionados a distancia por la empresa. En Windows, mira en
            Configuración › Cuentas › «Obtener acceso a trabajo o escuela»; en Mac, en Configuración del Sistema › General ›
            «Gestión de dispositivos». Si aparece una organización, no lo compres.
          </li>
          <li>
            <strong>BIOS:</strong> al encender, no debería pedir ninguna contraseña antes de arrancar el sistema.
          </li>
        </ul>
        <p>Lo ideal es que el sistema esté recién instalado y lo configures tú desde cero.</p>

        <h2>Qué probar antes de pagar</h2>
        <ul>
          <li><strong>Teclado:</strong> abre un editor de texto y pulsa todas las teclas, incluidas las de función.</li>
          <li><strong>Touchpad:</strong> clic, desplazamiento con dos dedos y arrastrar.</li>
          <li><strong>Pantalla:</strong> manchas, píxeles muertos y que las bisagras sujeten firme en cualquier ángulo.</li>
          <li><strong>Puertos:</strong> USB, HDMI, auriculares y el puerto de carga, con algo que lleves tú.</li>
          <li><strong>Webcam, micrófono y altavoces:</strong> una videollamada de prueba lo comprueba todo a la vez.</li>
          <li><strong>Temperatura y ventilador:</strong> abre varias pestañas o un vídeo en alta calidad unos minutos; no debería ponerse a tope ni hacer ruidos raros.</li>
          <li><strong>Cargador:</strong> que sea el original o de la misma potencia.</li>
        </ul>

        <h2>Dónde comprarlo</h2>
        <p>
          Los reacondicionados (Back Market, Refurbed, Amazon, CeX o Rebuy) cuestan algo más, pero llegan revisados y con
          garantía. A un particular te puede salir más barato, siempre que hagas tú todas estas comprobaciones.
        </p>
      </>
    ),
  },
  {
    slug: "bicicleta-segunda-mano",
    navLabel: "Bicicletas",
    title: "Comprar una bicicleta de segunda mano: qué revisar",
    metaTitle: "Comprar una bicicleta de segunda mano: guía",
    description:
      "Cómo elegir la talla, revisar cuadro, transmisión, frenos y ruedas, y evitar comprar una bici robada. Con consejos para bicicletas eléctricas de segunda mano.",
    excerpt: "Talla, cuadro, transmisión y frenos, cómo evitar una bici robada y qué mirar en una eléctrica.",
    published: "2026-11-27",
    modified: "2026-11-27",
    readingMinutes: 6,
    summary: [
      "Elige la talla correcta antes que la marca: una bici que no es de tu talla nunca será cómoda.",
      "Revisa el cuadro (grietas y golpes), la transmisión (cadena, piñones y platos) y los frenos.",
      "Pide la factura y comprueba el número de bastidor para no comprar una bici robada.",
      "Pruébala montado: cambios, frenada y ruidos. En una eléctrica, lo más importante es la batería.",
    ],
    search: { label: "Buscar una bici de segunda mano", query: "bicicleta de montaña talla M" },
    platforms: ["wallapop", "milanuncios", "ebay"],
    related: ["comprar-segunda-mano-sin-riesgos", "muebles-segunda-mano"],
    body: (
      <>
        <h2>Primero, la talla</h2>
        <p>
          Cada fabricante tiene su tabla de tallas según tu altura y la longitud de tus piernas, y varían de una marca a otra.
          Busca la del modelo concreto antes de quedar. Al probarla, deberías poder apoyar los pies en el suelo con la bici
          entre las piernas y llegar al manillar sin estirarte del todo.
        </p>

        <h2>El cuadro</h2>
        <ul>
          <li>
            <strong>Carbono:</strong> revísalo con buena luz, sobre todo en las uniones y cerca de la dirección. Una grieta en
            carbono es peligrosa y no siempre se ve a simple vista: desconfía si la bici ha tenido una caída fuerte.
          </li>
          <li>
            <strong>Aluminio y acero:</strong> busca grietas junto a las soldaduras, abolladuras y, en acero, óxido por dentro
            de los tubos.
          </li>
        </ul>

        <h2>Transmisión, frenos y ruedas</h2>
        <ul>
          <li>
            <strong>Cadena y piñones:</strong> una cadena estirada se sale de los dientes o salta al pedalear con fuerza. Si los
            dientes de los piñones tienen forma de aleta de tiburón, están gastados y habrá que cambiarlos junto con la cadena.
          </li>
          <li><strong>Cambios:</strong> pasa por todas las marchas; deben entrar sin ruidos ni saltos.</li>
          <li>
            <strong>Frenos:</strong> la maneta no debe llegar hasta el puño. Mira el grosor de las pastillas y, en frenos de
            disco, que los discos no estén torcidos.
          </li>
          <li>
            <strong>Ruedas:</strong> hazlas girar y mira si la llanta baila de lado a lado. Revisa que no falten radios y el
            estado de las cubiertas.
          </li>
          <li>
            <strong>Suspensión:</strong> si tiene, comprime la horquilla: no debe perder aceite ni hacer golpes secos.
          </li>
        </ul>

        <h2>Cómo evitar comprar una bici robada</h2>
        <ul>
          <li>Pide la factura o un justificante de compra a nombre del vendedor.</li>
          <li>
            Busca el número de bastidor, que suele estar grabado bajo el pedalier, y comprueba que no está borrado ni limado.
          </li>
          <li>Si la bici está inscrita en un registro de bicicletas como Biciregistro, comprueba que no conste como robada.</li>
          <li>Desconfía de precios muy bajos en bicis caras, de vendedores que no saben nada de ella y de las prisas.</li>
        </ul>

        <h2>Si es eléctrica</h2>
        <p>
          La batería es la pieza más cara de una bici eléctrica. Pregunta su antigüedad y cuánta autonomía tiene ahora, pide
          el cargador original y, si puedes, haz una prueba con la batería cargada. Escucha el motor (no debería hacer ruidos
          metálicos) y pide la factura: muchas marcas solo dan servicio técnico con ella.
        </p>

        <h2>La prueba final</h2>
        <p>
          Da una vuelta de varios minutos: cambia de marcha subiendo, frena fuerte y escucha. Los crujidos suelen venir de la
          dirección, el pedalier o la tija, y conviene saberlo antes de pagar.
        </p>
      </>
    ),
  },
  {
    slug: "muebles-segunda-mano",
    navLabel: "Muebles",
    title: "Comprar muebles de segunda mano: consejos para acertar",
    metaTitle: "Comprar muebles de segunda mano: consejos",
    description:
      "Qué revisar antes de comprar muebles usados: medidas, materiales, carcoma, chinches en sofás y colchones, y cómo organizar el transporte para no llevarte sorpresas.",
    excerpt: "Medidas, materiales, cómo detectar carcoma o chinches y cómo organizar el transporte.",
    published: "2026-11-27",
    modified: "2026-11-27",
    readingMinutes: 5,
    summary: [
      "Mide el hueco donde irá el mueble, y también las puertas, el pasillo y el ascensor por donde tiene que pasar.",
      "Revisa estructura, cajones, bisagras y patas; en madera, busca agujeritos y serrín, que delatan la carcoma.",
      "En sofás, colchones y muebles tapizados, mira costuras y pliegues con una linterna para descartar chinches.",
      "Organiza el transporte antes de pagar: muchos vendedores no ayudan a bajarlo.",
    ],
    search: { label: "Buscar muebles de segunda mano", query: "sofá de tres plazas" },
    platforms: ["wallapop", "milanuncios", "todocoleccion", "etsyvintage"],
    related: ["comprar-segunda-mano-sin-riesgos", "bicicleta-segunda-mano"],
    body: (
      <>
        <h2>Las medidas, antes que nada</h2>
        <p>
          Pide al vendedor las medidas exactas (alto, ancho y fondo) y compáralas con el hueco donde irá el mueble. Mide
          también el recorrido: puertas, pasillos, giros de la escalera y el ascensor. Muchos sofás no caben por la puerta de
          casa, aunque quepan en el salón.
        </p>

        <h2>Madera maciza o aglomerado</h2>
        <ul>
          <li>
            <strong>Madera maciza:</strong> aguanta décadas y se puede lijar y restaurar. Es lo que mejor compensa comprar de
            segunda mano.
          </li>
          <li>
            <strong>Aglomerado y DM:</strong> más baratos, pero sufren con la humedad (se hinchan) y cada vez que se desmontan y
            se vuelven a montar. Si el mueble hay que desmontarlo, guarda los tornillos en una bolsa y busca las instrucciones:
            las de IKEA, por ejemplo, se pueden descargar en su web con el nombre del producto.
          </li>
        </ul>

        <h2>Qué revisar en persona</h2>
        <ul>
          <li><strong>Estructura:</strong> empuja el mueble por arriba; no debe balancearse ni crujir.</li>
          <li><strong>Cajones y puertas:</strong> que abran y cierren bien, y que las bisagras y guías no estén sueltas.</li>
          <li><strong>Carcoma:</strong> agujeritos redondos y serrín fino alrededor son señal de que hay o hubo insectos en la madera.</li>
          <li><strong>Humedad:</strong> manchas oscuras, olor a cerrado o a moho, sobre todo en la parte de atrás y en los bajos.</li>
        </ul>

        <h2>Sofás, colchones y tapizados</h2>
        <p>
          Además del estado de la tela y de los cojines, revisa con una linterna las costuras, los pliegues y los bajos. Unas
          manchitas oscuras o pequeñas pieles de insecto pueden indicar chinches, que se esconden en tapizados y colchones y
          cuesta mucho eliminar de casa. Si tienes dudas, no lo compres. Si lo compras, límpialo a fondo (el vapor ayuda)
          antes de meterlo en casa.
        </p>

        <h2>El transporte</h2>
        <p>
          Antes de pagar, pregunta en qué piso está, si hay ascensor y si el vendedor ayudará a bajarlo. Si no tienes vehículo,
          puedes alquilar una furgoneta por horas o contratar un servicio de transporte de muebles. Incluye ese coste al
          comparar el precio con el de un mueble nuevo.
        </p>

        <h2>Muebles vintage y antigüedades</h2>
        <p>
          Para piezas con historia, además de Wallapop y Milanuncios, merece la pena mirar Todocolección y la sección vintage
          de Etsy. En muebles antiguos, valora si te merece la pena restaurarlos: lijar, tratar la madera y cambiar herrajes
          lleva tiempo, pero el resultado suele ser único.
        </p>
      </>
    ),
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
