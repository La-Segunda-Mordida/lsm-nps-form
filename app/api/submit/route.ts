import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";
import { MIEMBROS } from "@/lib/data";

// Nombre exacto de la pestaña (tab) de Google Sheets para cada tipo de formulario.
const SHEET_TABS: Record<string, string> = {
  asistencia: "Asistencia",
  nps_sesion: "NPS - Sesiones",
  nps_masterclass: "NPS - Masterclass",
  nps_mitad: "NPS - Mitad de Programa",
  nps_cierre: "NPS - Cierre de Módulo",
  nps_fin: "NPS - Fin del Programa",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body as { type: string; data: Record<string, unknown> };

    const sheetTab = SHEET_TABS[type];
    if (!sheetTab) {
      return NextResponse.json({ error: "Tipo de formulario inválido" }, { status: 400 });
    }

    const id = `LSM-${Date.now()}`;
    const fecha = new Date().toISOString();
    const row = buildRow(type, id, fecha, data);

    await appendToSheet(sheetTab, [row]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

function buildRow(type: string, id: string, fecha: string, d: Record<string, unknown>): string[] {
  const s = (v: unknown) => (v === undefined || v === null ? "" : String(v));
  const join = (v: unknown) => (Array.isArray(v) ? v.join("; ") : s(v));

  switch (type) {
    case "asistencia": {
      const grupo = s(d.grupo);
      const asistentes = Array.isArray(d.asistentes) ? (d.asistentes as string[]) : [];
      const roster = MIEMBROS[grupo] || [];
      const inasistentes = roster.filter((m) => !asistentes.includes(m));
      return [
        id,
        fecha,
        s(d.fecha_sesion),
        s(d.wise),
        grupo,
        asistentes.join("; "),
        inasistentes.join("; "),
        String(asistentes.length),
        String(roster.length),
        s(d.observaciones),
      ];
    }
    case "nps_sesion":
      return [
        id,
        fecha,
        s(d.grupo),
        s(d.modulo),
        s(d.rating_contenido_claro),
        s(d.rating_contenido_relevante),
        s(d.rating_wise_claro),
        s(d.rating_wise_participativo),
        s(d.insight_valioso),
        s(d.insight_no_cerro),
        s(d.insight_recomendaciones),
        s(d.nps_contenido),
        s(d.mensaje_wise),
      ];
    case "nps_masterclass":
      return [
        id,
        fecha,
        s(d.grupo),
        s(d.ponente),
        s(d.rating_contenido_claro),
        s(d.rating_contenido_valor),
        s(d.rating_curador_claro),
        s(d.rating_curador_atencion),
        s(d.insight_valioso),
        s(d.insight_no_cerro),
        s(d.insight_recomendaciones),
        s(d.nps_contenido),
        s(d.pregunta_curador),
      ];
    case "nps_mitad":
      return [
        id,
        fecha,
        s(d.grupo),
        s(d.nps_programa),
        s(d.mejorar_una_cosa),
        s(d.insight_valioso),
        s(d.insight_no_cerro),
        s(d.insight_recomendaciones),
        s(d.nps_sesion),
        s(d.mensaje_wise),
      ];
    case "nps_cierre":
      return [
        id,
        fecha,
        s(d.grupo),
        s(d.modulo),
        s(d.nps_modulo),
        s(d.mas_valioso),
        s(d.que_cambiarias),
        s(d.claridad_wise),
        s(d.comentario_wise),
      ];
    case "nps_fin":
      return [
        id,
        fecha,
        s(d.grupo),
        s(d.nps_lsm),
        s(d.por_que_puntuacion),
        s(d.mas_valioso),
        s(d.no_recomendarias),
        s(d.comentario),
      ];
    default:
      return [id, fecha, join(d)];
  }
}
