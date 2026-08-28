# Guía de configuración y despliegue

Esta guía cubre (1) la configuración de Google Cloud y de la hoja de cálculo (con sus 6 pestañas), (2) las variables de entorno y (3) el despliegue en Vercel. Sigue el mismo patrón que [`lsm-form`](https://github.com/La-Segunda-Mordida/lsm-form).

## 1. Google Cloud y Sheets

El formulario escribe en una hoja de Google Sheets usando una **cuenta de servicio** (server-to-server, sin intervención del usuario).

1. Entra a [Google Cloud Console](https://console.cloud.google.com/) y crea (o reutiliza) un proyecto.
2. En **APIs y servicios → Biblioteca**, habilita la **Google Sheets API**.
3. En **APIs y servicios → Credenciales**, crea una **Cuenta de servicio** (o reutiliza la de `lsm-form`).
4. Dentro de la cuenta de servicio, pestaña **Claves → Agregar clave → Crear clave nueva → JSON**. Se descargará un archivo JSON.
5. Del JSON necesitas dos campos:
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY`
6. Crea la hoja de cálculo destino (puede ser una nueva o reutilizar la de `lsm-form`, en una hoja de cálculo distinta) y **compártela** con el `client_email` de la cuenta de servicio, con permiso de **Editor**.
7. El `GOOGLE_SHEET_ID` es la parte de la URL de la hoja:
   `https://docs.google.com/spreadsheets/d/`**`<ESTE_ES_EL_ID>`**`/edit`
8. Crea **6 pestañas** con estos nombres exactos (el código escribe en `'<pestaña>'!A:Z`, ver `app/api/submit/route.ts`):

   | Pestaña | Formulario |
   |---|---|
   | `Asistencia` | Asistencia a sesiones |
   | `NPS - Sesiones` | NPS — Sesión presencial |
   | `NPS - Masterclass` | NPS — Masterclass |
   | `NPS - Mitad de Programa` | NPS — Mitad de programa |
   | `NPS - Cierre de Módulo` | NPS — Cierre de módulo |
   | `NPS - Fin del Programa` | NPS — Fin del programa |

   Si prefieres otros nombres, ajusta el objeto `SHEET_TABS` en `app/api/submit/route.ts`.

9. Recomendado: agrega una fila de encabezados en cada pestaña con las columnas documentadas en el [README](../README.md), para que los datos sean legibles.

## 2. Variables de entorno

| Variable | Origen |
|----------|--------|
| `GOOGLE_SHEET_ID` | URL de la hoja |
| `GOOGLE_CLIENT_EMAIL` | Campo `client_email` del JSON |
| `GOOGLE_PRIVATE_KEY` | Campo `private_key` del JSON |

Para **local**, ponlas en `.env.local` (copia `.env.local.example`). La clave privada debe ir entre comillas y con los saltos de línea escapados como `\n`:

```
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 3. Despliegue en Vercel

### Crear el proyecto y subirlo a GitHub

1. Crea un repositorio nuevo en GitHub (por ejemplo `La-Segunda-Mordida/lsm-nps-form`, siguiendo el mismo naming que `lsm-form`).
2. Desde esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Formularios de asistencia y NPS"
   git branch -M main
   git remote add origin https://github.com/La-Segunda-Mordida/lsm-nps-form.git
   git push -u origin main
   ```

### Variables de entorno en Vercel

En **Project → Settings → Environment Variables** agrega las tres variables para los entornos **Production**, **Preview** y **Development**.

Al pegar `GOOGLE_PRIVATE_KEY` en Vercel puedes pegar la clave con saltos de línea reales o con `\n` escapados; el código soporta ambos gracias al `.replace(/\\n/g, "\n")` en `lib/sheets.ts`.

### Conectar el repositorio de Git (despliegue continuo)

1. En [vercel.com](https://vercel.com/new), **Import Project** y elige el repositorio de GitHub.
2. Requisitos: la app de **Vercel para GitHub** debe estar instalada en la organización/cuenta dueña del repositorio.
3. A partir de ahí, los `push` a la rama de producción (`main`) crean despliegues de producción, y las ramas o PRs generan despliegues de *preview*.

### Despliegue manual (CLI)

Alternativamente, sin conexión con Git:

```bash
npm i -g vercel
vercel        # despliegue de preview
vercel --prod # despliegue de producción
```

## Notas

- El roster de Wises, grupos y members (`lib/data.ts`) está copiado del Excel `Form Asistencia y NPS.xlsx`. Si cambian los grupos o quién los lidera, edita ese archivo.
- No subas archivos `.env*` ni la carpeta `.vercel/` al repositorio (ya están en `.gitignore`).
