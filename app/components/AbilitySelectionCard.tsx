'use client';

interface AbilitySelectionCardProps {
  title: string;
  description: string;
  category?: string; // Optional category label (e.g., "Passiva", "Ativa", or path name)
  isSelected: boolean;
  canSelect: boolean;
  onClick: () => void;
  colorClasses?: string; // e.g., "border-red-700/50 bg-red-950/20"
}

export default function AbilitySelectionCard({
  title,
  description,
  category,
  isSelected,
  canSelect,
  onClick,
  colorClasses = 'border-amber-700/50 bg-amber-950/20'
}: AbilitySelectionCardProps) {
  return (
    <div
      onClick={() => canSelect && onClick()}
      className={`cursor-pointer rounded-lg border p-3 sm:p-4 transition-all ${
        canSelect
          ? isSelected
            ? `${colorClasses} border-2`
            : `border-neutral-700 bg-neutral-900 hover:border-neutral-600`
          : 'cursor-not-allowed border-neutral-800 bg-neutral-950/50 opacity-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-amber-100 text-sm sm:text-base break-words">{title}</h3>
            {category && (
              <span className="whitespace-nowrap rounded bg-neutral-900/50 px-2 py-0.5 text-xs text-neutral-300 flex-shrink-0">
                {category}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-neutral-300">{description}</p>
        </div>
        {isSelected && <span className="ml-2 text-lg sm:text-xl flex-shrink-0">✓</span>}
      </div>
    </div>
  );
}
