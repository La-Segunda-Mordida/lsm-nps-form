"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, SelectInput, TextArea, QuestionCard } from "@/components/FormControls";
import { NpsScale } from "@/components/Scales";
import { NpsHeader } from "@/components/NpsHeader";
import { GRUPO_OPTIONS } from "@/lib/data";

export default function NpsFinProgramaPage() {
  const router = useRouter();
  const [grupo, setGrupo] = useState("");
  const [npsLsm, setNpsLsm] = useState<number | null>(null);
  const [porQuePuntuacion, setPorQuePuntuacion] = useState("");
  const [masValioso, setMasValioso] = useState("");
  const [noRecomendarias, setNoRecomendarias] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!grupo) return setError("Selecciona tu grupo");
    if (npsLsm === null) return setError("Responde qué tan probable es que recomiendes LSM");

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nps_fin",
          data: {
            grupo,
            nps_lsm: npsLsm,
            por_que_puntuacion: porQuePuntuacion,
            mas_valioso: masValioso,
            no_recomendarias: noRecomendarias,
            comentario,
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
          title="Cierre del programa 🌎"
          description="Mirada completa del recorrido. Queremos entender qué impacto tuvo LSM, qué valor te dejó y cómo lo recomendarías. Tu perspectiva define cómo evoluciona lo que sigue."
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
          <Field label="Pensando en todo el programa, ¿qué tan probable es que recomiendes LSM?" required>
            <NpsScale
              value={npsLsm}
              onChange={setNpsLsm}
              from={1}
              to={10}
              minLabel="Nada probable"
              maxLabel="Totalmente probable"
            />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Por qué nos diste esa puntuación?">
            <TextArea value={porQuePuntuacion} onChange={(e) => setPorQuePuntuacion(e.target.value)} placeholder="Abierta" />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Qué fue lo más valioso que te llevaste del programa?">
            <TextArea value={masValioso} onChange={(e) => setMasValioso(e.target.value)} placeholder="Abierta" />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Para quién NO recomendarías este programa?">
            <TextArea value={noRecomendarias} onChange={(e) => setNoRecomendarias(e.target.value)} placeholder="Abierta" />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Hay algún comentario o sugerencia que nos quieras dejar?">
            <TextArea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Abierta" />
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
