'use client';

interface AbilityCardProps {
  name: string;
  description: string;
  level: number;
  type?: string;
  borderColor?: string;
  bgColor?: string;
}

export default function AbilityCard({
  name,
  description,
  level,
  type,
  borderColor = 'border-amber-600/30',
  bgColor = 'bg-neutral-800/50'
}: AbilityCardProps) {
  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-3`}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-amber-200 text-sm sm:text-base break-words">{name}</div>
          {type && (
            <span className="mt-1 inline-block whitespace-nowrap rounded bg-neutral-900/50 px-2 py-0.5 text-xs text-neutral-300">
              {type}
            </span>
          )}
        </div>
        <span className="whitespace-nowrap rounded bg-neutral-900/70 px-2 py-0.5 text-xs font-semibold text-neutral-300 flex-shrink-0">
          Nv. {level}
        </span>
      </div>
      <div className="mt-2 text-sm text-neutral-300">{description}</div>
    </div>
  );
}
