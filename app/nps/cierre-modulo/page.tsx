"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, SelectInput, TextArea, QuestionCard } from "@/components/FormControls";
import { NpsScale } from "@/components/Scales";
import { NpsHeader } from "@/components/NpsHeader";
import { GRUPO_OPTIONS, MODULOS } from "@/lib/data";

export default function NpsCierreModuloPage() {
  const router = useRouter();
  const [grupo, setGrupo] = useState("");
  const [modulo, setModulo] = useState("");
  const [npsModulo, setNpsModulo] = useState<number | null>(null);
  const [masValioso, setMasValioso] = useState("");
  const [queCambiarias, setQueCambiarias] = useState("");
  const [claridadWise, setClaridadWise] = useState<number | null>(null);
  const [comentarioWise, setComentarioWise] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!grupo) return setError("Selecciona tu grupo");
    if (!modulo) return setError("Selecciona el módulo que acabas de cerrar");
    if (npsModulo === null) return setError("Responde qué tan probable es que recomiendes este módulo");
    if (claridadWise === null) return setError("Responde qué tan claro fue el contenido y el acompañamiento del Wise");

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nps_cierre",
          data: {
            grupo,
            modulo,
            nps_modulo: npsModulo,
            mas_valioso: masValioso,
            que_cambiarias: queCambiarias,
            claridad_wise: claridadWise,
            comentario_wise: comentarioWise,
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
          title="Cierre de módulo 🧩"
          description="Cerramos este módulo y buscamos entender el valor real que te llevas. Qué funcionó, qué no y qué ajustar. Lo bueno y lo incómodo suma para elevar lo siguiente."
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
          <Field label="¿Qué módulo acabas de cerrar?" required>
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

        <QuestionCard>
          <Field label="¿Qué tan probable es que recomiendes este módulo?" required>
            <NpsScale
              value={npsModulo}
              onChange={setNpsModulo}
              from={1}
              to={10}
              minLabel="Nada probable"
              maxLabel="Totalmente probable"
            />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Qué fue lo más valioso que te llevaste de este módulo?">
            <TextArea value={masValioso} onChange={(e) => setMasValioso(e.target.value)} placeholder="Abierta" />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Qué cambiarías para mejorar este módulo?">
            <TextArea value={queCambiarias} onChange={(e) => setQueCambiarias(e.target.value)} placeholder="Abierta" />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Qué tan claro fue el contenido y el acompañamiento del Wise?" required>
            <NpsScale
              value={claridadWise}
              onChange={setClaridadWise}
              from={1}
              to={10}
              minLabel="Nada claro"
              maxLabel="Totalmente claro"
            />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="¿Tienes algún comentario o sugerencia para tu WISE?">
            <TextArea value={comentarioWise} onChange={(e) => setComentarioWise(e.target.value)} placeholder="Abierta" />
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
