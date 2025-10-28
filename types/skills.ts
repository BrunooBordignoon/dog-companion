import { AttributeKey } from './companion';

// ============================================================================
// Skill Types
// ============================================================================

// 18 skills do D&D 5e
export type SkillKey =
  | 'acrobatics'
  | 'animalHandling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleightOfHand'
  | 'stealth'
  | 'survival';

export type Skill = {
  proficient: boolean;
  expertise: boolean;
  advantage?: boolean; // Indica se o personagem tem vantagem nessa skill
};

export type Skills = Record<SkillKey, Skill>;

// ============================================================================
// Constants
// ============================================================================

// Nomes em português
export const SKILL_NAMES: Record<SkillKey, string> = {
  acrobatics: 'Acrobacia',
  animalHandling: 'Lidar com Animais',
  arcana: 'Arcanismo',
  athletics: 'Atletismo',
  deception: 'Enganação',
  history: 'História',
  insight: 'Intuição',
  intimidation: 'Intimidação',
  investigation: 'Investigação',
  medicine: 'Medicina',
  nature: 'Natureza',
  perception: 'Percepção',
  performance: 'Atuação',
  persuasion: 'Persuasão',
  religion: 'Religião',
  sleightOfHand: 'Prestidigitação',
  stealth: 'Furtividade',
  survival: 'Sobrevivência',
};

// Mapeamento skill → atributo base
export const SKILL_ATTRIBUTES: Record<SkillKey, AttributeKey> = {
  acrobatics: 'dexterity',
  animalHandling: 'wisdom',
  arcana: 'intelligence',
  athletics: 'strength',
  deception: 'charisma',
  history: 'intelligence',
  insight: 'wisdom',
  intimidation: 'charisma',
  investigation: 'intelligence',
  medicine: 'wisdom',
  nature: 'intelligence',
  perception: 'wisdom',
  performance: 'charisma',
  persuasion: 'charisma',
  religion: 'intelligence',
  sleightOfHand: 'dexterity',
  stealth: 'dexterity',
  survival: 'wisdom',
};

// Bônus de proficiência por nível
export const PROFICIENCY_BY_LEVEL: Record<number, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

// Ordem das skills agrupadas por atributo (para exibição)
export const SKILLS_BY_ATTRIBUTE: Record<AttributeKey, SkillKey[]> = {
  strength: ['athletics'],
  dexterity: ['acrobatics', 'sleightOfHand', 'stealth'],
  constitution: [],
  intelligence: ['arcana', 'history', 'investigation', 'nature', 'religion'],
  wisdom: ['animalHandling', 'insight', 'medicine', 'perception', 'survival'],
  charisma: ['deception', 'intimidation', 'performance', 'persuasion'],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Retorna o bônus de proficiência baseado no nível do personagem
 */
export function getProficiencyBonus(level: number): number {
  return PROFICIENCY_BY_LEVEL[level] || 2;
}

/**
 * Calcula o bônus total de uma skill
 * @param attributeModifier - Modificador do atributo base
 * @param proficient - Se tem proficiência na skill
 * @param expertise - Se tem expertise na skill
 * @param proficiencyBonus - Bônus de proficiência do personagem
 * @returns Bônus total da skill
 */
export function calculateSkillBonus(
  attributeModifier: number,
  proficient: boolean,
  expertise: boolean,
  proficiencyBonus: number
): number {
  let bonus = attributeModifier;

  if (expertise) {
    // Expertise = dobro da proficiência
    bonus += proficiencyBonus * 2;
  } else if (proficient) {
    // Proficiente = adiciona proficiência normal
    bonus += proficiencyBonus;
  }

  return bonus;
}

/**
 * Cria um objeto Skills com todos os valores iniciais (não proficiente)
 */
export function getInitialSkills(): Skills {
  const skills: Partial<Skills> = {};

  const allSkills: SkillKey[] = [
    'acrobatics',
    'animalHandling',
    'arcana',
    'athletics',
    'deception',
    'history',
    'insight',
    'intimidation',
    'investigation',
    'medicine',
    'nature',
    'perception',
    'performance',
    'persuasion',
    'religion',
    'sleightOfHand',
    'stealth',
    'survival',
  ];

  allSkills.forEach((skill) => {
    skills[skill] = { proficient: false, expertise: false };
  });

  return skills as Skills;
}

/**
 * Cria um objeto Skills para o Cão com Investigação e Percepção proficientes
 */
export function getDogInitialSkills(): Skills {
  const skills = getInitialSkills();

  // Cão é proficiente em Investigação e Percepção desde o nível 1
  // E tem vantagem nessas perícias (habilidade "Cão Investigador")
  skills.investigation = { proficient: true, expertise: false, advantage: true };
  skills.perception = { proficient: true, expertise: false, advantage: true };

  return skills;
}
