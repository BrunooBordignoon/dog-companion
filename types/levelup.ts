import { AttributeKey, Ability } from './companion';
import { SwordAbility } from './sword';
import { GrimorioAbility } from './grimorio';
import { SkillKey, Skills } from './skills';

// ============================================================================
// HP Roll Requirement
// ============================================================================

export type HPRollRequirement = {
  diceType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12';
  currentModifier: number; // Current CON modifier or similar
  modifierLabel?: string; // e.g., "CON", "FOR"
};

export type HPRollData = {
  roll: number; // The dice roll result
  modifier: number; // The modifier applied
  total: number; // roll + modifier
};

// ============================================================================
// Attribute Increase Requirement
// ============================================================================

export type AttributeIncreaseRequirement = {
  count: number; // How many attributes to increase (usually 2)
  currentAttributes: Record<AttributeKey, { value: number; modifier: number }>;
};

export type AttributeIncreaseData = {
  attributes: [AttributeKey, AttributeKey]; // Two attributes chosen (can be same)
};

// ============================================================================
// Ability Selection Requirement
// ============================================================================

export type AbilitySelectionRequirement = {
  count: number; // How many abilities to select (usually 1)
  options: (Ability | SwordAbility | GrimorioAbility)[]; // Available abilities to choose from
  levelKey: string; // e.g., "level3", "level7"
};

export type AbilitySelectionData = {
  selectedAbility: Ability | SwordAbility | GrimorioAbility;
  levelKey: string;
};

// ============================================================================
// Expertise Selection Requirement
// ============================================================================

export type ExpertiseSelectionRequirement = {
  skills: Skills; // Current skills to filter proficient ones
};

export type ExpertiseSelectionData = {
  selectedSkill: SkillKey;
};

// ============================================================================
// Auto Gains (Read-only display)
// ============================================================================

export type AutoGain = {
  icon: string;
  description: string;
};

// ============================================================================
// Level Up Requirement (Per Equipment)
// ============================================================================

export type LevelUpRequirement = {
  equipmentId: string;
  equipmentName: string;
  equipmentIcon: string;
  level: number; // The level being reached

  // Optional requirements
  hpRoll?: HPRollRequirement;
  attributeIncrease?: AttributeIncreaseRequirement;
  abilitySelection?: AbilitySelectionRequirement;
  expertiseSelection?: ExpertiseSelectionRequirement;
  autoGains?: AutoGain[]; // Things gained automatically (for display only)
};

// ============================================================================
// Level Up Data (Collected from user)
// ============================================================================

export type LevelUpData = {
  equipmentId: string;
  level: number;

  // Collected data (only present if required)
  hpRoll?: HPRollData;
  attributeIncrease?: AttributeIncreaseData;
  abilitySelection?: AbilitySelectionData;
  expertiseSelection?: ExpertiseSelectionData;
};

// ============================================================================
// Validation Helpers
// ============================================================================

export function validateHPRoll(roll: number, requirement: HPRollRequirement): boolean {
  const maxRoll = parseInt(requirement.diceType.substring(1)); // Extract number from "d6" -> 6
  return roll >= 1 && roll <= maxRoll;
}

export function isLevelUpDataComplete(data: LevelUpData, requirement: LevelUpRequirement): boolean {
  // Check HP roll if required
  if (requirement.hpRoll && !data.hpRoll) return false;

  // Check attribute increase if required
  if (requirement.attributeIncrease && !data.attributeIncrease) return false;

  // Check ability selection if required
  if (requirement.abilitySelection && !data.abilitySelection) return false;

  // Check expertise selection if required
  if (requirement.expertiseSelection && !data.expertiseSelection) return false;

  return true;
}

export function getMissingFields(data: LevelUpData, requirement: LevelUpRequirement): string[] {
  const missing: string[] = [];

  if (requirement.hpRoll && !data.hpRoll) {
    missing.push('Resultado do dado de HP');
  }

  if (requirement.attributeIncrease && !data.attributeIncrease) {
    missing.push('Seleção de atributos');
  }

  if (requirement.abilitySelection && !data.abilitySelection) {
    missing.push('Seleção de habilidade');
  }

  if (requirement.expertiseSelection && !data.expertiseSelection) {
    missing.push('Seleção de expertise');
  }

  return missing;
}
