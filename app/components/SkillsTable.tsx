'use client';

import { Attributes, ATTRIBUTE_NAMES } from '@/types/companion';
import {
  Skills,
  SkillKey,
  SKILL_NAMES,
  SKILL_ATTRIBUTES,
  SKILLS_BY_ATTRIBUTE,
  calculateSkillBonus,
} from '@/types/skills';
import ProficiencyBadge from './ProficiencyBadge';

interface SkillsTableProps {
  attributes: Attributes;
  skills: Skills;
  proficiencyBonus: number;
  themeColor?: 'amber' | 'red' | 'purple';
}

export default function SkillsTable({
  attributes,
  skills,
  proficiencyBonus,
  themeColor = 'amber',
}: SkillsTableProps) {
  const colors = {
    amber: {
      headerBg: 'bg-amber-950/30',
      headerText: 'text-amber-400',
      headerBorder: 'border-amber-700/30',
      rowHover: 'hover:bg-amber-950/20',
      attrText: 'text-amber-600',
      bonusText: 'text-amber-300',
    },
    red: {
      headerBg: 'bg-red-950/30',
      headerText: 'text-red-400',
      headerBorder: 'border-red-700/30',
      rowHover: 'hover:bg-red-950/20',
      attrText: 'text-red-600',
      bonusText: 'text-red-300',
    },
    purple: {
      headerBg: 'bg-purple-950/30',
      headerText: 'text-purple-400',
      headerBorder: 'border-purple-700/30',
      rowHover: 'hover:bg-purple-950/20',
      attrText: 'text-purple-600',
      bonusText: 'text-purple-300',
    },
  };

  const theme = colors[themeColor];

  // Função para renderizar uma skill individual
  const renderSkill = (skillKey: SkillKey) => {
    const skill = skills[skillKey];
    const attributeKey = SKILL_ATTRIBUTES[skillKey];
    const attributeModifier = attributes[attributeKey].modifier;

    const bonus = calculateSkillBonus(
      attributeModifier,
      skill.proficient,
      skill.expertise,
      proficiencyBonus
    );

    const attributeAbbr = {
      strength: 'FOR',
      dexterity: 'DES',
      constitution: 'CON',
      intelligence: 'INT',
      wisdom: 'SAB',
      charisma: 'CAR',
    }[attributeKey];

    return (
      <div
        key={skillKey}
        className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-4 items-center p-2 sm:p-3 rounded ${theme.rowHover} transition-colors`}
      >
        {/* Skill Name */}
        <div className="text-sm sm:text-base text-neutral-200 font-medium">
          {SKILL_NAMES[skillKey]}
        </div>

        {/* Attribute */}
        <div className={`text-xs sm:text-sm font-semibold ${theme.attrText}`}>
          {attributeAbbr}
        </div>

        {/* Bonus */}
        <div className={`text-sm sm:text-base font-bold ${theme.bonusText} text-right min-w-[3ch]`}>
          {bonus >= 0 ? '+' : ''}
          {bonus}
        </div>

        {/* Proficiency Badge */}
        <div className="flex items-center justify-center min-w-[2.5rem]">
          <ProficiencyBadge proficient={skill.proficient} expertise={skill.expertise} />
        </div>

        {/* Advantage Badge */}
        <div className="flex items-center justify-center min-w-[1.5rem]">
          <span
            className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-bold transition-opacity ${
              skill.advantage
                ? 'bg-green-600 text-white opacity-100'
                : 'bg-neutral-700 text-neutral-500 opacity-30'
            }`}
            title={skill.advantage ? 'Vantagem' : 'Sem vantagem'}
          >
            A
          </span>
        </div>
      </div>
    );
  };

  // Renderizar skills agrupadas por atributo
  const attributeOrder: Array<keyof typeof SKILLS_BY_ATTRIBUTE> = [
    'strength',
    'dexterity',
    'intelligence',
    'wisdom',
    'charisma',
  ];

  const attributeIcons = {
    strength: '💪',
    dexterity: '🎯',
    constitution: '❤️',
    intelligence: '🧠',
    wisdom: '🦉',
    charisma: '✨',
  };

  return (
    <div className="space-y-4">
      {attributeOrder.map((attrKey) => {
        const skillsForAttr = SKILLS_BY_ATTRIBUTE[attrKey];
        if (skillsForAttr.length === 0) return null;

        return (
          <div key={attrKey} className="space-y-1">
            {/* Attribute Header */}
            <div
              className={`sticky top-0 z-10 flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border-l-4 ${theme.headerBorder} ${theme.headerBg} backdrop-blur-sm`}
            >
              <span className="text-base sm:text-lg">{attributeIcons[attrKey]}</span>
              <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${theme.headerText}`}>
                {ATTRIBUTE_NAMES[attrKey]}
              </h3>
            </div>

            {/* Skills */}
            <div className="space-y-0.5">
              {skillsForAttr.map((skillKey) => renderSkill(skillKey))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
