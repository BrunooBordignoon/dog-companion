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
import SectionHeader from '@/app/components/SectionHeader';
import ContentBox from '@/app/components/ContentBox';
import AbilityCard from '@/app/components/AbilityCard';
import BaseAbilityCard from '@/app/components/BaseAbilityCard';
import AbilitySelectionCard from '@/app/components/AbilitySelectionCard';
import LevelSectionHeader from '@/app/components/LevelSectionHeader';
import TabNavigation from '@/app/components/TabNavigation';

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

  const canSelectAbilityForLevel = (level: 3 | 6 | 9 | 11): boolean => {
    return grimorio.level >= level;
  };

  const getAbilitiesForLevel = (level: 3 | 6 | 9 | 11): GrimorioAbility[] => {
    return GRIMORIO_ABILITIES.filter((a) => a.awakening === level);
  };

  // Check for unselected abilities
  const getUnselectedAbilityLevels = (): number[] => {
    const unselected: number[] = [];
    if (grimorio.level >= 3 && !grimorio.selectedAbilities.level3) unselected.push(3);
    if (grimorio.level >= 6 && !grimorio.selectedAbilities.level6) unselected.push(6);
    if (grimorio.level >= 9 && !grimorio.selectedAbilities.level9) unselected.push(9);
    if (grimorio.level >= 11 && !grimorio.selectedAbilities.level11) unselected.push(11);
    return unselected;
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

      <div className="mx-auto max-w-4xl px-4 py-8">
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
        {getUnselectedAbilityLevels().length > 0 && (
          <WarningBanner
            title="Habilidades Pendentes"
            message={`Você tem habilidades não selecionadas para os níveis: ${getUnselectedAbilityLevels().join(', ')}`}
            buttonText="Ir para Progressão"
            onButtonClick={() => setActiveTab('abilities')}
          />
        )}

        {/* Tabs */}
        <TabNavigation
          tabs={[
            { id: 'combat', label: 'Combate', icon: '📖' },
            { id: 'abilities', label: 'Progressão', icon: '🌾', badge: getUnselectedAbilityLevels().length },
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
                    const [borderColor, bgColor] = ABILITY_TYPE_COLORS[ability.type].split(' ');
                    return (
                      <AbilityCard
                        key={ability.id}
                        name={ability.name}
                        description={ability.description}
                        level={ability.awakening}
                        type={`${ABILITY_TYPE_NAMES[ability.type]}${ability.usage ? ` • ${ability.usage}` : ''}`}
                        borderColor={borderColor}
                        bgColor={bgColor}
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
          <div className="space-y-6">
            {/* Level 1 */}
            <div>
              <LevelSectionHeader
                level={1}
                title="Despertar Inicial"
                isLocked={grimorio.level < 1}
                isPending={false}
              />
              <div className="space-y-2">
                <BaseAbilityCard
                  level={1}
                  name="Crescimento Profano"
                  description="O personagem pode tocar o solo e acelerar o crescimento de plantas naturais — ervas, raízes, grãos, flores ou palha — em um raio de até 3 metros. Pode ser usado para camuflagem, distrações, esconder objetos, criar pequenas barreiras ou manipular o ambiente. Não causa dano, mas mostra que o campo responde à sua vontade."
                  icon="🌿"
                  isUnlocked={grimorio.level >= 1}
                  themeColor="purple"
                />
              </div>
            </div>

            {/* Level 2 */}
            <div>
              <LevelSectionHeader
                level={2}
                title="Despertar Menor"
                isLocked={grimorio.level < 2}
                isPending={false}
              />
              <div className="space-y-2">
                <BaseAbilityCard
                  level={2}
                  name="Língua dos Corvos"
                  description="O personagem pode falar com corvos e espantalhos animados. Eles compreendem ordens simples e podem relatar o que viram nas últimas 24 horas, em linguagem simbólica (&quot;asas sobre o norte&quot;, &quot;algo anda sob o solo&quot;). Isso inclui perguntas sobre desaparecimentos, viajantes ou presenças estranhas na região."
                  icon="🐦"
                  isUnlocked={grimorio.level >= 2}
                  themeColor="purple"
                />
              </div>
            </div>

          {/* Ability Selection */}
          {[3, 6, 9, 11].map((level) => {
            const canSelect = canSelectAbilityForLevel(level as 3 | 6 | 9 | 11);
            const levelKey = `level${level}` as keyof typeof grimorio.selectedAbilities;
            const selectedAbility = grimorio.selectedAbilities[levelKey];
            const abilities = getAbilitiesForLevel(level as 3 | 6 | 9 | 11);

            return (
              <div key={level}>
                <LevelSectionHeader
                  level={level}
                  title={AWAKENING_NAMES[level]}
                  isLocked={!canSelect}
                  isPending={canSelect && !selectedAbility}
                />
                <div className="space-y-2">
                  {abilities.map((ability) => {
                    const isSelected = selectedAbility?.id === ability.id;

                    return (
                      <AbilitySelectionCard
                        key={ability.id}
                        title={ability.name}
                        description={ability.description}
                        category={`${ABILITY_TYPE_NAMES[ability.type]}${ability.usage ? ` • ${ability.usage}` : ''}`}
                        isSelected={isSelected}
                        canSelect={canSelect && !readOnly}
                        onClick={() => !readOnly && selectAbility(ability)}
                        colorClasses={ABILITY_TYPE_COLORS[ability.type]}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
});

export default GrimorioPage;
