'use client';

interface BaseAbilityCardProps {
  level: number;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  themeColor?: 'amber' | 'red';
}

export default function BaseAbilityCard({
  level,
  name,
  description,
  icon,
  isUnlocked,
  themeColor = 'amber'
}: BaseAbilityCardProps) {
  const colors = {
    amber: {
      border: 'border-amber-700/50',
      bgGradient: 'from-amber-950/20',
      text: 'text-amber-200',
    },
    red: {
      border: 'border-red-700/50',
      bgGradient: 'from-red-950/20',
      text: 'text-red-200',
    },
  };

  const theme = colors[themeColor];

  return (
    <div
      className={`rounded-lg border-2 p-3 sm:p-4 shadow-md ${
        isUnlocked
          ? `${theme.border} bg-gradient-to-br ${theme.bgGradient} to-neutral-900`
          : 'border-neutral-800 bg-neutral-950/50 opacity-50'
      }`}
    >
      <h3 className={`flex items-center gap-2 font-bold ${theme.text} text-sm sm:text-base flex-wrap`}>
        {!isUnlocked && <span className="text-base sm:text-lg flex-shrink-0">🔒</span>}
        <span className="flex-shrink-0">{icon}</span>
        <span className="break-words">Nível {level} – {name}</span>
      </h3>
      <p className="mt-2 text-sm text-neutral-300">{description}</p>
    </div>
  );
}
