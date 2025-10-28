'use client';

import { SkillKey, SKILL_NAMES, Skills } from '@/types/skills';

interface ExpertiseSelectorProps {
  skills: Skills;
  selectedExpertise?: SkillKey;
  onSelect: (skill: SkillKey) => void;
  canSelect: boolean;
  themeColor?: 'amber' | 'red' | 'purple';
}

export default function ExpertiseSelector({
  skills,
  selectedExpertise,
  onSelect,
  canSelect,
  themeColor = 'amber'
}: ExpertiseSelectorProps) {
  const colors = {
    amber: {
      border: 'border-amber-600/50',
      selectedBorder: 'border-amber-500',
      selectedBg: 'bg-amber-950/40',
      hoverBg: 'hover:bg-amber-950/20',
      text: 'text-amber-400',
    },
    red: {
      border: 'border-red-600/50',
      selectedBorder: 'border-red-500',
      selectedBg: 'bg-red-950/40',
      hoverBg: 'hover:bg-red-950/20',
      text: 'text-red-400',
    },
    purple: {
      border: 'border-purple-600/50',
      selectedBorder: 'border-purple-500',
      selectedBg: 'bg-purple-950/40',
      hoverBg: 'hover:bg-purple-950/20',
      text: 'text-purple-400',
    },
  };

  const theme = colors[themeColor];

  // Filtrar apenas skills que o personagem é proficiente
  const proficientSkills = (Object.keys(skills) as SkillKey[]).filter(
    (skillKey) => skills[skillKey].proficient
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-400">
        Escolha uma perícia na qual você é proficiente para ganhar expertise (dobro do bônus de proficiência):
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {proficientSkills.map((skillKey) => {
          const isSelected = selectedExpertise === skillKey;

          return (
            <button
              key={skillKey}
              onClick={() => canSelect && onSelect(skillKey)}
              disabled={!canSelect}
              className={`
                relative rounded-lg border-2 p-3 text-left transition-all
                ${isSelected
                  ? `${theme.selectedBorder} ${theme.selectedBg}`
                  : `${theme.border} bg-neutral-900/50`
                }
                ${canSelect
                  ? `${theme.hoverBg} cursor-pointer`
                  : 'cursor-not-allowed opacity-60'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-semibold ${isSelected ? theme.text : 'text-neutral-200'}`}>
                    {SKILL_NAMES[skillKey]}
                  </div>
                  {isSelected && (
                    <div className="mt-1 text-xs text-neutral-500">
                      ⭐⭐ Expertise Selecionada
                    </div>
                  )}
                </div>
                {isSelected && (
                  <div className={`text-2xl ${theme.text}`}>✓</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
