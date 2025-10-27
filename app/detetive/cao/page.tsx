'use client';

import { useState, useEffect } from 'react';
import {
  CompanionData,
  ABILITIES,
  PATH_NAMES,
  PATH_COLORS,
  calculateModifier,
  calculateMaxHP,
  getInitialHPHistory,
  getDamageForLevel,
  Ability,
  HPHistoryEntry,
  AttributeKey,
  ATTRIBUTE_NAMES,
  ATTRIBUTE_ABBR,
  PathType,
} from '@/types/companion';
import ItemHeader from '@/app/components/ItemHeader';
import StatCard from '@/app/components/StatCard';
import AttributeGrid from '@/app/components/AttributeGrid';
import WarningBanner from '@/app/components/WarningBanner';
import SectionHeader from '@/app/components/SectionHeader';
import ContentBox from '@/app/components/ContentBox';
import AbilityCard from '@/app/components/AbilityCard';
import BaseAbilityCard from '@/app/components/BaseAbilityCard';
import AbilitySelectionCard from '@/app/components/AbilitySelectionCard';
import LevelSectionHeader from '@/app/components/LevelSectionHeader';
import PathInfoCard from '@/app/components/PathInfoCard';
import TabNavigation from '@/app/components/TabNavigation';

export default function CaoPage({
  level,
  onLevelChange
}: {
  level: number;
  onLevelChange?: (newLevel: number) => void;
}) {

  const [activeTab, setActiveTab] = useState<'combat' | 'abilities' | 'hp'>('combat');
  const [isLoaded, setIsLoaded] = useState(false);

  const getInitialCompanionData = (): CompanionData => ({
    name: 'Companheiro Canino',
    level: level,
    hp: 7,
    maxHp: 7,
    ac: 13,
    speed: 12,
    attributes: {
      strength: { value: 10, modifier: 0 },
      dexterity: { value: 14, modifier: 2 },
      constitution: { value: 12, modifier: 1 },
      intelligence: { value: 3, modifier: -4 },
      wisdom: { value: 14, modifier: 2 },
      charisma: { value: 8, modifier: -1 },
    },
    selectedAbilities: {},
    hpHistory: getInitialHPHistory(1),
    attributeIncreases: [],
  });

  const [companion, setCompanion] = useState<CompanionData>(getInitialCompanionData());

  const [showHPModal, setShowHPModal] = useState(false);
  const [newHPRoll, setNewHPRoll] = useState<string>('1');
  const [selectedAttribute1, setSelectedAttribute1] = useState<AttributeKey>('strength');
  const [selectedAttribute2, setSelectedAttribute2] = useState<AttributeKey>('strength');
  const [pendingLevel, setPendingLevel] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dogCompanion');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompanion(data);
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever companion changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dogCompanion', JSON.stringify(companion));
    }
  }, [companion, isLoaded]);

  const handleLevelChange = (newLevel: number) => {
    if (newLevel < 1 || newLevel > 11) return;

    if (newLevel > companion.level) {
      // Leveling up - store pending level and show HP modal
      setPendingLevel(newLevel);
      setShowHPModal(true);
    } else if (newLevel < companion.level) {
      // Leveling down - remove HP history entries, attribute increases, and abilities
      const newHistory = companion.hpHistory.filter((entry) => entry.level <= newLevel);
      const newAttributeIncreases = companion.attributeIncreases.filter((inc) => inc.level <= newLevel);

      // Remove abilities above new level
      const newSelectedAbilities = { ...companion.selectedAbilities };
      if (newLevel < 3) delete newSelectedAbilities.level3;
      if (newLevel < 5) delete newSelectedAbilities.level5;
      if (newLevel < 7) delete newSelectedAbilities.level7;
      if (newLevel < 10) delete newSelectedAbilities.level10;

      // Recalculate attributes from scratch
      const baseAttributes = {
        strength: { value: 10, modifier: 0 },
        dexterity: { value: 14, modifier: 2 },
        constitution: { value: 12, modifier: 1 },
        intelligence: { value: 3, modifier: -4 },
        wisdom: { value: 14, modifier: 2 },
        charisma: { value: 8, modifier: -1 },
      };

      // Apply all remaining attribute increases
      newAttributeIncreases.forEach((inc) => {
        inc.attributes.forEach((attr) => {
          baseAttributes[attr].value += 1;
          baseAttributes[attr].modifier = calculateModifier(baseAttributes[attr].value);
        });
      });

      const newMaxHp = calculateMaxHP(newHistory);
      setCompanion({
        ...companion,
        level: newLevel,
        attributes: baseAttributes,
        hpHistory: newHistory,
        attributeIncreases: newAttributeIncreases,
        selectedAbilities: newSelectedAbilities,
        maxHp: newMaxHp,
        hp: Math.min(companion.hp, newMaxHp),
      });
    }
  };

  // Sync companion level with prop level
  useEffect(() => {
    if (isLoaded && level !== companion.level) {
      handleLevelChange(level);
    }
  }, [level, isLoaded, companion.level, handleLevelChange]);

  const confirmLevelUp = () => {
    // Validate HP roll
    const hpRollValue = parseInt(newHPRoll);
    if (!newHPRoll || isNaN(hpRollValue) || hpRollValue < 1 || hpRollValue > 6) {
      alert('Por favor, insira um valor válido entre 1 e 6 para a rolagem do d6.');
      return;
    }

    const newLevel = pendingLevel || companion.level + 1;
    const isAbilityLevel = [3, 5, 7, 10].includes(newLevel);

    // Update attributes only on ability levels
    const newAttributes = { ...companion.attributes };
    let newAttributeIncreases = [...companion.attributeIncreases];

    if (isAbilityLevel) {
      const attr1 = selectedAttribute1;
      const attr2 = selectedAttribute2;

      // Increase first attribute
      const newValue1 = newAttributes[attr1].value + 1;
      newAttributes[attr1] = {
        value: newValue1,
        modifier: calculateModifier(newValue1),
      };

      // Increase second attribute
      const newValue2 = newAttributes[attr2].value + (attr1 === attr2 ? 1 : 1);
      newAttributes[attr2] = {
        value: newValue2,
        modifier: calculateModifier(newValue2),
      };

      // Save attribute increase
      newAttributeIncreases = [
        ...companion.attributeIncreases,
        { level: newLevel, attributes: [attr1, attr2] as [AttributeKey, AttributeKey] },
      ];
    }

    // Use updated CON modifier for HP calculation
    const conModifier = newAttributes.constitution.modifier;
    const total = hpRollValue + conModifier;

    const newEntry: HPHistoryEntry = {
      level: newLevel,
      roll: hpRollValue,
      modifier: conModifier,
      total,
    };

    const newHistory = [...companion.hpHistory, newEntry];
    const newMaxHp = calculateMaxHP(newHistory);

    setCompanion({
      ...companion,
      level: newLevel,
      attributes: newAttributes,
      hpHistory: newHistory,
      maxHp: newMaxHp,
      hp: companion.hp + total,
      attributeIncreases: newAttributeIncreases,
    });

    setPendingLevel(null);
    setShowHPModal(false);
    setNewHPRoll('1');
    setSelectedAttribute1('strength');
    setSelectedAttribute2('strength');
  };

  const cancelLevelUp = () => {
    // Reset to current level when canceling
    if (pendingLevel && onLevelChange) {
      onLevelChange(companion.level);
    }
    setPendingLevel(null);
    setShowHPModal(false);
    setNewHPRoll('1');
    setSelectedAttribute1('strength');
    setSelectedAttribute2('strength');
  };

  const handleHPChange = (newHp: number) => {
    setCompanion({
      ...companion,
      hp: Math.max(0, Math.min(newHp, companion.maxHp)),
    });
  };

  const selectAbility = (ability: Ability) => {
    const levelKey = `level${ability.level}` as keyof typeof companion.selectedAbilities;
    setCompanion({
      ...companion,
      selectedAbilities: {
        ...companion.selectedAbilities,
        [levelKey]: ability,
      },
    });
  };

  const canSelectAbilityForLevel = (level: 3 | 5 | 7 | 10): boolean => {
    return companion.level >= level;
  };

  const getAbilitiesForLevel = (level: 3 | 5 | 7 | 10): Ability[] => {
    return ABILITIES.filter((a) => a.level === level);
  };

  const handleNameChange = (newName: string) => {
    setCompanion({ ...companion, name: newName });
  };

  // Check for unselected abilities
  const getUnselectedAbilityLevels = (): number[] => {
    const unselected: number[] = [];
    if (companion.level >= 3 && !companion.selectedAbilities.level3) unselected.push(3);
    if (companion.level >= 5 && !companion.selectedAbilities.level5) unselected.push(5);
    if (companion.level >= 7 && !companion.selectedAbilities.level7) unselected.push(7);
    if (companion.level >= 10 && !companion.selectedAbilities.level10) unselected.push(10);
    return unselected;
  };

  // Get active abilities that grant attacks
  const getExtraAttacks = () => {
    const attacks: Array<{
      name: string;
      description: string;
      damage: string;
      path: PathType;
    }> = [];
    const selected = Object.values(companion.selectedAbilities).filter(Boolean);

    selected.forEach((ability) => {
      // Only include abilities at or below current level
      if (ability && ability.level <= companion.level) {
        if (ability.id === 'investida-predatoria') {
          attacks.push({
            name: 'Investida Predatória',
            description: '1/descanso curto. Corre 6m em linha reta e ataca. Alvo faz teste FOR (CD 13) ou cai.',
            damage: 'Mordida + 1d8',
            path: ability.path,
          });
        }
      }
    });

    return attacks;
  };

  // Prevent hydration mismatch by not rendering until client-side is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center">
          <div className="text-amber-100">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">

      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Header */}
        <ItemHeader
          itemName={companion.name}
          itemType="Companheiro Animal"
          itemLevel={companion.level}
          itemSubtitle="Besta Média"
          itemAlignment="Leal Neutro"
          itemDescription="Cão de Guarda Fiel"
          themeColor="amber"
          maxLevel={11}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-amber-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8 0C8.9 4 8 4.9 8 6s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6-6.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z" />
            </svg>
          }
          onNameChange={handleNameChange}
          allowNameEdit={true}
        />

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            label="PV"
            value={`${companion.hp}/${companion.maxHp}`}
            color="red"
            interactive={{
              onDecrease: () => handleHPChange(companion.hp - 1),
              onIncrease: () => handleHPChange(companion.hp + 1),
            }}
          />
          <StatCard label="CA" value={companion.ac} color="blue" />
          <StatCard label="Deslocamento" value={`${companion.speed}m`} color="green" />
        </div>

        {/* Attributes */}
        <AttributeGrid attributes={companion.attributes} themeColor="amber" />

        {/* Unselected Abilities Warning */}
        {getUnselectedAbilityLevels().length > 0 && (
          <WarningBanner
            title="Habilidades Pendentes"
            message={`Você tem habilidades não selecionadas para os níveis: ${getUnselectedAbilityLevels().join(', ')}`}
            buttonText="Ir para Habilidades"
            onButtonClick={() => setActiveTab('abilities')}
          />
        )}

        {/* Tabs */}
        <TabNavigation
          tabs={[
            { id: 'combat', label: 'Combate', icon: '⚔️' },
            { id: 'abilities', label: 'Habilidades', icon: '🧭', badge: getUnselectedAbilityLevels().length },
            { id: 'hp', label: 'Pontos de Vida', icon: '❤️' },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'combat' | 'abilities' | 'hp')}
          themeColor="amber"
        />

        {/* Combat Tab */}
        {activeTab === 'combat' && (
          <div className="space-y-6">
            {/* Attacks */}
            <div>
              <SectionHeader icon="⚔️" title="Ataques" themeColor="amber" />

              {/* Base Attack */}
              <div className="mb-3 rounded-lg border-2 border-red-700/50 bg-gradient-to-br from-red-950/20 to-neutral-900 p-4 shadow-lg">
                <h3 className="mb-2 text-lg font-bold text-red-400">Mordida</h3>
                <p className="text-sm text-neutral-300">
                  <span className="font-semibold">Ataque:</span> +4 para atingir, alcance 1,5m
                </p>
                <p className="text-sm text-neutral-300">
                  <span className="font-semibold">Dano:</span> {getDamageForLevel(companion.level)} perfurante
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  Alvo Médio ou menor: teste de FOR (CD 12) ou cai no chão
                </p>
              </div>

              {/* Extra Attacks from Abilities */}
              {getExtraAttacks().map((attack, idx) => {
                const pathColor = PATH_COLORS[attack.path];
                const borderColor =
                  attack.path === 'presa-firme' ? 'border-red-700/50' :
                  attack.path === 'escudo-fiel' ? 'border-blue-700/50' :
                  'border-purple-700/50';
                const textColor =
                  attack.path === 'presa-firme' ? 'text-red-400' :
                  attack.path === 'escudo-fiel' ? 'text-blue-400' :
                  'text-purple-400';

                return (
                  <div key={idx} className={`mb-3 rounded-lg border-2 ${borderColor} bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 shadow-lg`}>
                    <h3 className={`mb-2 text-lg font-bold ${textColor}`}>{attack.name}</h3>
                    <p className="text-sm text-neutral-300">
                      <span className="font-semibold">Dano:</span> {attack.damage}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">{attack.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Active Abilities */}
            <ContentBox title="Habilidades Ativas" icon="📜" themeColor="amber">
              <div className="space-y-3">
                {/* Base Abilities */}
                <AbilityCard
                  name="🐾 Cão Investigador"
                  description="Vantagem em Percepção/Investigação (cheiro, som, rastros) a 9m. Sente espíritos e mortos-vivos a 6m."
                  level={1}
                />

                {companion.level >= 2 && (
                  <AbilityCard
                    name="🦴 Laço Inquebrável"
                    description="1/descanso curto: rerrolar teste de Percepção ou Investigação falho."
                    level={2}
                  />
                )}

                {/* Selected Path Abilities */}
                {Object.entries(companion.selectedAbilities).map(([levelKey, ability]) => {
                  if (!ability) return null;
                  // Only show abilities at or below current level
                  if (ability.level > companion.level) return null;
                  const pathColor = PATH_COLORS[ability.path];
                  const [borderColor, bgColor] = pathColor.split(' ');
                  return (
                    <AbilityCard
                      key={ability.id}
                      name={`${PATH_NAMES[ability.path]} – ${ability.name}`}
                      description={ability.description}
                      level={ability.level}
                      borderColor={borderColor}
                      bgColor={bgColor}
                    />
                  );
                })}

                {Object.values(companion.selectedAbilities).filter((a) => a && a.level <= companion.level).length === 0 && companion.level < 3 && (
                  <div className="rounded-lg border border-neutral-700 bg-neutral-800/30 p-3 text-center text-sm text-neutral-500">
                    Alcance o nível 3 para desbloquear habilidades de caminho
                  </div>
                )}
              </div>
            </ContentBox>
          </div>
        )}

        {/* Abilities Tab */}
        {activeTab === 'abilities' && (
          <div className="space-y-6">
            {/* Path Overview */}
            <ContentBox title="Caminhos de Evolução" icon="🛤️" themeColor="amber">
              <div className="grid gap-3 sm:grid-cols-3">
                <PathInfoCard
                  icon="⚔️"
                  title="Presa Firme"
                  subtitle="ofensivo"
                  description="Focado em causar dano e perseguir inimigos. Ideal para combates diretos e agressivos."
                  borderColor="border-red-700/50"
                  bgGradient="from-red-950/20"
                />
                <PathInfoCard
                  icon="🛡️"
                  title="Escudo Fiel"
                  subtitle="defensivo"
                  description="Protege o dono e absorve dano. Ideal para manter aliados vivos em situações perigosas."
                  borderColor="border-blue-700/50"
                  bgGradient="from-blue-950/20"
                />
                <PathInfoCard
                  icon="🔍"
                  title="Olhar Fantasma"
                  subtitle="investigativo"
                  description="Detecta o sobrenatural e revela o oculto. Ideal para exploração e mistérios."
                  borderColor="border-purple-700/50"
                  bgGradient="from-purple-950/20"
                />
              </div>
              <p className="mt-3 text-xs italic text-neutral-500">
                💡 Dica: Você pode mesclar caminhos diferentes em cada nível para criar um cão único!
              </p>
            </ContentBox>

            {/* Base Abilities */}
            <div className="space-y-3">
              <SectionHeader icon="🧭" title="Habilidades de Classe" themeColor="amber" />

              <BaseAbilityCard
                level={1}
                name="Cão Investigador"
                description="Vantagem em Percepção/Investigação (cheiro, som, rastros) a 9m. Sente espíritos e mortos-vivos a 6m."
                icon="🐾"
                isUnlocked={companion.level >= 1}
                themeColor="amber"
              />

              <BaseAbilityCard
                level={2}
                name="Laço Inquebrável"
                description="1/descanso curto: rerrolar teste de Percepção ou Investigação falho."
                icon="🦴"
                isUnlocked={companion.level >= 2}
                themeColor="amber"
              />
            </div>

            {/* Ability Selection */}
            {[3, 5, 7, 10].map((level) => {
              const canSelect = canSelectAbilityForLevel(level as 3 | 5 | 7 | 10);
              const levelKey = `level${level}` as keyof typeof companion.selectedAbilities;
              const selectedAbility = companion.selectedAbilities[levelKey];
              const abilities = getAbilitiesForLevel(level as 3 | 5 | 7 | 10);

              return (
                <div key={level}>
                  <LevelSectionHeader
                    level={level}
                    title="Escolha de Caminho"
                    isLocked={!canSelect}
                    isPending={canSelect && !selectedAbility}
                  />
                  <div className="space-y-2">
                    {abilities.map((ability) => {
                      const isSelected = selectedAbility?.id === ability.id;
                      const pathColor = PATH_COLORS[ability.path];

                      return (
                        <AbilitySelectionCard
                          key={ability.id}
                          title={`${PATH_NAMES[ability.path]} – ${ability.name}`}
                          description={ability.description}
                          isSelected={isSelected}
                          canSelect={canSelect}
                          onClick={() => selectAbility(ability)}
                          colorClasses={pathColor}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HP Tab */}
        {activeTab === 'hp' && (
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-green-700/50 bg-gradient-to-br from-green-950/20 to-neutral-900 p-4 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 border-b border-green-700/30 pb-2 font-serif text-xl font-bold text-green-400">
                <span>❤️</span> Histórico de Pontos de Vida
              </h2>
              <p className="mb-4 text-sm text-neutral-400">
                Cada vez que o cão sobe de nível, você rola 1d6 e adiciona o modificador de CON (+
                {companion.attributes.constitution.modifier}).
              </p>
              <div className="space-y-2">
                {companion.hpHistory.map((entry) => (
                  <div
                    key={entry.level}
                    className="flex items-center justify-between rounded-lg border border-green-700/30 bg-neutral-800/50 p-3"
                  >
                    <span className="font-semibold text-green-300">Nível {entry.level}</span>
                    <span className="text-neutral-300">
                      {entry.roll} <span className="text-xs text-neutral-500">(d6)</span> +{' '}
                      {entry.modifier} <span className="text-xs text-neutral-500">(CON)</span> ={' '}
                      <span className="font-bold text-green-400">+{entry.total} PV</span>
                    </span>
                  </div>
                ))}
                <div className="mt-4 rounded-lg border border-green-600/50 bg-green-950/30 p-4 text-center">
                  <div className="text-sm text-neutral-400">Total de Pontos de Vida</div>
                  <div className="mt-1 text-3xl font-bold text-green-300">{companion.maxHp} PV</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HP Roll Modal */}
      {showHPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg border border-amber-700/50 bg-neutral-900 p-6">
            <h2 className="mb-4 text-2xl font-bold text-amber-100">
              🎲 Subindo para Nível {pendingLevel || companion.level + 1}
            </h2>

            {/* HP Roll Section */}
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-amber-200">Pontos de Vida</h3>
              <p className="mb-3 text-sm text-neutral-300">
                Role 1d6 e insira o resultado. Seu modificador de CON será adicionado automaticamente.
              </p>
              <label className="mb-2 block text-sm font-semibold text-amber-200">Resultado do d6:</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max="6"
                value={newHPRoll}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string for clearing
                  if (value === '') {
                    setNewHPRoll('');
                    return;
                  }
                  // Only allow numbers 1-6
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 6) {
                    setNewHPRoll(value);
                  }
                }}
                onBlur={() => {
                  // If empty on blur, set to 1
                  if (newHPRoll === '' || parseInt(newHPRoll) < 1) {
                    setNewHPRoll('1');
                  }
                }}
                className="w-full rounded border border-amber-700/50 bg-neutral-800 px-4 py-2 text-xl font-bold text-amber-100"
                placeholder="1-6"
              />
              <div className="mt-3 rounded-lg border border-green-700/50 bg-neutral-950 p-3 text-center">
                <div className="text-sm text-neutral-400">
                  {newHPRoll || 0} (d6) + {companion.attributes.constitution.modifier} (CON) ={' '}
                  <span className="text-lg font-bold text-green-400">
                    +{(parseInt(newHPRoll) || 0) + companion.attributes.constitution.modifier} PV
                  </span>
                </div>
              </div>
            </div>

            {/* Attribute Selection Section - Only on levels 3, 5, 7, 10 */}
            {[3, 5, 7, 10].includes(pendingLevel || companion.level + 1) && (
              <div className="mb-6 rounded-lg border border-purple-700/50 bg-neutral-950 p-4">
              <h3 className="mb-2 text-lg font-semibold text-purple-200">⬆️ Aumento de Atributos</h3>
              <p className="mb-4 text-sm text-neutral-300">
                Escolha dois atributos para aumentar em +1 cada. Você pode escolher o mesmo atributo duas vezes.
              </p>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-purple-200">Primeiro Atributo:</label>
                <select
                  value={selectedAttribute1}
                  onChange={(e) => setSelectedAttribute1(e.target.value as AttributeKey)}
                  className="w-full rounded border border-purple-700/50 bg-neutral-800 px-3 py-2 text-amber-100"
                >
                  {(Object.keys(ATTRIBUTE_NAMES) as AttributeKey[]).map((attr) => (
                    <option key={attr} value={attr}>
                      {ATTRIBUTE_ABBR[attr]} - {ATTRIBUTE_NAMES[attr]} ({companion.attributes[attr].value} → {companion.attributes[attr].value + 1})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-purple-200">Segundo Atributo:</label>
                <select
                  value={selectedAttribute2}
                  onChange={(e) => setSelectedAttribute2(e.target.value as AttributeKey)}
                  className="w-full rounded border border-purple-700/50 bg-neutral-800 px-3 py-2 text-amber-100"
                >
                  {(Object.keys(ATTRIBUTE_NAMES) as AttributeKey[]).map((attr) => {
                    const currentValue = companion.attributes[attr].value;
                    const newValue = currentValue + (selectedAttribute1 === attr ? 2 : 1);
                    return (
                      <option key={attr} value={attr}>
                        {ATTRIBUTE_ABBR[attr]} - {ATTRIBUTE_NAMES[attr]} ({currentValue} → {newValue})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="rounded-lg border border-purple-600/30 bg-purple-950/20 p-3 text-sm text-neutral-300">
                <div className="font-semibold text-purple-200">Resumo:</div>
                {selectedAttribute1 === selectedAttribute2 ? (
                  <div>
                    {ATTRIBUTE_NAMES[selectedAttribute1]}: {companion.attributes[selectedAttribute1].value} → {companion.attributes[selectedAttribute1].value + 2}
                  </div>
                ) : (
                  <>
                    <div>
                      {ATTRIBUTE_NAMES[selectedAttribute1]}: {companion.attributes[selectedAttribute1].value} → {companion.attributes[selectedAttribute1].value + 1}
                    </div>
                    <div>
                      {ATTRIBUTE_NAMES[selectedAttribute2]}: {companion.attributes[selectedAttribute2].value} → {companion.attributes[selectedAttribute2].value + 1}
                    </div>
                  </>
                )}
              </div>
            </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={cancelLevelUp}
                className="flex-1 rounded bg-neutral-700 px-4 py-2 font-semibold hover:bg-neutral-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLevelUp}
                className="flex-1 rounded bg-amber-800 px-4 py-2 font-semibold hover:bg-amber-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
