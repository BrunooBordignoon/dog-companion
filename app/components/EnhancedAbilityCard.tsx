'use client';

interface EnhancedAbilityCardProps {
  name: string;
  description: string;
  type: 'passive' | 'active' | 'reaction';
  actionType?: string;
  range?: string;
  duration?: string;
  damageType?: string;
  damage?: string;
  savingThrow?: string;
  condition?: string;
  limit?: string;
  cost?: string;
  isUnlocked: boolean;
  isSelected?: boolean;
  canSelect?: boolean;
  onClick?: () => void;
  themeColor?: 'amber' | 'red' | 'purple' | 'blue';
}

export default function EnhancedAbilityCard({
  name,
  description,
  type,
  actionType,
  range,
  duration,
  damageType,
  damage,
  savingThrow,
  condition,
  limit,
  cost,
  isUnlocked,
  isSelected = false,
  canSelect = false,
  onClick,
  themeColor = 'amber'
}: EnhancedAbilityCardProps) {
  const colors = {
    amber: {
      border: 'border-amber-700/50',
      borderSelected: 'border-amber-500',
      bgGradient: 'from-amber-950/20',
      text: 'text-amber-200',
      badge: 'bg-amber-900/50 text-amber-300',
    },
    red: {
      border: 'border-red-700/50',
      borderSelected: 'border-red-500',
      bgGradient: 'from-red-950/20',
      text: 'text-red-200',
      badge: 'bg-red-900/50 text-red-300',
    },
    purple: {
      border: 'border-purple-700/50',
      borderSelected: 'border-purple-500',
      bgGradient: 'from-purple-950/20',
      text: 'text-purple-200',
      badge: 'bg-purple-900/50 text-purple-300',
    },
    blue: {
      border: 'border-blue-700/50',
      borderSelected: 'border-blue-500',
      bgGradient: 'from-blue-950/20',
      text: 'text-blue-200',
      badge: 'bg-blue-900/50 text-blue-300',
    },
  };

  const typeColors = {
    passive: 'bg-amber-900/40 text-amber-300 border-amber-700/30',
    active: 'bg-red-900/40 text-red-300 border-red-700/30',
    reaction: 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  };

  const typeNames = {
    passive: 'Passiva',
    active: 'Ativa',
    reaction: 'Reação',
  };

  const theme = colors[themeColor];
  const typeColor = typeColors[type];

  const actionTypeNames: Record<string, string> = {
    action: 'Ação',
    bonus: 'Ação Bônus',
    reaction: 'Reação',
    free: 'Ação Livre',
    none: 'Automática',
  };

  return (
    <div
      onClick={canSelect ? onClick : undefined}
      className={`rounded-lg border-2 p-4 shadow-md transition-all ${
        !isUnlocked
          ? 'border-neutral-800 bg-neutral-950/50 opacity-50'
          : canSelect
          ? isSelected
            ? `${theme.borderSelected} bg-gradient-to-br ${theme.bgGradient} to-neutral-900`
            : 'border-neutral-700 bg-neutral-900 cursor-pointer hover:border-neutral-600'
          : `${theme.border} bg-gradient-to-br ${theme.bgGradient} to-neutral-900`
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className={`font-bold ${theme.text} text-base flex items-center gap-2 flex-wrap`}>
            {!isUnlocked && <span className="text-lg flex-shrink-0">🔒</span>}
            <span className="break-words">{name}</span>
          </h3>
        </div>
        <div className={`px-2 py-1 rounded border text-xs font-semibold whitespace-nowrap ${typeColor}`}>
          {typeNames[type]}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-300 mb-3">{description}</p>

      {/* Stats Grid */}
      {isUnlocked && (
        <div className="space-y-2 border-t border-neutral-700/50 pt-3">
          {actionType && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Tipo de Ação:</span>
              <span className="text-neutral-300">{actionTypeNames[actionType] || actionType}</span>
            </div>
          )}

          {range && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Alcance:</span>
              <span className="text-neutral-300">{range}</span>
            </div>
          )}

          {duration && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Duração:</span>
              <span className="text-neutral-300">{duration}</span>
            </div>
          )}

          {damage && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Dano/Efeito:</span>
              <span className={`font-semibold ${theme.text}`}>{damage}</span>
            </div>
          )}

          {damageType && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Tipo de Dano:</span>
              <span className="text-neutral-300">{damageType}</span>
            </div>
          )}

          {savingThrow && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Teste Resistir:</span>
              <span className="text-neutral-300">{savingThrow}</span>
            </div>
          )}

          {condition && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Condição:</span>
              <span className="text-neutral-300">{condition}</span>
            </div>
          )}

          {limit && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Limite:</span>
              <span className={`${theme.badge} px-2 py-0.5 rounded font-semibold`}>{limit}</span>
            </div>
          )}

          {cost && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-neutral-500 min-w-[80px] font-semibold">Custo:</span>
              <span className="text-red-400 font-semibold">{cost}</span>
            </div>
          )}
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className={`mt-3 pt-3 border-t border-${themeColor}-700/30 text-center`}>
          <span className={`text-xs font-semibold ${theme.text}`}>✓ Habilidade Selecionada</span>
        </div>
      )}
    </div>
  );
}
