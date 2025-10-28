'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  SwordData,
  SwordAbility,
  SWORD_ABILITIES,
  AWAKENING_NAMES,
  ABILITY_TYPE_NAMES,
  ABILITY_TYPE_COLORS,
  getAwakeningLevel,
  getBaseDamage,
  getSwordBonus,
} from '@/types/sword';
import {
  LevelUpRequirement,
  LevelUpData,
} from '@/types/levelup';
import ItemHeader from '@/app/components/ItemHeader';
import WarningBanner from '@/app/components/WarningBanner';
import SectionHeader from '@/app/components/SectionHeader';
import ContentBox from '@/app/components/ContentBox';
import AbilityCard from '@/app/components/AbilityCard';
import BaseAbilityCard from '@/app/components/BaseAbilityCard';
import AbilitySelectionCard from '@/app/components/AbilitySelectionCard';
import EnhancedAbilityCard from '@/app/components/EnhancedAbilityCard';
import LevelAccordion from '@/app/components/LevelAccordion';
import TabNavigation from '@/app/components/TabNavigation';
import {
  getEspadaPendingItemsForLevel,
  getTotalEspadaPendingCount,
} from '@/app/utils/pendingItems';

export interface EspadaPageRef {
  getLevelUpRequirement: (level: number) => LevelUpRequirement | null;
  confirmLevelUp: (data: LevelUpData) => void;
}

const EspadaPage = forwardRef<EspadaPageRef, {
  level: number;
  onLevelChange?: (newLevel: number) => void;
  readOnly?: boolean;
  initialData?: Record<string, string>;
}>(function EspadaPage({ level, onLevelChange, readOnly = false, initialData }, ref) {
  const INITIAL_SWORD_DATA: SwordData = {
    characterName: 'Soldado Desertor',
    level: level,
    selectedAbilities: {},
  };

  const [sword, setSword] = useState<SwordData>(INITIAL_SWORD_DATA);
  const [activeTab, setActiveTab] = useState<'combat' | 'abilities'>('combat');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage or initialData
  useEffect(() => {
    // Se readOnly, carregar dados do initialData ao invés do localStorage
    if (readOnly && initialData) {
      const saved = initialData['soldado-sword-data'];
      if (saved) {
        try {
          setSword(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load sword data:', e);
        }
      }
      setIsLoaded(true);
      return;
    }

    // Modo normal: carregar do localStorage
    const saved = localStorage.getItem('soldado-sword-data');
    if (saved) {
      try {
        setSword(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load sword data:', e);
      }
    }
    setIsLoaded(true);
  }, [readOnly, initialData]);

  // Save to localStorage (only if not readOnly)
  useEffect(() => {
    if (isLoaded && !readOnly) {
      localStorage.setItem('soldado-sword-data', JSON.stringify(sword));
    }
  }, [sword, isLoaded, readOnly]);

  // Function exposed to parent to get level-up requirements
  const getLevelUpRequirement = (targetLevel: number): LevelUpRequirement | null => {
    if (targetLevel < 1 || targetLevel > 10) return null;
    if (targetLevel <= sword.level) return null; // No requirement for level-down

    // Espada only requires ability selection on levels 3, 7, 10
    if (![3, 7, 10].includes(targetLevel)) return null;

    const levelKey = `level${targetLevel}` as keyof typeof sword.selectedAbilities;
    const abilitiesForLevel = SWORD_ABILITIES.filter((a) => a.awakening === targetLevel);

    if (abilitiesForLevel.length === 0) return null;

    const requirement: LevelUpRequirement = {
      equipmentId: 'espada',
      equipmentName: 'Ceifadora dos Sussurros',
      equipmentIcon: '⚔️',
      level: targetLevel,
      abilitySelection: {
        count: 1,
        options: abilitiesForLevel,
        levelKey,
      },
    };

    return requirement;
  };

  // Function exposed to parent to confirm level-up with collected data
  const handleConfirmLevelUp = (data: LevelUpData) => {
    if (data.equipmentId !== 'espada') return;

    const newLevel = data.level;

    // Process ability selection
    if (data.abilitySelection) {
      setSword({
        ...sword,
        level: newLevel,
        selectedAbilities: {
          ...sword.selectedAbilities,
          [data.abilitySelection.levelKey]: data.abilitySelection.selectedAbility as SwordAbility,
        },
      });
    } else {
      // No ability selection (shouldn't happen for espada level-up, but handle it)
      setSword({
        ...sword,
        level: newLevel,
      });
    }
  };

  // Handle level-down (called when level prop changes to lower value)
  const handleLevelChange = (newLevel: number) => {
    if (newLevel < 1 || newLevel > 10) return;
    if (newLevel >= sword.level) return; // Level-up is handled by parent now

    const newSelectedAbilities = { ...sword.selectedAbilities };

    // Remove abilities if level goes below awakening threshold
    if (newLevel < 3) delete newSelectedAbilities.level3;
    if (newLevel < 7) delete newSelectedAbilities.level7;
    if (newLevel < 10) delete newSelectedAbilities.level10;

    setSword({
      ...sword,
      level: newLevel,
      selectedAbilities: newSelectedAbilities,
    });
  };

  // Expose functions to parent via ref
  useImperativeHandle(ref, () => ({
    getLevelUpRequirement,
    confirmLevelUp: handleConfirmLevelUp,
  }), [sword]);

  // Sync sword level with prop level
  useEffect(() => {
    if (isLoaded && level !== sword.level) {
      handleLevelChange(level);
    }
  }, [level, isLoaded, sword.level, handleLevelChange]);

  const selectAbility = (ability: SwordAbility) => {
    const awakeningKey = `level${ability.awakening}` as keyof typeof sword.selectedAbilities;

    setSword({
      ...sword,
      selectedAbilities: {
        ...sword.selectedAbilities,
        [awakeningKey]: ability,
      },
    });
  };

  const getAbilitiesForLevel = (level: 3 | 7 | 10): SwordAbility[] => {
    return SWORD_ABILITIES.filter((a) => a.awakening === level);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  const currentAwakening = getAwakeningLevel(sword.level);

  // Build list of all selected abilities including base abilities
  const allSelectedAbilities: SwordAbility[] = [];

  // Add base abilities based on level
  if (sword.level >= 1) {
    const level1Ability = SWORD_ABILITIES.find(a => a.awakening === 1);
    if (level1Ability) allSelectedAbilities.push(level1Ability);
  }
  if (sword.level >= 2) {
    const level2Ability = SWORD_ABILITIES.find(a => a.awakening === 2);
    if (level2Ability) allSelectedAbilities.push(level2Ability);
  }

  // Add selected abilities
  if (sword.selectedAbilities.level3) allSelectedAbilities.push(sword.selectedAbilities.level3);
  if (sword.selectedAbilities.level7) allSelectedAbilities.push(sword.selectedAbilities.level7);
  if (sword.selectedAbilities.level10) allSelectedAbilities.push(sword.selectedAbilities.level10);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <ItemHeader
          itemName="Ceifadora dos Sussurros"
          itemType="Arma Sentiente"
          itemLevel={sword.level}
          itemLevelDescription={AWAKENING_NAMES[currentAwakening]}
          itemSubtitle="Espada Longa"
          itemAlignment="Caótico Neutro"
          itemDescription="Lâmina Sussurrante de Almas"
          themeColor="red"
          maxLevel={10}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-red-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6.92 5H5l9 9 9-9h-1.92L12 13.08z" />
              <path d="M12 3L2 12h3l7-7 7 7h3L12 3z" />
            </svg>
          }
          allowNameEdit={false}
          readOnly={readOnly}
        />

        {/* Unselected Abilities Warning */}
        {getTotalEspadaPendingCount(sword.level, sword.selectedAbilities) > 0 && (
          <WarningBanner
            title="Habilidades Pendentes"
            message="Você tem habilidades não selecionadas. Vá para a aba Progressão para completar suas escolhas."
            buttonText="Ir para Progressão"
            onButtonClick={() => setActiveTab('abilities')}
          />
        )}

        {/* Tabs */}
        <TabNavigation
          tabs={[
            { id: 'combat', label: 'Combate', icon: '⚔️' },
            { id: 'abilities', label: 'Progressão', icon: '✨', badge: getTotalEspadaPendingCount(sword.level, sword.selectedAbilities) },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'combat' | 'abilities')}
          themeColor="red"
        />

        {/* Combat Tab */}
        {activeTab === 'combat' && (
          <div className="space-y-6">
            {/* Weapon Stats */}
            <ContentBox title="Estatísticas da Arma" themeColor="red">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded border border-neutral-700/50 bg-neutral-950/50 p-3">
                  <div className="text-sm text-neutral-400">Tipo</div>
                  <div className="text-lg font-semibold text-amber-100">Espada Longa Mágica</div>
                </div>
                <div className="rounded border border-neutral-700/50 bg-neutral-950/50 p-3">
                  <div className="text-sm text-neutral-400">Bônus</div>
                  <div className="text-lg font-semibold text-amber-100">{getSwordBonus()}</div>
                </div>
                <div className="rounded border border-neutral-700/50 bg-neutral-950/50 p-3">
                  <div className="text-sm text-neutral-400">Dano Base</div>
                  <div className="text-lg font-semibold text-amber-100">{getBaseDamage()}</div>
                </div>
                <div className="rounded border border-neutral-700/50 bg-neutral-950/50 p-3">
                  <div className="text-sm text-neutral-400">Tipo de Dano</div>
                  <div className="text-lg font-semibold text-amber-100">Cortante</div>
                </div>
              </div>
            </ContentBox>

            {/* Active Abilities Summary */}
            <ContentBox title="Habilidades Ativas" themeColor="red">
              {allSelectedAbilities.length === 0 ? (
                <p className="text-neutral-400">
                  Nenhuma habilidade selecionada. Selecione habilidades na aba Progressão.
                </p>
              ) : (
                <div className="space-y-3">
                  {allSelectedAbilities.map((ability) => (
                    <EnhancedAbilityCard
                      key={ability.id}
                      name={ability.name}
                      description={ability.description}
                      type={ability.type}
                      actionType={ability.actionType}
                      range={ability.range}
                      duration={ability.duration}
                      damageType={ability.damageType}
                      damage={ability.damage}
                      savingThrow={ability.savingThrow}
                      condition={ability.condition}
                      limit={ability.limit}
                      cost={ability.cost}
                      isUnlocked={true}
                      isSelected={false}
                      canSelect={false}
                      themeColor="red"
                    />
                  ))}
                </div>
              )}
            </ContentBox>
          </div>
        )}

        {/* Abilities Tab */}
        {activeTab === 'abilities' && (
          <div className="space-y-3">
            {/* Level 1 - Eco do Aço */}
            <LevelAccordion
              level={1}
              title="Despertar Inicial"
              isLocked={sword.level < 1}
              isPending={false}
              pendingCount={0}
              defaultOpen={sword.level === 1}
              themeColor="red"
            >
              {(() => {
                const ability = SWORD_ABILITIES.find(a => a.awakening === 1);
                return ability ? (
                  <EnhancedAbilityCard
                    name={ability.name}
                    description={ability.description}
                    type={ability.type}
                    actionType={ability.actionType}
                    range={ability.range}
                    duration={ability.duration}
                    damageType={ability.damageType}
                    damage={ability.damage}
                    savingThrow={ability.savingThrow}
                    condition={ability.condition}
                    limit={ability.limit}
                    cost={ability.cost}
                    isUnlocked={sword.level >= 1}
                    isSelected={false}
                    canSelect={false}
                    themeColor="red"
                  />
                ) : null;
              })()}
            </LevelAccordion>

            {/* Level 2 - Lâmina Desperta */}
            <LevelAccordion
              level={2}
              title="Despertar Menor"
              isLocked={sword.level < 2}
              isPending={false}
              pendingCount={0}
              defaultOpen={sword.level === 2}
              themeColor="red"
            >
              {(() => {
                const ability = SWORD_ABILITIES.find(a => a.awakening === 2);
                return ability ? (
                  <EnhancedAbilityCard
                    name={ability.name}
                    description={ability.description}
                    type={ability.type}
                    actionType={ability.actionType}
                    range={ability.range}
                    duration={ability.duration}
                    damageType={ability.damageType}
                    damage={ability.damage}
                    savingThrow={ability.savingThrow}
                    condition={ability.condition}
                    limit={ability.limit}
                    cost={ability.cost}
                    isUnlocked={sword.level >= 2}
                    isSelected={false}
                    canSelect={false}
                    themeColor="red"
                  />
                ) : null;
              })()}
            </LevelAccordion>

            {/* Ability Selection */}
            {[3, 7, 10].map((level) => {
              const levelKey = `level${level}` as keyof typeof sword.selectedAbilities;
              const selectedAbility = sword.selectedAbilities[levelKey];
              const abilities = getAbilitiesForLevel(level as 3 | 7 | 10);
              const pendingInfo = getEspadaPendingItemsForLevel(level, sword.level, sword.selectedAbilities);

              return (
                <LevelAccordion
                  key={level}
                  level={level}
                  title={AWAKENING_NAMES[level]}
                  isLocked={sword.level < level}
                  isPending={pendingInfo.pendingCount > 0}
                  pendingCount={pendingInfo.pendingCount}
                  defaultOpen={sword.level === level}
                  themeColor="red"
                >
                  <div className="space-y-3">
                    {abilities.map((ability) => {
                      const isSelected = selectedAbility?.id === ability.id;

                      return (
                        <EnhancedAbilityCard
                          key={ability.id}
                          name={ability.name}
                          description={ability.description}
                          type={ability.type}
                          actionType={ability.actionType}
                          range={ability.range}
                          duration={ability.duration}
                          damageType={ability.damageType}
                          damage={ability.damage}
                          savingThrow={ability.savingThrow}
                          condition={ability.condition}
                          limit={ability.limit}
                          cost={ability.cost}
                          isUnlocked={sword.level >= level}
                          isSelected={isSelected}
                          canSelect={sword.level >= level && !readOnly}
                          onClick={() => !readOnly && selectAbility(ability)}
                          themeColor="red"
                        />
                      );
                    })}
                  </div>
                </LevelAccordion>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default EspadaPage;
