import { HPHistoryEntry } from '@/types/companion';

export type PendingItemType = 'hp' | 'ability' | 'attribute' | 'expertise';

export interface PendingItem {
  type: PendingItemType;
  description: string;
}

export interface LevelPendingInfo {
  level: number;
  pendingCount: number;
  pendingItems: PendingItem[];
}

/**
 * Get pending items for a specific level for Cão companion
 */
export function getCaoPendingItemsForLevel(
  level: number,
  companionLevel: number,
  hpHistory: HPHistoryEntry[],
  selectedAbilities: Record<string, any>,
  attributeIncreases: Array<{ level: number }>,
  expertiseSkill?: string
): LevelPendingInfo {
  const pendingItems: PendingItem[] = [];

  // Only check if level is unlocked
  if (level > companionLevel) {
    return { level, pendingCount: 0, pendingItems: [] };
  }

  // Check HP roll (all levels need HP with roll > 0)
  const hpEntry = hpHistory.find((e) => e.level === level);
  if (!hpEntry || hpEntry.roll === 0) {
    pendingItems.push({
      type: 'hp',
      description: 'Rolagem de HP pendente',
    });
  }

  // Check ability selection (levels 3, 5, 7, 10)
  if ([3, 5, 7, 10].includes(level)) {
    const abilityKey = `level${level}`;
    if (!selectedAbilities[abilityKey]) {
      pendingItems.push({
        type: 'ability',
        description: 'Escolha de caminho pendente',
      });
    }
  }

  // Check attribute increase (levels 3, 5, 7, 10)
  if ([3, 5, 7, 10].includes(level)) {
    const hasAttributeIncrease = attributeIncreases.find((a) => a.level === level);
    if (!hasAttributeIncrease) {
      pendingItems.push({
        type: 'attribute',
        description: 'Aumento de atributo pendente',
      });
    }
  }

  // Check expertise (level 9 only)
  if (level === 9 && !expertiseSkill) {
    pendingItems.push({
      type: 'expertise',
      description: 'Seleção de expertise pendente',
    });
  }

  return {
    level,
    pendingCount: pendingItems.length,
    pendingItems,
  };
}

/**
 * Get all pending items for all unlocked levels (Cão)
 */
export function getAllCaoPendingItems(
  companionLevel: number,
  hpHistory: HPHistoryEntry[],
  selectedAbilities: Record<string, any>,
  attributeIncreases: Array<{ level: number }>,
  expertiseSkill?: string
): LevelPendingInfo[] {
  const allPending: LevelPendingInfo[] = [];

  for (let level = 1; level <= companionLevel; level++) {
    const pending = getCaoPendingItemsForLevel(
      level,
      companionLevel,
      hpHistory,
      selectedAbilities,
      attributeIncreases,
      expertiseSkill
    );
    if (pending.pendingCount > 0) {
      allPending.push(pending);
    }
  }

  return allPending;
}

/**
 * Get total count of pending items across all levels (Cão)
 */
export function getTotalCaoPendingCount(
  companionLevel: number,
  hpHistory: HPHistoryEntry[],
  selectedAbilities: Record<string, any>,
  attributeIncreases: Array<{ level: number }>,
  expertiseSkill?: string
): number {
  const allPending = getAllCaoPendingItems(
    companionLevel,
    hpHistory,
    selectedAbilities,
    attributeIncreases,
    expertiseSkill
  );

  return allPending.reduce((sum, item) => sum + item.pendingCount, 0);
}

/**
 * Get pending items for Espada (Sword) - only abilities
 */
export function getEspadaPendingItemsForLevel(
  level: number,
  swordLevel: number,
  selectedAbilities: Record<string, any>
): LevelPendingInfo {
  const pendingItems: PendingItem[] = [];

  if (level > swordLevel) {
    return { level, pendingCount: 0, pendingItems: [] };
  }

  // Check ability selection for awakening levels (3, 7, 10)
  if ([3, 7, 10].includes(level)) {
    const abilityKey = `level${level}`;
    if (!selectedAbilities[abilityKey]) {
      pendingItems.push({
        type: 'ability',
        description: 'Escolha de habilidade pendente',
      });
    }
  }

  return {
    level,
    pendingCount: pendingItems.length,
    pendingItems,
  };
}

/**
 * Get total count for Espada
 */
export function getTotalEspadaPendingCount(
  swordLevel: number,
  selectedAbilities: Record<string, any>
): number {
  let total = 0;
  for (let level = 1; level <= swordLevel; level++) {
    const pending = getEspadaPendingItemsForLevel(level, swordLevel, selectedAbilities);
    total += pending.pendingCount;
  }
  return total;
}

/**
 * Get pending items for Grimório - similar to Espada (awakenings)
 */
export function getGrimorioPendingItemsForLevel(
  level: number,
  grimorioLevel: number,
  selectedAwakenings: Record<string, any>
): LevelPendingInfo {
  const pendingItems: PendingItem[] = [];

  if (level > grimorioLevel) {
    return { level, pendingCount: 0, pendingItems: [] };
  }

  // Check awakening selection for levels (3, 6, 9, 11)
  // Levels 1 and 2 are base abilities that are automatic
  if ([3, 6, 9, 11].includes(level)) {
    const awakeningKey = `level${level}`;
    if (!selectedAwakenings[awakeningKey]) {
      pendingItems.push({
        type: 'ability',
        description: 'Escolha de despertar pendente',
      });
    }
  }

  return {
    level,
    pendingCount: pendingItems.length,
    pendingItems,
  };
}

/**
 * Get total count for Grimório
 */
export function getTotalGrimorioPendingCount(
  grimorioLevel: number,
  selectedAwakenings: Record<string, any>
): number {
  let total = 0;
  for (let level = 1; level <= grimorioLevel; level++) {
    const pending = getGrimorioPendingItemsForLevel(level, grimorioLevel, selectedAwakenings);
    total += pending.pendingCount;
  }
  return total;
}
