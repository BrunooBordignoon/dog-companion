'use client';

interface LevelSectionHeaderProps {
  level: number;
  title: string;
  isLocked: boolean;
  isPending: boolean;
}

export default function LevelSectionHeader({
  level,
  title,
  isLocked,
  isPending
}: LevelSectionHeaderProps) {
  return (
    <h2 className="mb-3 flex flex-wrap items-center gap-2 text-lg sm:text-xl font-bold text-amber-100">
      <span className="break-words">Nível {level} – {title}</span>
      {isLocked && <span className="flex-shrink-0">🔒</span>}
      {isPending && !isLocked && (
        <span className="rounded-full bg-yellow-600 px-2 py-1 text-xs font-bold text-white whitespace-nowrap flex-shrink-0">
          PENDENTE
        </span>
      )}
    </h2>
  );
}
