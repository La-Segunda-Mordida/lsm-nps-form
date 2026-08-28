"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, SelectInput, TextArea, QuestionCard } from "@/components/FormControls";
import { ScaleRow, NpsScale } from "@/components/Scales";
import { NpsHeader } from "@/components/NpsHeader";
import { GRUPO_OPTIONS, MODULOS } from "@/lib/data";

export default function NpsSesionPage() {
  const router = useRouter();
  const [grupo, setGrupo] = useState("");
  const [modulo, setModulo] = useState("");
  const [rContenidoClaro, setRContenidoClaro] = useState<number | null>(null);
  const [rContenidoRelevante, setRContenidoRelevante] = useState<number | null>(null);
  const [rWiseClaro, setRWiseClaro] = useState<number | null>(null);
  const [rWiseParticipativo, setRWiseParticipativo] = useState<number | null>(null);
  const [insightValioso, setInsightValioso] = useState("");
  const [insightNoCerro, setInsightNoCerro] = useState("");
  const [insightRecomendaciones, setInsightRecomendaciones] = useState("");
  const [npsContenido, setNpsContenido] = useState<number | null>(null);
  const [mensajeWise, setMensajeWise] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!grupo) return setError("Selecciona tu grupo");
    if (!modulo) return setError("Selecciona el módulo en el que estás");
    if (
      rContenidoClaro === null ||
      rContenidoRelevante === null ||
      rWiseClaro === null ||
      rWiseParticipativo === null
    )
      return setError("Completa la evaluación rápida de tu experiencia hoy");
    if (npsContenido === null) return setError("Responde qué tan probable es que recomiendes esta sesión");

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nps_sesion",
          data: {
            grupo,
            modulo,
            rating_contenido_claro: rContenidoClaro,
            rating_contenido_relevante: rContenidoRelevante,
            rating_wise_claro: rWiseClaro,
            rating_wise_participativo: rWiseParticipativo,
            insight_valioso: insightValioso,
            insight_no_cerro: insightNoCerro,
            insight_recomendaciones: insightRecomendaciones,
            nps_contenido: npsContenido,
            mensaje_wise: mensajeWise,
          },
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/success");
    } catch {
      setError("Ocurrió un error al guardar. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-lsm-cream py-10 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        <NpsHeader
          kicker="Sesión Presencial"
          title="¿Qué te llevas de nuestra sesión presencial? 🫂"
          description="Una encuesta rápida para saber cómo te fue hoy: qué te sirvió, cómo estuvo el Wise y qué te llevas. Información clave para que nuestro ecosistema crezca y mejore sesión a sesión."
        />

        <QuestionCard>
          <Field label="Selecciona tu grupo" required>
            <SelectInput value={grupo} onChange={(e) => setGrupo(e.target.value)}>
              <option value="">Selecciona…</option>
              {GRUPO_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </SelectInput>
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="Módulo en el que estoy" required>
            <SelectInput value={modulo} onChange={(e) => setModulo(e.target.value)}>
              <option value="">Selecciona…</option>
              {MODULOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </SelectInput>
          </Field>
        </QuestionCard>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-800 px-1">Hagamos una evaluación rápida de tu experiencia hoy:</p>
          <ScaleRow label="El contenido de la sesión fue claro:" value={rContenidoClaro} onChange={setRContenidoClaro} required />
          <ScaleRow
            label="El contenido fue relevante para mí:"
            value={rContenidoRelevante}
            onChange={setRContenidoRelevante}
            required
          />
          <ScaleRow label="El Wise explicó las ideas de forma clara:" value={rWiseClaro} onChange={setRWiseClaro} required />
          <ScaleRow
            label="El Wise generó un espacio participativo y cómodo:"
            value={rWiseParticipativo}
            onChange={setRWiseParticipativo}
            required
          />
        </div>

        <QuestionCard>
          <p className="text-sm font-semibold text-gray-800">Insight rápido</p>
          <Field label="Lo más valioso de hoy fue">
            <TextArea value={insightValioso} onChange={(e) => setInsightValioso(e.target.value)} placeholder="Abierta" />
          </Field>
          <Field label="Algo que no me terminó de cerrar">
            <TextArea value={insightNoCerro} onChange={(e) => setInsightNoCerro(e.target.value)} placeholder="Abierta" />
          </Field>
          <Field label="Recomendaciones">
            <TextArea
              value={insightRecomendaciones}
              onChange={(e) => setInsightRecomendaciones(e.target.value)}
              placeholder="Abierta"
            />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Qué tan probable es que recomiendes el contenido de esta sesión a otras personas?" required>
            <NpsScale value={npsContenido} onChange={setNpsContenido} from={0} to={10} />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Qué le dirías directamente a tu Wise sobre esta sesión?">
            <TextArea value={mensajeWise} onChange={(e) => setMensajeWise(e.target.value)} placeholder="Abierta" />
          </Field>
        </QuestionCard>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Volver
          </Link>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-lsm-orange text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-lsm-dark transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Enviar respuesta"}
          </button>
        </div>
      </div>
    </div>
  );
}
