import Image from "next/image";

export function NpsHeader({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return (
    <div className="text-center mb-2">
      <Image src="/logo.png" alt="La Segunda Mordida" width={64} height={64} className="mx-auto mb-3" priority />
      <p className="text-xs font-semibold uppercase tracking-wide text-lsm-orange mb-1">{kicker}</p>
      <h1 className="font-[family-name:var(--font-anton)] text-xl tracking-wide text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
