"use client";

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

export function TextInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lsm-orange/20 focus:border-lsm-orange transition bg-white ${className}`}
    />
  );
}

export function TextArea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 3}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lsm-orange/20 focus:border-lsm-orange transition bg-white resize-none ${className}`}
    />
  );
}

export function SelectInput({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lsm-orange/20 focus:border-lsm-orange transition bg-white"
    >
      {children}
    </select>
  );
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            value === opt ? "border-lsm-dark bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="mt-0.5 accent-orange-600 shrink-0"
          />
          <span className="text-sm text-gray-700 leading-snug">{opt}</span>
        </label>
      ))}
    </div>
  );
}

export function CheckboxGroup({
  options,
  values,
  onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = values.includes(opt);
        return (
          <label
            key={opt}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              checked ? "border-lsm-dark bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(opt)}
              className="mt-0.5 accent-orange-600 shrink-0"
            />
            <span className="text-sm text-gray-700 leading-snug">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

/** Tarjeta blanca redondeada que envuelve cada pregunta, al estilo Google Forms de LSM. */
export function QuestionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-4">{children}</div>;
}
