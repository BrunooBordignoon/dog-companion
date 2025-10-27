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
import DebugButton from './DebugButton';

export default function Home() {

  const [activeTab, setActiveTab] = useState<'combat' | 'abilities' | 'hp'>('combat');
  const [isLoaded, setIsLoaded] = useState(false);

  const getInitialCompanionData = (): CompanionData => ({
    name: 'Companheiro Canino',
    level: 1,
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

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(companion.name);
  const [showHPModal, setShowHPModal] = useState(false);
  const [newHPRoll, setNewHPRoll] = useState<string>('1');
  const [selectedAttribute1, setSelectedAttribute1] = useState<AttributeKey>('strength');
  const [selectedAttribute2, setSelectedAttribute2] = useState<AttributeKey>('strength');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dogCompanion');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompanion(data);
        setTempName(data.name);
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
      // Leveling up - show HP modal
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

  const confirmLevelUp = () => {
    // Validate HP roll
    const hpRollValue = parseInt(newHPRoll);
    if (!newHPRoll || isNaN(hpRollValue) || hpRollValue < 1 || hpRollValue > 6) {
      alert('Por favor, insira um valor válido entre 1 e 6 para a rolagem do d6.');
      return;
    }

    const newLevel = companion.level + 1;
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

  const saveName = () => {
    setCompanion({ ...companion, name: tempName });
    setEditingName(false);
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
      <DebugButton />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 rounded-lg border-2 border-amber-700/50 bg-gradient-to-b from-amber-950/30 to-neutral-900/50 p-6 shadow-xl">
          <div className="mb-3 flex items-center gap-3 border-b border-amber-700/30 pb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-600/50 bg-amber-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-amber-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8 0C8.9 4 8 4.9 8 6s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6-6.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Companheiro Animal
              </div>
              {editingName ? (
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 rounded border border-amber-700/50 bg-neutral-900 px-3 py-2 text-2xl font-bold text-amber-100"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  />
                  <button
                    onClick={saveName}
                    className="rounded bg-amber-800 px-4 py-2 text-sm font-semibold hover:bg-amber-700"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <h1
                    onClick={() => setEditingName(true)}
                    className="cursor-pointer font-serif text-3xl font-bold text-amber-100 hover:text-amber-200"
                  >
                    {companion.name}
                  </h1>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-neutral-400 hover:text-amber-200"
                    title="Editar nome"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="rounded bg-neutral-800/50 px-2 py-1 font-semibold text-amber-300">
                Besta Média
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-300">Leal Neutro</span>
            </div>
            <div className="text-xs italic text-neutral-500">Cão de Guarda Fiel</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border-2 border-amber-700/30 bg-gradient-to-br from-neutral-900 to-neutral-950 p-3 shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">Nível</div>
            <div className="mt-1 flex items-center gap-2">
              <button
                onClick={() => handleLevelChange(Math.max(1, companion.level - 1))}
                className="rounded bg-neutral-800 px-2 py-1 text-sm hover:bg-neutral-700"
              >
                -
              </button>
              <span className="text-2xl font-bold text-amber-100">{companion.level}</span>
              <button
                onClick={() => handleLevelChange(Math.min(11, companion.level + 1))}
                className={`rounded px-2 py-1 text-sm ${
                  companion.level >= 11
                    ? 'cursor-not-allowed bg-neutral-900 text-neutral-600'
                    : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
                disabled={companion.level >= 11}
              >
                +
              </button>
            </div>
          </div>

          <div className="rounded-lg border-2 border-red-700/30 bg-gradient-to-br from-neutral-900 to-neutral-950 p-3 shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-wider text-red-600">PV</div>
            <div className="mt-1 flex items-center gap-2">
              <button
                onClick={() => handleHPChange(companion.hp - 1)}
                className="rounded bg-neutral-800 px-2 py-1 text-sm hover:bg-neutral-700"
              >
                -
              </button>
              <span className="text-2xl font-bold text-red-400">
                {companion.hp}/{companion.maxHp}
              </span>
              <button
                onClick={() => handleHPChange(companion.hp + 1)}
                className="rounded bg-neutral-800 px-2 py-1 text-sm hover:bg-neutral-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="rounded-lg border-2 border-blue-700/30 bg-gradient-to-br from-neutral-900 to-neutral-950 p-3 shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">CA</div>
            <div className="mt-1 text-2xl font-bold text-blue-400">{companion.ac}</div>
          </div>

          <div className="rounded-lg border-2 border-green-700/30 bg-gradient-to-br from-neutral-900 to-neutral-950 p-3 shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-wider text-green-600">Deslocamento</div>
            <div className="mt-1 text-2xl font-bold text-green-400">{companion.speed}m</div>
          </div>
        </div>

        {/* Attributes */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-6">
          {Object.entries(companion.attributes).map(([key, attr]) => (
            <div key={key} className="rounded-lg border-2 border-amber-700/20 bg-gradient-to-b from-amber-950/20 to-neutral-900 p-3 text-center shadow-md">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                {key === 'strength' && 'FOR'}
                {key === 'dexterity' && 'DES'}
                {key === 'constitution' && 'CON'}
                {key === 'intelligence' && 'INT'}
                {key === 'wisdom' && 'SAB'}
                {key === 'charisma' && 'CAR'}
              </div>
              <div className="mt-1 text-xl font-bold text-amber-100">{attr.value}</div>
              <div className="text-sm text-neutral-400">
                ({attr.modifier >= 0 ? '+' : ''}
                {attr.modifier})
              </div>
            </div>
          ))}
        </div>

        {/* Unselected Abilities Warning */}
        {getUnselectedAbilityLevels().length > 0 && (
          <div className="mb-4 rounded-lg border border-yellow-700/50 bg-yellow-950/30 p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-semibold text-yellow-200">Habilidades Pendentes</div>
                <div className="text-sm text-yellow-300">
                  Você tem habilidades não selecionadas para os níveis: {getUnselectedAbilityLevels().join(', ')}
                </div>
                <button
                  onClick={() => setActiveTab('abilities')}
                  className="mt-2 rounded bg-yellow-700 px-3 py-1 text-sm font-semibold text-yellow-50 hover:bg-yellow-600"
                >
                  Ir para Habilidades
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b-2 border-amber-700/50">
          <button
            onClick={() => setActiveTab('combat')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'combat'
                ? 'border-b-2 border-amber-600 text-amber-100'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            ⚔️ Combate
          </button>
          <button
            onClick={() => setActiveTab('abilities')}
            className={`relative px-4 py-2 font-semibold transition-colors ${
              activeTab === 'abilities'
                ? 'border-b-2 border-amber-600 text-amber-100'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🧭 Habilidades
            {getUnselectedAbilityLevels().length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-600 text-xs font-bold text-white">
                {getUnselectedAbilityLevels().length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('hp')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'hp'
                ? 'border-b-2 border-amber-600 text-amber-100'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            ❤️ Pontos de Vida
          </button>
        </div>

        {/* Combat Tab */}
        {activeTab === 'combat' && (
          <div className="space-y-6">
            {/* Attacks */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 border-b border-amber-700/30 pb-2 font-serif text-xl font-bold text-amber-100">
                <span className="text-red-500">⚔️</span> Ataques
              </h2>

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
            <div className="rounded-lg border-2 border-amber-700/50 bg-gradient-to-br from-amber-950/20 to-neutral-900 p-4 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 border-b border-amber-700/30 pb-2 font-serif text-xl font-bold text-amber-100">
                <span>📜</span> Habilidades Ativas
              </h2>
              <div className="space-y-3">
                {/* Base Abilities */}
                <div className="rounded-lg border border-amber-600/30 bg-neutral-800/50 p-3">
                  <div className="font-semibold text-amber-200">🐾 Cão Investigador (Nível 1)</div>
                  <div className="mt-1 text-sm text-neutral-300">
                    Vantagem em Percepção/Investigação (cheiro, som, rastros) a 9m. Sente espíritos e mortos-vivos a 6m.
                  </div>
                </div>

                {companion.level >= 2 && (
                  <div className="rounded-lg border border-amber-600/30 bg-neutral-800/50 p-3">
                    <div className="font-semibold text-amber-200">🦴 Laço Inquebrável (Nível 2)</div>
                    <div className="mt-1 text-sm text-neutral-300">
                      1/descanso curto: rerrolar teste de Percepção ou Investigação falho.
                    </div>
                  </div>
                )}

                {/* Selected Path Abilities */}
                {Object.entries(companion.selectedAbilities).map(([levelKey, ability]) => {
                  if (!ability) return null;
                  // Only show abilities at or below current level
                  if (ability.level > companion.level) return null;
                  const pathColor = PATH_COLORS[ability.path];
                  return (
                    <div key={ability.id} className={`rounded-lg border p-3 ${pathColor}`}>
                      <div className="font-semibold text-amber-200">
                        {PATH_NAMES[ability.path]} – {ability.name} (Nível {ability.level})
                      </div>
                      <div className="mt-1 text-sm text-neutral-300">{ability.description}</div>
                    </div>
                  );
                })}

                {Object.values(companion.selectedAbilities).filter((a) => a && a.level <= companion.level).length === 0 && companion.level < 3 && (
                  <div className="rounded-lg border border-neutral-700 bg-neutral-800/30 p-3 text-center text-sm text-neutral-500">
                    Alcance o nível 3 para desbloquear habilidades de caminho
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Abilities Tab */}
        {activeTab === 'abilities' && (
          <div className="space-y-6">
            {/* Path Overview */}
            <div className="rounded-lg border-2 border-amber-700/50 bg-gradient-to-br from-amber-950/20 to-neutral-900 p-4 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 border-b border-amber-700/30 pb-2 font-serif text-xl font-bold text-amber-100">
                <span>🛤️</span> Caminhos de Evolução
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Presa Firme */}
                <div className="rounded-lg border-2 border-red-700/50 bg-gradient-to-br from-red-950/20 to-neutral-900 p-3">
                  <h3 className="mb-2 font-bold text-red-400">⚔️ Presa Firme</h3>
                  <p className="text-xs text-neutral-300">
                    Caminho <span className="font-semibold text-red-300">ofensivo</span>. Focado em causar dano e
                    perseguir inimigos. Ideal para combates diretos e agressivos.
                  </p>
                </div>

                {/* Escudo Fiel */}
                <div className="rounded-lg border-2 border-blue-700/50 bg-gradient-to-br from-blue-950/20 to-neutral-900 p-3">
                  <h3 className="mb-2 font-bold text-blue-400">🛡️ Escudo Fiel</h3>
                  <p className="text-xs text-neutral-300">
                    Caminho <span className="font-semibold text-blue-300">defensivo</span>. Protege o dono e
                    absorve dano. Ideal para manter aliados vivos em situações perigosas.
                  </p>
                </div>

                {/* Olhar Fantasma */}
                <div className="rounded-lg border-2 border-purple-700/50 bg-gradient-to-br from-purple-950/20 to-neutral-900 p-3">
                  <h3 className="mb-2 font-bold text-purple-400">🔍 Olhar Fantasma</h3>
                  <p className="text-xs text-neutral-300">
                    Caminho <span className="font-semibold text-purple-300">investigativo</span>. Detecta o
                    sobrenatural e revela o oculto. Ideal para exploração e mistérios.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs italic text-neutral-500">
                💡 Dica: Você pode mesclar caminhos diferentes em cada nível para criar um cão único!
              </p>
            </div>

            {/* Base Abilities */}
            <div className="space-y-3">
              <h2 className="mb-3 flex items-center gap-2 border-b border-amber-700/30 pb-2 font-serif text-xl font-bold text-amber-100">
                <span>🧭</span> Habilidades de Classe
              </h2>

              <div className="rounded-lg border-2 border-amber-700/50 bg-gradient-to-br from-amber-950/20 to-neutral-900 p-4 shadow-md">
                <h3 className="font-bold text-amber-200">🐾 Nível 1 – Cão Investigador</h3>
                <p className="mt-1 text-sm text-neutral-300">
                  Vantagem em Percepção/Investigação (cheiro, som, rastros) a 9m. Sente espíritos e mortos-vivos a 6m.
                </p>
              </div>

              {companion.level >= 2 && (
                <div className="rounded-lg border-2 border-amber-700/50 bg-gradient-to-br from-amber-950/20 to-neutral-900 p-4 shadow-md">
                  <h3 className="font-bold text-amber-200">🦴 Nível 2 – Laço Inquebrável</h3>
                  <p className="mt-1 text-sm text-neutral-300">
                    1/descanso curto: rerrolar teste de Percepção ou Investigação falho.
                  </p>
                </div>
              )}
            </div>

            {/* Ability Selection */}
            {[3, 5, 7, 10].map((level) => {
              const canSelect = canSelectAbilityForLevel(level as 3 | 5 | 7 | 10);
              const levelKey = `level${level}` as keyof typeof companion.selectedAbilities;
              const selectedAbility = companion.selectedAbilities[levelKey];
              const abilities = getAbilitiesForLevel(level as 3 | 5 | 7 | 10);

              return (
                <div key={level}>
                  <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-amber-100">
                    Nível {level} – Escolha de Caminho
                    {!canSelect && <span>🔒</span>}
                    {canSelect && !selectedAbility && (
                      <span className="rounded-full bg-yellow-600 px-2 py-1 text-xs font-bold text-white">
                        PENDENTE
                      </span>
                    )}
                  </h2>
                  <div className="space-y-2">
                    {abilities.map((ability) => {
                      const isSelected = selectedAbility?.id === ability.id;
                      const pathColor = PATH_COLORS[ability.path];

                      return (
                        <div
                          key={ability.id}
                          onClick={() => canSelect && selectAbility(ability)}
                          className={`cursor-pointer rounded-lg border p-4 transition-all ${
                            canSelect
                              ? isSelected
                                ? `${pathColor} border-2`
                                : `border-neutral-700 bg-neutral-900 hover:border-neutral-600`
                              : 'cursor-not-allowed border-neutral-800 bg-neutral-950/50 opacity-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-amber-100">
                                {PATH_NAMES[ability.path]} – {ability.name}
                              </h3>
                              <p className="mt-1 text-sm text-neutral-300">{ability.description}</p>
                            </div>
                            {isSelected && <span className="ml-2 text-xl">✓</span>}
                          </div>
                        </div>
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
              🎲 Subindo para Nível {companion.level + 1}
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
            {[3, 5, 7, 10].includes(companion.level + 1) && (
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
                onClick={() => {
                  setShowHPModal(false);
                  setNewHPRoll('1');
                  setSelectedAttribute1('strength');
                  setSelectedAttribute2('strength');
                }}
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
