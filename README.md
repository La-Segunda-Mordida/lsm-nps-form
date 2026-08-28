# La Segunda Mordida — Asistencia y NPS

Formularios web de **asistencia a sesiones** y **encuestas NPS** de La Segunda Mordida (LSM). Reemplazan el `Form Asistencia y NPS.xlsx` (pensado para armar formularios de Google Forms) por una web app propia, en el mismo stack y estilo visual que [`lsm-form`](https://github.com/La-Segunda-Mordida/lsm-form) (el formulario de registro de miembros).

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **googleapis** (Google Sheets API v4) para la persistencia
- Despliegue en **Vercel**

## Estructura del proyecto

```
app/
  layout.tsx              Layout raíz, tipografías (Anton, Kanit) y metadatos
  page.tsx                Menú de inicio con los 6 formularios
  success/page.tsx        Pantalla de confirmación genérica
  asistencia/page.tsx     Formulario de asistencia (Wise → Grupo → checklist de members)
  nps/sesion/page.tsx           NPS — Sesión presencial
  nps/masterclass/page.tsx      NPS — Masterclass (sesión virtual)
  nps/mitad-programa/page.tsx   NPS — Mitad de programa
  nps/cierre-modulo/page.tsx    NPS — Cierre de módulo
  nps/fin-programa/page.tsx     NPS — Fin del programa
  api/submit/route.ts     Route Handler (POST) único: arma la fila según el tipo de formulario
  globals.css             Tema y variables de color de marca (LSM)
components/
  FormControls.tsx        Field, TextInput, TextArea, SelectInput, RadioGroup, CheckboxGroup, QuestionCard
  Scales.tsx               ScaleRow (escala 1–5) y NpsScale (escala 0–10 / 1–10)
  NpsHeader.tsx            Encabezado compartido de las encuestas NPS
lib/
  sheets.ts                Cliente de Google Sheets: appendToSheet(pestaña, filas)
  data.ts                  Wises, grupos, roster de members y módulos (extraído del xlsx)
public/
  logo.png                 Logotipo de la marca
docs/
  DESPLIEGUE.md             Guía de configuración de Google Sheets y despliegue
```

## Los 6 formularios

1. **Asistencia** (`/asistencia`): el Wise elige su nombre, luego el grupo (filtrado según el Wise), marca qué members asistieron y deja observaciones.
2. **NPS — Sesión presencial** (`/nps/sesion`): grupo, módulo, 4 preguntas de escala 1–5, insight abierto (3 campos), NPS 0–10 y mensaje al Wise.
3. **NPS — Masterclass** (`/nps/masterclass`): igual que el anterior, pero con "ponente" en vez de módulo y "curador" en vez de Wise.
4. **NPS — Mitad de programa** (`/nps/mitad-programa`): NPS del programa (1–10), qué mejorar, insight abierto, NPS de la sesión (0–10), mensaje al Wise.
5. **NPS — Cierre de módulo** (`/nps/cierre-modulo`): módulo cerrado, NPS del módulo (1–10), lo más valioso, qué cambiarías, claridad del Wise (1–10), comentario.
6. **NPS — Fin del programa** (`/nps/fin-programa`): NPS de todo LSM (1–10) y 4 preguntas abiertas de cierre.

Cada uno hace `POST /api/submit` con `{ type, data }`. El Route Handler arma la fila (con `id` tipo `LSM-<timestamp>` y `fecha` ISO) y la agrega a la pestaña de Google Sheets correspondiente vía `appendToSheet()`. Al terminar, redirige a `/success`.

### Columnas por pestaña

- **Asistencia**: `id`, `fecha`, `fecha_sesion`, `wise`, `grupo`, `asistentes`, `inasistentes`, `n_asistentes`, `n_total`, `observaciones`.
- **NPS - Sesiones**: `id`, `fecha`, `grupo`, `modulo`, `rating_contenido_claro`, `rating_contenido_relevante`, `rating_wise_claro`, `rating_wise_participativo`, `insight_valioso`, `insight_no_cerro`, `insight_recomendaciones`, `nps_contenido`, `mensaje_wise`.
- **NPS - Masterclass**: `id`, `fecha`, `grupo`, `ponente`, `rating_contenido_claro`, `rating_contenido_valor`, `rating_curador_claro`, `rating_curador_atencion`, `insight_valioso`, `insight_no_cerro`, `insight_recomendaciones`, `nps_contenido`, `pregunta_curador`.
- **NPS - Mitad de Programa**: `id`, `fecha`, `grupo`, `nps_programa`, `mejorar_una_cosa`, `insight_valioso`, `insight_no_cerro`, `insight_recomendaciones`, `nps_sesion`, `mensaje_wise`.
- **NPS - Cierre de Módulo**: `id`, `fecha`, `grupo`, `modulo`, `nps_modulo`, `mas_valioso`, `que_cambiarias`, `claridad_wise`, `comentario_wise`.
- **NPS - Fin del Programa**: `id`, `fecha`, `grupo`, `nps_lsm`, `por_que_puntuacion`, `mas_valioso`, `no_recomendarias`, `comentario`.

## Grupos y Wises

Extraído del `Form Asistencia y NPS.xlsx` (`lib/data.ts`):

| Grupo | Wise a cargo |
|---|---|
| G2, G3 | Mirian Lau |
| G4, G8 | Mari Perales |
| G5, G9 | Carolina Lazarte |
| G7 | Jessica Carrión |

El roster de members por grupo está en la misma constante (`MIEMBROS`). Si cambian los grupos, edita `lib/data.ts`.

## Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

| Variable | Descripción |
|----------|-------------|
| `GOOGLE_SHEET_ID` | ID de la hoja de cálculo destino (parte de la URL de Google Sheets) |
| `GOOGLE_CLIENT_EMAIL` | Email de la cuenta de servicio de Google |
| `GOOGLE_PRIVATE_KEY` | Clave privada de la cuenta de servicio (con `\n` escapados) |

La hoja debe estar compartida con el email de la cuenta de servicio con permiso de edición, y debe tener las 6 pestañas listadas arriba. Ver [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) para el paso a paso completo (incluye cómo crear la cuenta de servicio si es la primera vez).

> Los archivos `.env*` están en `.gitignore` y nunca deben subirse al repositorio.

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local   # y completa los valores
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |

## Despliegue

Igual que `lsm-form`: sube el proyecto a un repositorio de GitHub y conéctalo en Vercel. Las tres variables de entorno anteriores deben configurarse en **Vercel → Project → Settings → Environment Variables**. Consulta [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) para el detalle.

## Licencia

Proyecto privado de La Segunda Mordida. Todos los derechos reservados.
