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

const INITIAL_SWORD_DATA: SwordData = {
  characterName: 'Soldado Desertor',
  level: 1,
  selectedAbilities: {},
};

export default function SoldadoPage() {
  const [sword, setSword] = useState<SwordData>(INITIAL_SWORD_DATA);
  const [activeTab, setActiveTab] = useState<'combat' | 'abilities'>('combat');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(sword.characterName);
  const [debugMode, setDebugMode] = useState(false);

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

  const saveName = () => {
    setSword({ ...sword, characterName: tempName });
    setIsEditingName(false);
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

  const resetCharacterSelection = () => {
    if (confirm('Tem certeza que deseja resetar a seleção de personagem? Isso irá te levar de volta à tela de seleção.')) {
      localStorage.removeItem('selected-character');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Debug Button */}
      <button
        onClick={() => setDebugMode(!debugMode)}
        className="fixed right-4 top-4 z-[9999] rounded bg-purple-900 border-2 border-purple-600 px-4 py-2 text-sm font-bold text-purple-200 shadow-xl hover:bg-purple-800"
      >
        🐛 Debug
      </button>

      {debugMode && (
        <div className="fixed right-4 top-20 z-[9999] min-w-[200px] rounded-lg border-2 border-purple-600 bg-purple-950 p-4 shadow-2xl">
          <p className="mb-3 text-sm font-bold text-purple-200">Debug Controls</p>
          <button
            onClick={resetCharacterSelection}
            className="w-full rounded border-2 border-red-600 bg-red-900 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-800"
          >
            Reset Character Selection
          </button>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="rounded border border-amber-700/50 bg-neutral-900 px-3 py-1 text-2xl font-bold text-amber-100"
                  autoFocus
                />
                <button
                  onClick={saveName}
                  className="rounded bg-amber-700 px-3 py-1 text-sm hover:bg-amber-600"
                >
                  Salvar
                </button>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-amber-100">{sword.characterName}</h1>
                <button
                  onClick={() => {
                    setTempName(sword.characterName);
                    setIsEditingName(true);
                  }}
                  className="text-amber-600 hover:text-amber-500"
                  title="Editar nome"
                >
                  ✏️
                </button>
              </>
            )}
          </div>

          <h2 className="text-xl font-semibold text-neutral-300">⚔️ Ceifadora dos Sussurros</h2>
          <p className="mt-2 text-sm text-neutral-400">
            {AWAKENING_NAMES[currentAwakening]} • Nível {sword.level}
          </p>
        </div>

        {/* Level Controls */}
        <div className="mb-6 flex items-center gap-4 rounded-lg border border-amber-700/30 bg-neutral-900/50 p-4">
          <button
            onClick={() => handleLevelChange(sword.level - 1)}
            disabled={sword.level <= 1}
            className="rounded bg-red-900/50 px-4 py-2 font-semibold hover:bg-red-900/70 disabled:opacity-30"
          >
            -
          </button>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-amber-100">Nível {sword.level}</div>
            <div className="text-sm text-neutral-400">{AWAKENING_NAMES[currentAwakening]}</div>
          </div>
          <button
            onClick={() => handleLevelChange(sword.level + 1)}
            disabled={sword.level >= 10}
            className="rounded bg-green-900/50 px-4 py-2 font-semibold hover:bg-green-900/70 disabled:opacity-30"
          >
            +
          </button>
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
                  Ir para Despertares
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-amber-700/30">
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
            ✨ Despertares
            {getUnselectedAbilityLevels().length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-600 text-xs font-bold text-white">
                {getUnselectedAbilityLevels().length}
              </span>
            )}
          </button>
        </div>

        {/* Combat Tab */}
        {activeTab === 'combat' && (
          <div className="space-y-6">
            {/* Weapon Stats */}
            <div className="rounded-lg border border-amber-700/30 bg-neutral-900/50 p-6">
              <h3 className="mb-4 text-xl font-bold text-amber-100">Estatísticas da Arma</h3>
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
            </div>

            {/* Active Abilities Summary */}
            <div className="rounded-lg border border-amber-700/30 bg-neutral-900/50 p-6">
              <h3 className="mb-4 text-xl font-bold text-amber-100">Habilidades Ativas</h3>
              {allSelectedAbilities.length === 0 ? (
                <p className="text-neutral-400">
                  Nenhuma habilidade selecionada. Selecione habilidades na aba Despertares.
                </p>
              ) : (
                <div className="space-y-3">
                  {allSelectedAbilities.map((ability) => (
                    <div
                      key={ability.id}
                      className={`rounded border p-3 ${ABILITY_TYPE_COLORS[ability.type]}`}
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-amber-100">{ability.name}</h4>
                        <span className="whitespace-nowrap rounded bg-neutral-900/50 px-2 py-0.5 text-xs text-neutral-300">
                          {ABILITY_TYPE_NAMES[ability.type]}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-300">{ability.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Abilities Tab */}
        {activeTab === 'abilities' && (
          <div className="space-y-6">
            {/* Base Abilities */}
            <div className="space-y-3">
              <h2 className="mb-3 flex items-center gap-2 border-b border-amber-700/30 pb-2 font-serif text-xl font-bold text-amber-100">
                <span>⚔️</span> Habilidades Base
              </h2>

              <div className="rounded-lg border-2 border-amber-700/50 bg-gradient-to-br from-amber-950/20 to-neutral-900 p-4 shadow-md">
                <h3 className="font-bold text-amber-200">⚡ Nível 1 – Lâmina Desperta</h3>
                <p className="mt-1 text-sm text-neutral-300">
                  A espada torna-se consciente, sussurrando em voz quase inaudível. Todos os golpes agora são mágicos e afetam espíritos, aparições e mortos-vivos normalmente.
                </p>
              </div>

              {sword.level >= 2 && (
                <div className="rounded-lg border-2 border-amber-700/50 bg-gradient-to-br from-amber-950/20 to-neutral-900 p-4 shadow-md">
                  <h3 className="font-bold text-amber-200">🔊 Nível 2 – Eco do Aço</h3>
                  <p className="mt-1 text-sm text-neutral-300">
                    A espada armazena parte da energia das mortes que causou. O usuário recebe +1 em testes de Intimidação enquanto estiver empunhando-a. Além disso, a lâmina brilha levemente diante de presenças espirituais a até 6 metros.
                  </p>
                </div>
              )}
            </div>

            {/* Ability Selection */}
            {[3, 7, 10].map((level) => {
              const canSelect = canSelectAbilityForLevel(level as 3 | 7 | 10);
              const levelKey = `level${level}` as keyof typeof sword.selectedAbilities;
              const selectedAbility = sword.selectedAbilities[levelKey];
              const abilities = getAbilitiesForLevel(level as 3 | 7 | 10);

              return (
                <div key={level}>
                  <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-amber-100">
                    Nível {level} – {AWAKENING_NAMES[level]}
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

                      return (
                        <div
                          key={ability.id}
                          onClick={() => canSelect && selectAbility(ability)}
                          className={`cursor-pointer rounded-lg border p-4 transition-all ${
                            canSelect
                              ? isSelected
                                ? `${ABILITY_TYPE_COLORS[ability.type]} border-2`
                                : `border-neutral-700 bg-neutral-900 hover:border-neutral-600`
                              : 'cursor-not-allowed border-neutral-800 bg-neutral-950/50 opacity-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <h3 className="font-bold text-amber-100">{ability.name}</h3>
                                <span className="whitespace-nowrap rounded bg-neutral-900/50 px-2 py-0.5 text-xs text-neutral-300">
                                  {ABILITY_TYPE_NAMES[ability.type]}
                                </span>
                              </div>
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
      </div>
    </div>
  );
}
