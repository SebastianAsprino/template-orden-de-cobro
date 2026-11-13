# Plantilla de Orden de Cobro

Plantilla web para generar **órdenes de cobro** en pesos colombianos (COP) y descargarlas como PDF
con un clic. Construida con [Astro](https://astro.build) y un componente interactivo de React.

## Características

- Documento con encabezado del emisor, datos del cliente, tabla de ítems, totales y notas de pago.
- Cálculo automático de subtotal por ítem, subtotal general, IVA (19 %) y total en tiempo de build.
- Formato de moneda colombiano (`Intl.NumberFormat("es-CO", { currency: "COP" })`) y fecha del día en español.
- Botón **Descargar PDF**: captura el documento con `html2canvas`, lo convierte a JPEG comprimido y
  lo inserta en un PDF tamaño carta con `jsPDF`, paginando automáticamente si el contenido es largo.
  Muestra un estado "Generando PDF..." y avisa si la generación falla.
- El botón se oculta al imprimir (`@media print`), así que también se puede imprimir desde el navegador.

## Stack

- Astro 5 (salida estática)
- React 19 (isla `client:load` para el botón de descarga)
- jsPDF + html2canvas
- CSS plano (`src/styles/global.css`); el plugin de Tailwind CSS 4 está configurado para futuras vistas
- [Bun](https://bun.sh) como gestor de paquetes (`bun.lock`)

## Estructura

```text
.
├── public/                       # Archivos estáticos (favicon)
├── src/
│   ├── components/PdfDownload.jsx  # Botón que exporta #orden-cobro a PDF
│   ├── pages/index.astro           # La orden de cobro: datos, cálculos y maquetación
│   └── styles/global.css           # Estilos del documento y reglas de impresión
├── astro.config.mjs              # Integración de React y plugin de Tailwind
└── package.json
```

## Uso

```sh
bun install       # Instala dependencias
bun run dev       # Servidor de desarrollo en http://localhost:4321
bun run build     # Build estático en ./dist
bun run preview   # Sirve el build localmente
```

## Personalizar la orden

Todo el contenido está en `src/pages/index.astro`:

- **Ítems**: edita el arreglo `items` (`description`, `quantity`, `unitPrice`). Los totales se recalculan solos.
- **IVA**: cambia la constante `IVA_RATE`.
- **Emisor, cliente, número de orden y notas**: edita el HTML del documento.

El componente `PdfDownload` acepta las props `filename` (por defecto `orden-cobro.pdf`) y
`selector` (por defecto `#orden-cobro`) para exportar otro elemento o cambiar el nombre del archivo.

## Despliegue

`bun run build` genera un sitio estático en `dist/` que puede publicarse en cualquier hosting
estático (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).

## Integración continua

`.github/workflows/ci.yml` instala dependencias con Bun y ejecuta `bun run build` en cada push y
pull request a `master`.
