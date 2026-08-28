"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, SelectInput, TextInput, TextArea, QuestionCard } from "@/components/FormControls";
import { ScaleRow, NpsScale } from "@/components/Scales";
import { NpsHeader } from "@/components/NpsHeader";
import { GRUPO_OPTIONS } from "@/lib/data";

export default function NpsMasterclassPage() {
  const router = useRouter();
  const [grupo, setGrupo] = useState("");
  const [ponente, setPonente] = useState("");
  const [rContenidoClaro, setRContenidoClaro] = useState<number | null>(null);
  const [rContenidoValor, setRContenidoValor] = useState<number | null>(null);
  const [rCuradorClaro, setRCuradorClaro] = useState<number | null>(null);
  const [rCuradorAtencion, setRCuradorAtencion] = useState<number | null>(null);
  const [insightValioso, setInsightValioso] = useState("");
  const [insightNoCerro, setInsightNoCerro] = useState("");
  const [insightRecomendaciones, setInsightRecomendaciones] = useState("");
  const [npsContenido, setNpsContenido] = useState<number | null>(null);
  const [preguntaCurador, setPreguntaCurador] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!grupo) return setError("Selecciona tu grupo");
    if (!ponente.trim()) return setError("Ingresa el ponente del Masterclass de hoy");
    if (rContenidoClaro === null || rContenidoValor === null || rCuradorClaro === null || rCuradorAtencion === null)
      return setError("Completa la evaluación rápida de tu experiencia hoy");
    if (npsContenido === null) return setError("Responde qué tan probable es que recomiendes esta masterclass");

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nps_masterclass",
          data: {
            grupo,
            ponente,
            rating_contenido_claro: rContenidoClaro,
            rating_contenido_valor: rContenidoValor,
            rating_curador_claro: rCuradorClaro,
            rating_curador_atencion: rCuradorAtencion,
            insight_valioso: insightValioso,
            insight_no_cerro: insightNoCerro,
            insight_recomendaciones: insightRecomendaciones,
            nps_contenido: npsContenido,
            pregunta_curador: preguntaCurador,
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
          kicker="Sesión Virtual"
          title="¿Qué te llevas de esta sesión virtual? 💻"
          description="Una encuesta rápida para saber cómo te fue hoy: qué te sirvió, cómo estuvo la Masterclass y qué te llevas. Información clave para que nuestro ecosistema crezca y mejore sesión a sesión."
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
          <Field label="Ponente del Masterclass de hoy" required>
            <TextInput value={ponente} onChange={(e) => setPonente(e.target.value)} placeholder="Nombre del ponente" />
          </Field>
        </QuestionCard>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-800 px-1">Hagamos una evaluación rápida de tu experiencia hoy:</p>
          <ScaleRow
            label="El contenido fue claro y bien estructurado:"
            value={rContenidoClaro}
            onChange={setRContenidoClaro}
            required
          />
          <ScaleRow label="El contenido me aportó valor:" value={rContenidoValor} onChange={setRContenidoValor} required />
          <ScaleRow label="El curador explicó con claridad:" value={rCuradorClaro} onChange={setRCuradorClaro} required />
          <ScaleRow
            label="El curador mantuvo mi atención:"
            value={rCuradorAtencion}
            onChange={setRCuradorAtencion}
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
          <Field label="¿Qué tan probable es que recomiendes el contenido de esta masterclass a otras personas?" required>
            <NpsScale value={npsContenido} onChange={setNpsContenido} from={0} to={10} />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Alguna pregunta o sugerencia para el curador?">
            <TextArea value={preguntaCurador} onChange={(e) => setPreguntaCurador(e.target.value)} placeholder="Abierta" />
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
