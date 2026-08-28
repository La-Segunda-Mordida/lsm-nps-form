import Image from "next/image";
import Link from "next/link";

const FORMS = [
  {
    href: "/asistencia",
    emoji: "📋",
    title: "Asistencia a sesiones",
    desc: "Registro de asistencia de members después de cada sesión.",
  },
  {
    href: "/nps/sesion",
    emoji: "🫂",
    title: "NPS — Sesión presencial",
    desc: "¿Qué te llevas de nuestra sesión presencial?",
  },
  {
    href: "/nps/masterclass",
    emoji: "💻",
    title: "NPS — Masterclass",
    desc: "¿Qué te llevas de esta sesión virtual?",
  },
  {
    href: "/nps/mitad-programa",
    emoji: "⚡",
    title: "NPS — Mitad de programa",
    desc: "¿Cómo vamos hasta ahora?",
  },
  {
    href: "/nps/cierre-modulo",
    emoji: "🧩",
    title: "NPS — Cierre de módulo",
    desc: "Cierre de módulo: qué funcionó, qué no.",
  },
  {
    href: "/nps/fin-programa",
    emoji: "🌎",
    title: "NPS — Fin del programa",
    desc: "Cierre del programa: mirada completa del recorrido.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-lsm-cream py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="La Segunda Mordida" width={72} height={72} className="mx-auto mb-3" priority />
          <h1 className="font-[family-name:var(--font-anton)] text-2xl tracking-wide text-gray-900 uppercase">
            La Segunda Mordida
          </h1>
          <p className="text-sm text-gray-500 mt-1">Asistencia y encuestas NPS</p>
        </div>

        <div className="space-y-3">
          {FORMS.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-orange-100 p-4 hover:border-lsm-orange hover:shadow-md transition-all"
            >
              <span className="text-2xl shrink-0">{f.emoji}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-gray-900">{f.title}</span>
                <span className="block text-xs text-gray-500 mt-0.5">{f.desc}</span>
              </span>
              <span className="text-lsm-orange shrink-0">→</span>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">La Segunda Mordida © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
