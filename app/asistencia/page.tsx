"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Field, SelectInput, CheckboxGroup, TextArea, QuestionCard } from "@/components/FormControls";
import { WISES, Wise, gruposDeWise, MIEMBROS } from "@/lib/data";

export default function AsistenciaPage() {
  const router = useRouter();
  const [fechaSesion, setFechaSesion] = useState(new Date().toISOString().slice(0, 10));
  const [wise, setWise] = useState<Wise | "">("");
  const [grupo, setGrupo] = useState("");
  const [asistentes, setAsistentes] = useState<string[]>([]);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const grupos = wise ? gruposDeWise(wise) : [];
  const roster = grupo ? MIEMBROS[grupo] || [] : [];

  function toggleAsistente(nombre: string) {
    setAsistentes((prev) => (prev.includes(nombre) ? prev.filter((n) => n !== nombre) : [...prev, nombre]));
  }

  function onWiseChange(v: string) {
    setWise(v as Wise);
    setGrupo("");
    setAsistentes([]);
  }

  function onGrupoChange(v: string) {
    setGrupo(v);
    setAsistentes([]);
  }

  async function submit() {
    setError("");
    if (!fechaSesion) return setError("Ingresa la fecha de la sesión");
    if (!wise) return setError("Selecciona el Wise");
    if (!grupo) return setError("Selecciona el grupo");

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "asistencia",
          data: { fecha_sesion: fechaSesion, wise, grupo, asistentes, observaciones },
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
        <div className="text-center mb-2">
          <Image src="/logo.png" alt="La Segunda Mordida" width={64} height={64} className="mx-auto mb-3" priority />
          <h1 className="font-[family-name:var(--font-anton)] text-xl tracking-wide text-gray-900 uppercase">
            Asistencia a sesiones
          </h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Hola Wises 🍑 Este espacio es clave para llevar un buen seguimiento de quiénes están asistiendo a las
            sesiones. No olvides completarlo después de cada sesión 🙌
          </p>
        </div>

        <QuestionCard>
          <Field label="Fecha de sesión" required>
            <input
              type="date"
              value={fechaSesion}
              onChange={(e) => setFechaSesion(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lsm-orange/20 focus:border-lsm-orange transition bg-white"
            />
          </Field>
        </QuestionCard>

        <QuestionCard>
          <Field label="Wise" required>
            <SelectInput value={wise} onChange={(e) => onWiseChange(e.target.value)}>
              <option value="">Selecciona…</option>
              {WISES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </SelectInput>
          </Field>
        </QuestionCard>

        {wise && (
          <QuestionCard>
            <Field label="Selecciona tu grupo" required>
              <SelectInput value={grupo} onChange={(e) => onGrupoChange(e.target.value)}>
                <option value="">Selecciona…</option>
                {grupos.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </QuestionCard>
        )}

        {grupo && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 leading-relaxed">
            💡 <span className="font-medium">Recuerda:</span> si algún member no pudo asistir, avísale que puede ver
            la sesión grabada en la plataforma de LSM. Así puede ponerse al día y no perder el ritmo del proceso 🙌
          </div>
        )}

        {grupo && (
          <QuestionCard>
            <Field label={`Hola ${wise}, por favor registra la asistencia de tu sesión de hoy`} required>
              <p className="text-xs text-gray-400 -mt-1 mb-2">Marca a los members que asistieron ({grupo})</p>
              <CheckboxGroup options={roster} values={asistentes} onToggle={toggleAsistente} />
            </Field>
          </QuestionCard>
        )}

        {grupo && (
          <QuestionCard>
            <Field label="Observaciones">
              <p className="text-xs text-gray-400 -mt-1 mb-2">
                ¿Qué observaciones quieres dejar sobre la sesión de hoy? (Por ejemplo: ausencias avisadas, llegadas
                tarde, temas pendientes para la siguiente sesión, u otros puntos relevantes).
              </p>
              <TextArea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Espacio abierto para escribir"
                rows={4}
              />
            </Field>
          </QuestionCard>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Volver
          </Link>
          <button
            onClick={submit}
            disabled={loading || !grupo}
            className="flex-1 bg-lsm-orange text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-lsm-dark transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Enviar asistencia"}
          </button>
        </div>
      </div>
    </div>
  );
}
