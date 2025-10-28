'use client';

interface ProficiencyBadgeProps {
  proficient: boolean;
  expertise: boolean;
}

export default function ProficiencyBadge({ proficient, expertise }: ProficiencyBadgeProps) {
  if (expertise) {
    return (
      <span className="inline-flex items-center gap-0.5 text-amber-400" title="Expertise">
        <span className="text-sm">⭐</span>
        <span className="text-sm">⭐</span>
      </span>
    );
  }

  if (proficient) {
    return (
      <span className="inline-flex items-center text-amber-500" title="Proficiente">
        <span className="text-sm">⭐</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-neutral-600" title="Não proficiente">
      <span className="text-sm">○</span>
    </span>
  );
}
