'use client';

import { useState } from 'react';
import {
  LevelUpRequirement,
  LevelUpData,
  HPRollData,
  AttributeIncreaseData,
  AbilitySelectionData,
  ExpertiseSelectionData,
  validateHPRoll,
  getMissingFields,
} from '@/types/levelup';
import { AttributeKey, ATTRIBUTE_NAMES, ATTRIBUTE_ABBR, Ability } from '@/types/companion';
import { SwordAbility } from '@/types/sword';
import { GrimorioAbility } from '@/types/grimorio';
import { SkillKey } from '@/types/skills';
import ContentBox from './ContentBox';
import AbilitySelectionCard from './AbilitySelectionCard';
import ExpertiseSelector from './ExpertiseSelector';

interface LevelUpModalProps {
  requirements: LevelUpRequirement[];
  onConfirm: (allData: LevelUpData[]) => void;
  onCancel: () => void;
  themeColor?: 'amber' | 'red' | 'purple';
}

export default function LevelUpModal({
  requirements,
  onConfirm,
  onCancel,
  themeColor = 'amber',
}: LevelUpModalProps) {
  // State para armazenar dados coletados por equipamento
  const [collectedData, setCollectedData] = useState<Record<string, LevelUpData>>(() => {
    const initial: Record<string, LevelUpData> = {};
    requirements.forEach((req) => {
      initial[req.equipmentId] = {
        equipmentId: req.equipmentId,
        level: req.level,
      };
    });
    return initial;
  });

  const colors = {
    amber: {
      border: 'border-amber-700/50',
      bg: 'bg-neutral-900',
      titleText: 'text-amber-100',
      btnBg: 'bg-amber-800',
      btnHover: 'hover:bg-amber-700',
      btnDisabled: 'bg-neutral-700',
    },
    red: {
      border: 'border-red-700/50',
      bg: 'bg-neutral-900',
      titleText: 'text-red-100',
      btnBg: 'bg-red-800',
      btnHover: 'hover:bg-red-700',
      btnDisabled: 'bg-neutral-700',
    },
    purple: {
      border: 'border-purple-700/50',
      bg: 'bg-neutral-900',
      titleText: 'text-purple-100',
      btnBg: 'bg-purple-800',
      btnHover: 'hover:bg-purple-700',
      btnDisabled: 'bg-neutral-700',
    },
  };

  const theme = colors[themeColor];

  // Update HP roll data
  const updateHPRoll = (equipmentId: string, roll: number, modifier: number) => {
    setCollectedData((prev) => ({
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        hpRoll: {
          roll,
          modifier,
          total: roll + modifier,
        },
      },
    }));
  };

  // Update attribute increase data
  const updateAttributeIncrease = (equipmentId: string, attributes: [AttributeKey, AttributeKey]) => {
    setCollectedData((prev) => ({
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        attributeIncrease: { attributes },
      },
    }));
  };

  // Update ability selection data
  const updateAbilitySelection = (equipmentId: string, ability: Ability | SwordAbility | GrimorioAbility, levelKey: string) => {
    setCollectedData((prev) => ({
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        abilitySelection: {
          selectedAbility: ability,
          levelKey,
        },
      },
    }));
  };

  // Update expertise selection data
  const updateExpertiseSelection = (equipmentId: string, skill: SkillKey) => {
    setCollectedData((prev) => ({
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        expertiseSelection: {
          selectedSkill: skill,
        },
      },
    }));
  };

  // Check if all required data is collected
  const isFormValid = (): boolean => {
    return requirements.every((req) => {
      const data = collectedData[req.equipmentId];

      if (req.hpRoll && !data.hpRoll) return false;
      if (req.attributeIncrease && !data.attributeIncrease) return false;
      if (req.abilitySelection && !data.abilitySelection) return false;
      if (req.expertiseSelection && !data.expertiseSelection) return false;

      return true;
    });
  };

  // Get all missing fields across all equipment
  const getAllMissingFields = (): Array<{ equipmentName: string; fields: string[] }> => {
    return requirements
      .map((req) => {
        const data = collectedData[req.equipmentId];
        const missing = getMissingFields(data, req);
        return missing.length > 0 ? { equipmentName: req.equipmentName, fields: missing } : null;
      })
      .filter((item): item is { equipmentName: string; fields: string[] } => item !== null);
  };

  const handleConfirm = () => {
    if (!isFormValid()) return;
    const allData = requirements.map((req) => collectedData[req.equipmentId]);
    onConfirm(allData);
  };

  const level = requirements[0]?.level || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border-2 ${theme.border} ${theme.bg} p-4 sm:p-6`}>
        {/* Header */}
        <h2 className={`mb-4 text-xl sm:text-2xl font-bold ${theme.titleText}`}>
          🎲 Subindo para Nível {level}
        </h2>

        <p className="mb-6 text-sm text-neutral-300">
          Você tem {requirements.length} equipamento{requirements.length > 1 ? 's' : ''} que precisa
          {requirements.length > 1 ? 'm' : ''} de configuração:
        </p>

        {/* Equipment Sections */}
        <div className="space-y-6">
          {requirements.map((req) => {
            const data = collectedData[req.equipmentId];

            return (
              <div key={req.equipmentId} className="rounded-lg border border-neutral-700 bg-neutral-950/50 p-3 sm:p-4">
                {/* Equipment Header */}
                <h3 className="mb-4 text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                  <span>{req.equipmentIcon}</span>
                  <span>{req.equipmentName}</span>
                </h3>

                {/* HP Roll Section */}
                {req.hpRoll && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm sm:text-base font-semibold text-amber-200">📊 Pontos de Vida</h4>
                    <p className="mb-3 text-xs sm:text-sm text-neutral-300">
                      Role 1{req.hpRoll.diceType} e insira o resultado. Seu modificador de{' '}
                      {req.hpRoll.modifierLabel || 'CON'} ({req.hpRoll.currentModifier >= 0 ? '+' : ''}
                      {req.hpRoll.currentModifier}) será adicionado automaticamente.
                    </p>
                    <label className="mb-2 block text-xs sm:text-sm font-semibold text-amber-200">
                      Resultado do {req.hpRoll.diceType}:
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max={parseInt(req.hpRoll.diceType.substring(1))}
                      value={data.hpRoll?.roll || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          updateHPRoll(req.equipmentId, 0, req.hpRoll!.currentModifier);
                          return;
                        }
                        const numValue = parseInt(value);
                        if (!isNaN(numValue) && validateHPRoll(numValue, req.hpRoll!)) {
                          updateHPRoll(req.equipmentId, numValue, req.hpRoll!.currentModifier);
                        }
                      }}
                      className="w-full rounded border border-amber-700/50 bg-neutral-800 px-3 py-2 text-lg sm:text-xl font-bold text-amber-100"
                      placeholder={`1-${req.hpRoll.diceType.substring(1)}`}
                    />
                    {data.hpRoll && data.hpRoll.roll > 0 && (
                      <div className="mt-3 rounded-lg border border-green-700/50 bg-neutral-950 p-2 sm:p-3 text-center">
                        <div className="text-xs sm:text-sm text-neutral-400">
                          {data.hpRoll.roll} ({req.hpRoll.diceType}) +{' '}
                          {data.hpRoll.modifier >= 0 ? '' : ''}
                          {data.hpRoll.modifier} ({req.hpRoll.modifierLabel || 'CON'}) ={' '}
                          <span className="text-base sm:text-lg font-bold text-green-400">
                            +{data.hpRoll.total} PV
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Attribute Increase Section */}
                {req.attributeIncrease && (
                  <div className="mb-4 rounded-lg border border-purple-700/50 bg-neutral-950 p-3 sm:p-4">
                    <h4 className="mb-2 text-sm sm:text-base font-semibold text-purple-200">
                      ⬆️ Aumento de Atributos
                    </h4>
                    <p className="mb-4 text-xs sm:text-sm text-neutral-300">
                      Escolha {req.attributeIncrease.count} atributo{req.attributeIncrease.count > 1 ? 's' : ''}{' '}
                      para aumentar em +1 cada. Você pode escolher o mesmo atributo mais de uma vez.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="mb-2 block text-xs sm:text-sm font-semibold text-purple-200">
                          Primeiro Atributo:
                        </label>
                        <select
                          value={data.attributeIncrease?.attributes[0] || 'strength'}
                          onChange={(e) => {
                            const current = data.attributeIncrease?.attributes || ['strength', 'strength'];
                            updateAttributeIncrease(req.equipmentId, [
                              e.target.value as AttributeKey,
                              current[1],
                            ]);
                          }}
                          className="w-full rounded border border-purple-700/50 bg-neutral-800 px-3 py-2 text-sm sm:text-base text-amber-100"
                        >
                          {(Object.keys(ATTRIBUTE_NAMES) as AttributeKey[]).map((attr) => {
                            const attrData = req.attributeIncrease!.currentAttributes[attr];
                            return (
                              <option key={attr} value={attr}>
                                {ATTRIBUTE_ABBR[attr]} - {ATTRIBUTE_NAMES[attr]} ({attrData.value} → {attrData.value + 1})
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs sm:text-sm font-semibold text-purple-200">
                          Segundo Atributo:
                        </label>
                        <select
                          value={data.attributeIncrease?.attributes[1] || 'strength'}
                          onChange={(e) => {
                            const current = data.attributeIncrease?.attributes || ['strength', 'strength'];
                            updateAttributeIncrease(req.equipmentId, [
                              current[0],
                              e.target.value as AttributeKey,
                            ]);
                          }}
                          className="w-full rounded border border-purple-700/50 bg-neutral-800 px-3 py-2 text-sm sm:text-base text-amber-100"
                        >
                          {(Object.keys(ATTRIBUTE_NAMES) as AttributeKey[]).map((attr) => {
                            const attrData = req.attributeIncrease!.currentAttributes[attr];
                            const firstAttr = data.attributeIncrease?.attributes[0] || 'strength';
                            const increase = firstAttr === attr ? 2 : 1;
                            return (
                              <option key={attr} value={attr}>
                                {ATTRIBUTE_ABBR[attr]} - {ATTRIBUTE_NAMES[attr]} ({attrData.value} → {attrData.value + increase})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ability Selection Section */}
                {req.abilitySelection && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm sm:text-base font-semibold text-amber-200">
                      ✨ Escolha uma Nova Habilidade
                    </h4>
                    <p className="mb-3 text-xs sm:text-sm text-neutral-300">
                      Você pode escolher uma das seguintes habilidades:
                    </p>
                    <div className="space-y-2">
                      {req.abilitySelection.options.map((ability) => {
                        const isSelected =
                          data.abilitySelection?.selectedAbility.id === ability.id;

                        return (
                          <AbilitySelectionCard
                            key={ability.id}
                            title={ability.name}
                            description={ability.description}
                            category={'type' in ability ? (ability.type === 'passive' ? 'Passiva' : 'Ativa') : undefined}
                            isSelected={isSelected}
                            canSelect={true}
                            onClick={() =>
                              updateAbilitySelection(
                                req.equipmentId,
                                ability,
                                req.abilitySelection!.levelKey
                              )
                            }
                            colorClasses="border-amber-700/50 bg-amber-950/20"
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Expertise Selection Section */}
                {req.expertiseSelection && (
                  <div className="mb-4 rounded-lg border border-amber-700/50 bg-neutral-950 p-3 sm:p-4">
                    <h4 className="mb-2 text-sm sm:text-base font-semibold text-amber-200">
                      ⭐⭐ Expertise
                    </h4>
                    <ExpertiseSelector
                      skills={req.expertiseSelection.skills}
                      selectedExpertise={data.expertiseSelection?.selectedSkill}
                      onSelect={(skill) => updateExpertiseSelection(req.equipmentId, skill)}
                      canSelect={true}
                      themeColor={themeColor}
                    />
                  </div>
                )}

                {/* Auto Gains Section */}
                {req.autoGains && req.autoGains.length > 0 && (
                  <div className="rounded-lg border border-green-700/50 bg-neutral-950 p-3 sm:p-4">
                    <h4 className="mb-2 text-sm sm:text-base font-semibold text-green-200">
                      ✅ Ganhos Automáticos
                    </h4>
                    <p className="mb-3 text-xs sm:text-sm text-neutral-300">
                      Você ganha automaticamente no nível {req.level}:
                    </p>
                    <ul className="space-y-2">
                      {req.autoGains.map((gain, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-neutral-300 flex items-start gap-2">
                          <span className="flex-shrink-0">{gain.icon}</span>
                          <span>{gain.description}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-green-400">⚡ Nenhuma ação necessária!</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Validation Error */}
        {!isFormValid() && (
          <div className="mt-4 rounded-lg border border-red-700/50 bg-red-950/20 p-3 sm:p-4">
            <h4 className="mb-2 text-sm font-semibold text-red-300">
              ⚠️ Atenção: Preencha todos os campos obrigatórios
            </h4>
            <ul className="list-inside list-disc space-y-1 text-xs sm:text-sm text-neutral-300">
              {getAllMissingFields().map((item, idx) => (
                <li key={idx}>
                  <strong>{item.equipmentName}:</strong> {item.fields.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-neutral-700 bg-neutral-800 px-4 py-3 font-semibold text-neutral-300 transition-colors hover:bg-neutral-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isFormValid()}
            className={`flex-1 rounded-lg px-4 py-3 font-semibold text-white transition-colors ${
              isFormValid()
                ? `${theme.btnBg} ${theme.btnHover}`
                : `${theme.btnDisabled} cursor-not-allowed opacity-50`
            }`}
          >
            Confirmar ✓
          </button>
        </div>
      </div>
    </div>
  );
}
