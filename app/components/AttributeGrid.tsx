'use client';

interface Attribute {
  value: number;
  modifier: number;
}

interface AttributeGridProps {
  attributes: {
    strength: Attribute;
    dexterity: Attribute;
    constitution: Attribute;
    intelligence: Attribute;
    wisdom: Attribute;
    charisma: Attribute;
  };
  themeColor?: 'amber' | 'red';
}

export default function AttributeGrid({ attributes, themeColor = 'amber' }: AttributeGridProps) {
  const colors = {
    amber: {
      border: 'border-amber-700/20',
      bgGradient: 'from-amber-950/20',
      labelText: 'text-amber-600',
      valueText: 'text-amber-100',
    },
    red: {
      border: 'border-red-700/20',
      bgGradient: 'from-red-950/20',
      labelText: 'text-red-600',
      valueText: 'text-red-100',
    },
  };

  const theme = colors[themeColor];

  const attributeLabels = {
    strength: 'FOR',
    dexterity: 'DES',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'SAB',
    charisma: 'CAR',
  };

  const attributeIcons = {
    strength: '💪',
    dexterity: '🎯',
    constitution: '❤️',
    intelligence: '🧠',
    wisdom: '🦉',
    charisma: '✨',
  };

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-6">
      {Object.entries(attributes).map(([key, attr]) => (
        <div
          key={key}
          className={`rounded-lg border-2 ${theme.border} bg-gradient-to-b ${theme.bgGradient} to-neutral-900 p-3 text-center shadow-md`}
        >
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">{attributeIcons[key as keyof typeof attributeIcons]}</span>
            <div className={`text-xs font-semibold uppercase tracking-wider ${theme.labelText}`}>
              {attributeLabels[key as keyof typeof attributeLabels]}
            </div>
          </div>
          <div className={`mt-1 text-xl font-bold ${theme.valueText}`}>{attr.value}</div>
          <div className="text-sm text-neutral-400">
            ({attr.modifier >= 0 ? '+' : ''}
            {attr.modifier})
          </div>
        </div>
      ))}
    </div>
  );
}
