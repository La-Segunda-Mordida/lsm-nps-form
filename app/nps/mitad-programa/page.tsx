"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, SelectInput, TextArea, QuestionCard } from "@/components/FormControls";
import { NpsScale } from "@/components/Scales";
import { NpsHeader } from "@/components/NpsHeader";
import { GRUPO_OPTIONS } from "@/lib/data";

export default function NpsMitadProgramaPage() {
  const router = useRouter();
  const [grupo, setGrupo] = useState("");
  const [npsPrograma, setNpsPrograma] = useState<number | null>(null);
  const [mejorarUnaCosa, setMejorarUnaCosa] = useState("");
  const [insightValioso, setInsightValioso] = useState("");
  const [insightNoCerro, setInsightNoCerro] = useState("");
  const [insightRecomendaciones, setInsightRecomendaciones] = useState("");
  const [npsSesion, setNpsSesion] = useState<number | null>(null);
  const [mensajeWise, setMensajeWise] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!grupo) return setError("Selecciona tu grupo");
    if (npsPrograma === null) return setError("Responde qué tan probable es que recomiendes el programa hasta ahora");
    if (npsSesion === null) return setError("Responde qué tan probable es que recomiendes esta sesión");

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nps_mitad",
          data: {
            grupo,
            nps_programa: npsPrograma,
            mejorar_una_cosa: mejorarUnaCosa,
            insight_valioso: insightValioso,
            insight_no_cerro: insightNoCerro,
            insight_recomendaciones: insightRecomendaciones,
            nps_sesion: npsSesion,
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
          title="¿Cómo vamos hasta ahora? ⚡"
          description="Queremos entender qué te está sirviendo, qué no y qué cambiar ahora. Tu respuesta impacta directamente lo que viene."
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
          <Field label="¿Qué tan probable es que recomiendes este programa hasta ahora?" required>
            <NpsScale
              value={npsPrograma}
              onChange={setNpsPrograma}
              from={1}
              to={10}
              minLabel="Nada probable"
              maxLabel="Totalmente probable"
            />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="Si tuvieras que mejorar UNA sola cosa ahora mismo, ¿cuál sería?">
            <TextArea value={mejorarUnaCosa} onChange={(e) => setMejorarUnaCosa(e.target.value)} placeholder="Abierta" />
          </Field>
        </QuestionCard>

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
            <NpsScale value={npsSesion} onChange={setNpsSesion} from={0} to={10} />
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
