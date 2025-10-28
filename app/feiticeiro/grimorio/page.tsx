'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  GrimorioData,
  GrimorioAbility,
  GRIMORIO_ABILITIES,
  AWAKENING_NAMES,
  ABILITY_TYPE_NAMES,
  ABILITY_TYPE_COLORS,
  getAwakeningLevel,
} from '@/types/grimorio';
import {
  LevelUpRequirement,
  LevelUpData,
} from '@/types/levelup';
import ItemHeader from '@/app/components/ItemHeader';
import WarningBanner from '@/app/components/WarningBanner';
import ContentBox from '@/app/components/ContentBox';
import AbilityCard from '@/app/components/AbilityCard';
import BaseAbilityCard from '@/app/components/BaseAbilityCard';
import AbilitySelectionCard from '@/app/components/AbilitySelectionCard';
import LevelAccordion from '@/app/components/LevelAccordion';
import TabNavigation from '@/app/components/TabNavigation';
import EnhancedAbilityCard from '@/app/components/EnhancedAbilityCard';
import {
  getGrimorioPendingItemsForLevel,
  getTotalGrimorioPendingCount,
} from '@/app/utils/pendingItems';

export interface GrimorioPageRef {
  getLevelUpRequirement: (level: number) => LevelUpRequirement | null;
  confirmLevelUp: (data: LevelUpData) => void;
}

const GrimorioPage = forwardRef<GrimorioPageRef, {
  level: number;
  onLevelChange?: (newLevel: number) => void;
  readOnly?: boolean;
  initialData?: Record<string, string>;
}>(function GrimorioPage({ level, onLevelChange, readOnly = false, initialData }, ref) {
  const INITIAL_GRIMORIO_DATA: GrimorioData = {
    characterName: 'Welliton',
    level: level,
    selectedAbilities: {},
  };

  const [grimorio, setGrimorio] = useState<GrimorioData>(INITIAL_GRIMORIO_DATA);
  const [activeTab, setActiveTab] = useState<'combat' | 'abilities'>('combat');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage or initialData
  useEffect(() => {
    // Se readOnly, carregar dados do initialData ao invés do localStorage
    if (readOnly && initialData) {
      const saved = initialData['feiticeiro-grimorio-data'];
      if (saved) {
        try {
          setGrimorio(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load grimorio data:', e);
        }
      }
      setIsLoaded(true);
      return;
    }

    // Modo normal: carregar do localStorage
    const saved = localStorage.getItem('feiticeiro-grimorio-data');
    if (saved) {
      try {
        setGrimorio(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load grimorio data:', e);
      }
    }
    setIsLoaded(true);
  }, [readOnly, initialData]);

  // Save to localStorage (only if not readOnly)
  useEffect(() => {
    if (isLoaded && !readOnly) {
      localStorage.setItem('feiticeiro-grimorio-data', JSON.stringify(grimorio));
    }
  }, [grimorio, isLoaded, readOnly]);

  // Function exposed to parent to get level-up requirements
  const getLevelUpRequirement = (targetLevel: number): LevelUpRequirement | null => {
    if (targetLevel < 1 || targetLevel > 20) return null;
    if (targetLevel <= grimorio.level) return null; // No requirement for level-down

    // Grimório only requires ability selection on levels 3, 6, 9, 11
    if (![3, 6, 9, 11].includes(targetLevel)) return null;

    const levelKey = `level${targetLevel}` as keyof typeof grimorio.selectedAbilities;
    const abilitiesForLevel = GRIMORIO_ABILITIES.filter((a) => a.awakening === targetLevel);

    if (abilitiesForLevel.length === 0) return null;

    const requirement: LevelUpRequirement = {
      equipmentId: 'grimorio',
      equipmentName: 'O Livro da Última Safra',
      equipmentIcon: '📖',
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
    if (data.equipmentId !== 'grimorio') return;

    const newLevel = data.level;

    // Process ability selection
    if (data.abilitySelection) {
      setGrimorio({
        ...grimorio,
        level: newLevel,
        selectedAbilities: {
          ...grimorio.selectedAbilities,
          [data.abilitySelection.levelKey]: data.abilitySelection.selectedAbility as GrimorioAbility,
        },
      });
    } else {
      // No ability selection (for levels 1, 2, 4, 5, 7, 8, 10, 12-20)
      setGrimorio({
        ...grimorio,
        level: newLevel,
      });
    }
  };

  // Handle level-down (called when level prop changes to lower value)
  const handleLevelChange = (newLevel: number) => {
    if (newLevel < 1 || newLevel > 20) return;
    if (newLevel >= grimorio.level) return; // Level-up is handled by parent now

    const newSelectedAbilities = { ...grimorio.selectedAbilities };

    // Remove abilities if level goes below awakening threshold
    if (newLevel < 3) delete newSelectedAbilities.level3;
    if (newLevel < 6) delete newSelectedAbilities.level6;
    if (newLevel < 9) delete newSelectedAbilities.level9;
    if (newLevel < 11) delete newSelectedAbilities.level11;

    setGrimorio({
      ...grimorio,
      level: newLevel,
      selectedAbilities: newSelectedAbilities,
    });
  };

  // Expose functions to parent via ref
  useImperativeHandle(ref, () => ({
    getLevelUpRequirement,
    confirmLevelUp: handleConfirmLevelUp,
  }), [grimorio]);

  // Sync grimorio level with prop level
  useEffect(() => {
    if (isLoaded && level !== grimorio.level) {
      handleLevelChange(level);
    }
  }, [level, isLoaded, grimorio.level, handleLevelChange]);

  const selectAbility = (ability: GrimorioAbility) => {
    const awakeningKey = `level${ability.awakening}` as keyof typeof grimorio.selectedAbilities;

    setGrimorio({
      ...grimorio,
      selectedAbilities: {
        ...grimorio.selectedAbilities,
        [awakeningKey]: ability,
      },
    });
  };

  const getAbilitiesForLevel = (level: 3 | 6 | 9 | 11): GrimorioAbility[] => {
    return GRIMORIO_ABILITIES.filter((a) => a.awakening === level);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  const currentAwakening = getAwakeningLevel(grimorio.level);

  // Build list of all selected abilities including base abilities
  const allSelectedAbilities: GrimorioAbility[] = [];

  // Add base abilities based on level
  if (grimorio.level >= 1) {
    const level1Ability = GRIMORIO_ABILITIES.find(a => a.awakening === 1);
    if (level1Ability) allSelectedAbilities.push(level1Ability);
  }
  if (grimorio.level >= 2) {
    const level2Ability = GRIMORIO_ABILITIES.find(a => a.awakening === 2);
    if (level2Ability) allSelectedAbilities.push(level2Ability);
  }

  // Add selected abilities
  if (grimorio.selectedAbilities.level3) allSelectedAbilities.push(grimorio.selectedAbilities.level3);
  if (grimorio.selectedAbilities.level6) allSelectedAbilities.push(grimorio.selectedAbilities.level6);
  if (grimorio.selectedAbilities.level9) allSelectedAbilities.push(grimorio.selectedAbilities.level9);
  if (grimorio.selectedAbilities.level11) allSelectedAbilities.push(grimorio.selectedAbilities.level11);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">

      <div className="mx-auto max-w-4xl py-8">
        {/* Header */}
        <ItemHeader
          itemName="O Livro da Última Safra"
          itemType="Grimório Amaldiçoado"
          itemLevel={grimorio.level}
          itemLevelDescription={AWAKENING_NAMES[currentAwakening]}
          itemSubtitle="Tomo Profano"
          itemAlignment="Neutro Maligno"
          itemDescription="Sussurros da Colheita Eterna"
          themeColor="purple"
          maxLevel={11}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-purple-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 2C4.89 2 4 2.9 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2M13 3.5L18.5 9H13M8 12V14H16V12M8 16V18H13V16" />
            </svg>
          }
          allowNameEdit={false}
          readOnly={readOnly}
        />

        {/* Unselected Abilities Warning */}
        {getTotalGrimorioPendingCount(grimorio.level, grimorio.selectedAbilities) > 0 && (
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
            { id: 'combat', label: 'Combate', icon: '📖' },
            { id: 'abilities', label: 'Progressão', icon: '🌾', badge: getTotalGrimorioPendingCount(grimorio.level, grimorio.selectedAbilities) },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'combat' | 'abilities')}
          themeColor="purple"
        />

        {/* Combat Tab */}
        {activeTab === 'combat' && (
          <div className="space-y-6">
            {/* Active Abilities Summary */}
            <ContentBox title="Habilidades Ativas" themeColor="purple">
              {allSelectedAbilities.length === 0 ? (
                <p className="text-neutral-400">
                  Nenhuma habilidade selecionada. Selecione habilidades na aba Progressão.
                </p>
              ) : (
                <div className="space-y-3">
                  {allSelectedAbilities.map((ability) => {
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
                        isUnlocked={true}
                        isSelected={false}
                        canSelect={false}
                        themeColor="purple"
                      />
                    );
                  })}
                </div>
              )}
            </ContentBox>
          </div>
        )}

        {/* Abilities Tab */}
        {activeTab === 'abilities' && (
          <div className="space-y-3">
            {/* Level 1 */}
            <LevelAccordion
              level={1}
              title="Despertar Inicial"
              isLocked={grimorio.level < 1}
              isPending={false}
              pendingCount={0}
              defaultOpen={grimorio.level === 1}
              themeColor="purple"
            >
              {(() => {
                const ability = GRIMORIO_ABILITIES.find(a => a.awakening === 1);
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
                    isUnlocked={grimorio.level >= 1}
                    isSelected={false}
                    canSelect={false}
                    themeColor="purple"
                  />
                ) : null;
              })()}
            </LevelAccordion>

            {/* Level 2 */}
            <LevelAccordion
              level={2}
              title="Despertar Menor"
              isLocked={grimorio.level < 2}
              isPending={false}
              pendingCount={0}
              defaultOpen={grimorio.level === 2}
              themeColor="purple"
            >
              {(() => {
                const ability = GRIMORIO_ABILITIES.find(a => a.awakening === 2);
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
                    isUnlocked={grimorio.level >= 2}
                    isSelected={false}
                    canSelect={false}
                    themeColor="purple"
                  />
                ) : null;
              })()}
            </LevelAccordion>

            {/* Ability Selection */}
            {[3, 6, 9, 11].map((level) => {
              const levelKey = `level${level}` as keyof typeof grimorio.selectedAbilities;
              const selectedAbility = grimorio.selectedAbilities[levelKey];
              const abilities = getAbilitiesForLevel(level as 3 | 6 | 9 | 11);
              const pendingInfo = getGrimorioPendingItemsForLevel(level, grimorio.level, grimorio.selectedAbilities);

              return (
                <LevelAccordion
                  key={level}
                  level={level}
                  title={AWAKENING_NAMES[level]}
                  isLocked={grimorio.level < level}
                  isPending={pendingInfo.pendingCount > 0}
                  pendingCount={pendingInfo.pendingCount}
                  defaultOpen={grimorio.level === level}
                  themeColor="purple"
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
                          isUnlocked={grimorio.level >= level}
                          isSelected={isSelected}
                          canSelect={grimorio.level >= level && !readOnly}
                          onClick={() => !readOnly && selectAbility(ability)}
                          themeColor="purple"
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

export default GrimorioPage;
