'use client';

import { useState, useEffect } from 'react';
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
import ItemHeader from '@/app/components/ItemHeader';
import WarningBanner from '@/app/components/WarningBanner';
import SectionHeader from '@/app/components/SectionHeader';
import ContentBox from '@/app/components/ContentBox';
import AbilityCard from '@/app/components/AbilityCard';
import BaseAbilityCard from '@/app/components/BaseAbilityCard';
import AbilitySelectionCard from '@/app/components/AbilitySelectionCard';
import LevelSectionHeader from '@/app/components/LevelSectionHeader';
import TabNavigation from '@/app/components/TabNavigation';

export default function EspadaPage({
  level,
  onLevelChange
}: {
  level: number;
  onLevelChange?: (newLevel: number) => void;
}) {
  const INITIAL_SWORD_DATA: SwordData = {
    characterName: 'Soldado Desertor',
    level: level,
    selectedAbilities: {},
  };

  const [sword, setSword] = useState<SwordData>(INITIAL_SWORD_DATA);
  const [activeTab, setActiveTab] = useState<'combat' | 'abilities'>('combat');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('soldado-sword-data');
    if (saved) {
      try {
        setSword(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load sword data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('soldado-sword-data', JSON.stringify(sword));
    }
  }, [sword, isLoaded]);

  const handleLevelChange = (newLevel: number) => {
    if (newLevel < 1 || newLevel > 10) return;

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

  const canSelectAbilityForLevel = (level: 3 | 7 | 10): boolean => {
    return sword.level >= level;
  };

  const getAbilitiesForLevel = (level: 3 | 7 | 10): SwordAbility[] => {
    return SWORD_ABILITIES.filter((a) => a.awakening === level);
  };

  // Check for unselected abilities
  const getUnselectedAbilityLevels = (): number[] => {
    const unselected: number[] = [];
    if (sword.level >= 3 && !sword.selectedAbilities.level3) unselected.push(3);
    if (sword.level >= 7 && !sword.selectedAbilities.level7) unselected.push(7);
    if (sword.level >= 10 && !sword.selectedAbilities.level10) unselected.push(10);
    return unselected;
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
        />

        {/* Unselected Abilities Warning */}
        {getUnselectedAbilityLevels().length > 0 && (
          <WarningBanner
            title="Habilidades Pendentes"
            message={`Você tem habilidades não selecionadas para os níveis: ${getUnselectedAbilityLevels().join(', ')}`}
            buttonText="Ir para Despertares"
            onButtonClick={() => setActiveTab('abilities')}
          />
        )}

        {/* Tabs */}
        <TabNavigation
          tabs={[
            { id: 'combat', label: 'Combate', icon: '⚔️' },
            { id: 'abilities', label: 'Despertares', icon: '✨', badge: getUnselectedAbilityLevels().length },
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
                  Nenhuma habilidade selecionada. Selecione habilidades na aba Despertares.
                </p>
              ) : (
                <div className="space-y-3">
                  {allSelectedAbilities.map((ability) => (
                    <AbilityCard
                      key={ability.id}
                      name={ability.name}
                      description={ability.description}
                      level={ability.awakening}
                      type={ABILITY_TYPE_NAMES[ability.type]}
                      borderColor={ABILITY_TYPE_COLORS[ability.type].split(' ')[0]}
                      bgColor={ABILITY_TYPE_COLORS[ability.type].split(' ')[1]}
                    />
                  ))}
                </div>
              )}
            </ContentBox>
          </div>
        )}

        {/* Abilities Tab */}
        {activeTab === 'abilities' && (
          <div className="space-y-6">
            {/* Base Abilities */}
            <div className="space-y-3">
              <SectionHeader icon="⚔️" title="Habilidades Base" themeColor="amber" />

              <BaseAbilityCard
                level={1}
                name="Lâmina Desperta"
                description="A espada torna-se consciente, sussurrando em voz quase inaudível. Todos os golpes agora são mágicos e afetam espíritos, aparições e mortos-vivos normalmente."
                icon="⚡"
                isUnlocked={sword.level >= 1}
                themeColor="amber"
              />

              <BaseAbilityCard
                level={2}
                name="Eco do Aço"
                description="A espada armazena parte da energia das mortes que causou. O usuário recebe +1 em testes de Intimidação enquanto estiver empunhando-a. Além disso, a lâmina brilha levemente diante de presenças espirituais a até 6 metros."
                icon="🔊"
                isUnlocked={sword.level >= 2}
                themeColor="amber"
              />
            </div>

            {/* Ability Selection */}
            {[3, 7, 10].map((level) => {
              const canSelect = canSelectAbilityForLevel(level as 3 | 7 | 10);
              const levelKey = `level${level}` as keyof typeof sword.selectedAbilities;
              const selectedAbility = sword.selectedAbilities[levelKey];
              const abilities = getAbilitiesForLevel(level as 3 | 7 | 10);

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
                          category={ABILITY_TYPE_NAMES[ability.type]}
                          isSelected={isSelected}
                          canSelect={canSelect}
                          onClick={() => selectAbility(ability)}
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
}
