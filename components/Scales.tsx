"use client";

/** Escala lineal corta (por defecto 1–5, "Nada" … "Totalmente") para un solo ítem del grid Q3. */
export function ScaleRow({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  minLabel = "Nada",
  maxLabel = "Totalmente",
  required,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  required?: boolean;
}) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-medium text-gray-800 mb-4">
        {label} {required && <span className="text-red-600">*</span>}
      </p>
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
        <span className="text-xs text-gray-500 shrink-0 w-16">{minLabel}</span>
        {options.map((n) => (
          <label key={n} className="flex flex-col items-center gap-1.5 shrink-0">
            <span className="text-xs text-gray-500">{n}</span>
            <input
              type="radio"
              name={label}
              checked={value === n}
              onChange={() => onChange(n)}
              className="w-5 h-5 accent-orange-600"
            />
          </label>
        ))}
        <span className="text-xs text-gray-500 shrink-0 w-16 text-right">{maxLabel}</span>
      </div>
    </div>
  );
}

/** Escala NPS (0–10 o 1–10) para preguntas tipo "¿qué tan probable es que recomiendes...?". */
export function NpsScale({
  value,
  onChange,
  from = 0,
  to = 10,
  minLabel = "Nada probable",
  maxLabel = "Totalmente probable",
}: {
  value: number | null;
  onChange: (v: number) => void;
  from?: number;
  to?: number;
  minLabel?: string;
  maxLabel?: string;
}) {
  const options = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-1 sm:gap-2 overflow-x-auto pb-1">
        {options.map((n) => (
          <label key={n} className="flex flex-col items-center gap-1.5 shrink-0 w-8">
            <span className="text-xs text-gray-500">{n}</span>
            <input
              type="radio"
              name="nps-scale"
              checked={value === n}
              onChange={() => onChange(n)}
              className="w-5 h-5 accent-orange-600"
            />
          </label>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
