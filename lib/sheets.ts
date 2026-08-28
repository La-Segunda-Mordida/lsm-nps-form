import { google } from "googleapis";

/**
 * Añade una fila a una pestaña (tab) de la hoja de cálculo destino.
 * `sheetTab` es el nombre exacto de la pestaña en Google Sheets, p. ej.
 * "Asistencia" o "NPS - Cierre de Módulo". Se envuelve entre comillas
 * simples para soportar nombres con espacios o tildes.
 */
export async function appendToSheet(sheetTab: string, values: string[][]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${sheetTab}'!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}
