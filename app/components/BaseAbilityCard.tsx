'use client';

interface BaseAbilityCardProps {
  level: number;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  themeColor?: 'amber' | 'red' | 'purple';
  // Detalhes D&D opcionais
  actionType?: string;
  range?: string;
  duration?: string;
  damageType?: string;
  damage?: string;
  savingThrow?: string;
  condition?: string;
  limit?: string;
  cost?: string;
}

export default function BaseAbilityCard({
  level,
  name,
  description,
  icon,
  isUnlocked,
  themeColor = 'amber',
  actionType,
  range,
  duration,
  damageType,
  damage,
  savingThrow,
  condition,
  limit,
  cost,
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
    purple: {
      border: 'border-purple-700/50',
      bgGradient: 'from-purple-950/20',
      text: 'text-purple-200',
    },
  };

  const theme = colors[themeColor];

  const actionTypeNames: Record<string, string> = {
    action: 'Ação',
    bonus: 'Ação Bônus',
    reaction: 'Reação',
    free: 'Ação Livre',
    none: 'Automática',
  };

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
        <span className="break-words">{name}</span>
      </h3>
      <p className="mt-2 text-sm text-neutral-300">{description}</p>

      {/* Stats (if provided and unlocked) */}
      {isUnlocked && (actionType || range || duration || damage || damageType || savingThrow || condition || limit || cost) && (
        <div className="mt-3 pt-3 border-t border-neutral-700/50 space-y-1.5 text-xs">
          {actionType && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Tipo:</span>
              <span className="text-neutral-300">{actionTypeNames[actionType] || actionType}</span>
            </div>
          )}
          {range && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Alcance:</span>
              <span className="text-neutral-300">{range}</span>
            </div>
          )}
          {duration && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Duração:</span>
              <span className="text-neutral-300">{duration}</span>
            </div>
          )}
          {damage && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Efeito:</span>
              <span className={`font-semibold ${theme.text}`}>{damage}</span>
            </div>
          )}
          {damageType && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Tipo de Dano:</span>
              <span className="text-neutral-300">{damageType}</span>
            </div>
          )}
          {savingThrow && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Resistência:</span>
              <span className="text-neutral-300">{savingThrow}</span>
            </div>
          )}
          {condition && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Condição:</span>
              <span className="text-neutral-300">{condition}</span>
            </div>
          )}
          {limit && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Limite:</span>
              <span className="text-amber-400 font-semibold">{limit}</span>
            </div>
          )}
          {cost && (
            <div className="flex gap-2">
              <span className="text-neutral-500 font-semibold min-w-[70px]">Custo:</span>
              <span className="text-red-400 font-semibold">{cost}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
