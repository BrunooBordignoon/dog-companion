'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
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
  BASE_COMPANION_ABILITIES,
  getPathThemeColor,
} from '@/types/companion';
import { getDogInitialSkills, getProficiencyBonus, SkillKey } from '@/types/skills';
import ItemHeader from '@/app/components/ItemHeader';
import StatCard from '@/app/components/StatCard';
import AttributeGrid from '@/app/components/AttributeGrid';
import WarningBanner from '@/app/components/WarningBanner';
import SectionHeader from '@/app/components/SectionHeader';
import ContentBox from '@/app/components/ContentBox';
import LevelSectionHeader from '@/app/components/LevelSectionHeader';
import PathInfoCard from '@/app/components/PathInfoCard';
import TabNavigation from '@/app/components/TabNavigation';
import SkillsTable from '@/app/components/SkillsTable';
import ExpertiseSelector from '@/app/components/ExpertiseSelector';
import HPRollEditor from '@/app/components/HPRollEditor';
import AttributeIncreaseEditor from '@/app/components/AttributeIncreaseEditor';
import LevelAccordion from '@/app/components/LevelAccordion';
import EnhancedAbilityCard from '@/app/components/EnhancedAbilityCard';

import {
  LevelUpRequirement,
  LevelUpData,
} from '@/types/levelup';
import {
  getCaoPendingItemsForLevel,
  getTotalCaoPendingCount,
} from '@/app/utils/pendingItems';

export interface CaoPageRef {
  getLevelUpRequirement: (level: number) => LevelUpRequirement | null;
  confirmLevelUp: (data: LevelUpData) => void;
}

const CaoPage = forwardRef<CaoPageRef, {
  level: number;
  onLevelChange?: (newLevel: number) => void;
  readOnly?: boolean;
  initialData?: Record<string, string>;
}>(function CaoPage({ level, onLevelChange, readOnly = false, initialData }, ref) {

  const [activeTab, setActiveTab] = useState<'combat' | 'abilities' | 'hp' | 'skills'>('combat');
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
    skills: getDogInitialSkills(),
  });

  const [companion, setCompanion] = useState<CompanionData>(getInitialCompanionData());

  // Load from localStorage or initialData on mount
  useEffect(() => {
    // Se readOnly, carregar dados do initialData ao invés do localStorage
    if (readOnly && initialData) {
      const saved = initialData['dogCompanion'];
      if (saved) {
        try {
          const data = JSON.parse(saved);
          // Migração: adicionar skills se não existir
          if (!data.skills) {
            data.skills = getDogInitialSkills();
          } else {
            // Migração: adicionar advantage nas skills de investigação e percepção se não existir
            if (!data.skills.investigation?.advantage) {
              data.skills.investigation = { proficient: true, expertise: false, advantage: true };
            }
            if (!data.skills.perception?.advantage) {
              data.skills.perception = { proficient: true, expertise: false, advantage: true };
            }
          }
          setCompanion(data);
        } catch (e) {
          console.error('Failed to load saved data:', e);
        }
      }
      setIsLoaded(true);
      return;
    }

    // Modo normal: carregar do localStorage
    const saved = localStorage.getItem('dogCompanion');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Migração: adicionar skills se não existir
        if (!data.skills) {
          data.skills = getDogInitialSkills();
        } else {
          // Migração: adicionar advantage nas skills de investigação e percepção se não existir
          if (!data.skills.investigation?.advantage) {
            data.skills.investigation = { proficient: true, expertise: false, advantage: true };
          }
          if (!data.skills.perception?.advantage) {
            data.skills.perception = { proficient: true, expertise: false, advantage: true };
          }
        }
        setCompanion(data);
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
    setIsLoaded(true);
  }, [readOnly, initialData]);

  // Save to localStorage whenever companion changes (only if not readOnly)
  useEffect(() => {
    if (isLoaded && !readOnly) {
      localStorage.setItem('dogCompanion', JSON.stringify(companion));
    }
  }, [companion, isLoaded, readOnly]);

  // Function exposed to parent to get level-up requirements
  const getLevelUpRequirement = (targetLevel: number): LevelUpRequirement | null => {
    if (targetLevel < 1 || targetLevel > 10) return null;
    if (targetLevel <= companion.level) return null; // No requirement for level-down

    // Check if this level requires any input
    const isAbilityLevel = [3, 5, 7, 10].includes(targetLevel);
    const isExpertiseLevel = targetLevel === 9;
    const requiresHP = targetLevel > 1; // All level-ups require HP roll

    if (!requiresHP && !isAbilityLevel && !isExpertiseLevel) return null;

    const requirement: LevelUpRequirement = {
      equipmentId: 'cao',
      equipmentName: 'Cão de Guarda',
      equipmentIcon: '🐕',
      level: targetLevel,
    };

    // HP Roll requirement
    if (requiresHP) {
      requirement.hpRoll = {
        diceType: 'd6',
        currentModifier: companion.attributes.constitution.modifier,
        modifierLabel: 'CON',
      };
    }

    // Attribute Increase requirement (levels 3, 5, 7, 10)
    if (isAbilityLevel) {
      requirement.attributeIncrease = {
        count: 2,
        currentAttributes: companion.attributes,
      };

      // Ability Selection requirement (levels 3, 5, 7, 10)
      const levelKey = `level${targetLevel}` as keyof typeof companion.selectedAbilities;
      const abilitiesForLevel = ABILITIES.filter((a) => a.level === targetLevel);

      if (abilitiesForLevel.length > 0) {
        requirement.abilitySelection = {
          count: 1,
          options: abilitiesForLevel,
          levelKey,
        };
      }
    }

    // Expertise Selection requirement (level 9)
    if (isExpertiseLevel) {
      requirement.expertiseSelection = {
        skills: companion.skills,
      };
    }

    return requirement;
  };

  // Function exposed to parent to confirm level-up with collected data
  const handleConfirmLevelUp = (data: LevelUpData) => {
    if (data.equipmentId !== 'cao') return;

    const newLevel = data.level;
    const isAbilityLevel = [3, 5, 7, 10].includes(newLevel);

    // Use functional update to avoid stale state when called multiple times
    setCompanion((prevCompanion) => {
      // Update attributes only on ability levels
      const newAttributes = { ...prevCompanion.attributes };
      let newAttributeIncreases = [...prevCompanion.attributeIncreases];

      if (isAbilityLevel && data.attributeIncrease) {
        const [attr1, attr2] = data.attributeIncrease.attributes;

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
          ...prevCompanion.attributeIncreases,
          { level: newLevel, attributes: [attr1, attr2] },
        ];
      } else if (isAbilityLevel && !data.attributeIncrease) {
        // No attribute increase provided - create empty entry (for level jumps)
        const existingIncrease = prevCompanion.attributeIncreases.find(inc => inc.level === newLevel);
        if (!existingIncrease) {
          // Create placeholder - will be marked as pending
          // Don't add to array - let it remain undefined so it shows as pending
        }
      }

      // Process ability selection
      let newSelectedAbilities = { ...prevCompanion.selectedAbilities };
      if (data.abilitySelection) {
        newSelectedAbilities = {
          ...prevCompanion.selectedAbilities,
          [data.abilitySelection.levelKey]: data.abilitySelection.selectedAbility as Ability,
        };
      }

      // Process expertise selection
      let newSkills = { ...prevCompanion.skills };
      let newExpertiseSkill = prevCompanion.expertiseSkill;

      if (data.expertiseSelection) {
        const skillKey = data.expertiseSelection.selectedSkill;

        // Remove expertise from previous skill
        if (prevCompanion.expertiseSkill) {
          newSkills[prevCompanion.expertiseSkill] = {
            ...newSkills[prevCompanion.expertiseSkill],
            expertise: false,
          };
        }

        // Add expertise to new skill
        newSkills[skillKey] = {
          ...newSkills[skillKey],
          expertise: true,
        };

        newExpertiseSkill = skillKey;
      }

      // Process HP roll
      let newHistory = [...prevCompanion.hpHistory];
      let newMaxHp = prevCompanion.maxHp;
      let newHp = prevCompanion.hp;

      if (data.hpRoll) {
        const newEntry: HPHistoryEntry = {
          level: newLevel,
          roll: data.hpRoll.roll,
          modifier: data.hpRoll.modifier,
          total: data.hpRoll.total,
        };

        newHistory = [...prevCompanion.hpHistory, newEntry];
        newMaxHp = calculateMaxHP(newHistory);
        newHp = prevCompanion.hp + data.hpRoll.total;
      } else {
        // No HP roll - create empty entry (for level jumps)
        // Check if entry doesn't already exist
        const existingEntry = prevCompanion.hpHistory.find(e => e.level === newLevel);
        if (!existingEntry) {
          const emptyEntry: HPHistoryEntry = {
            level: newLevel,
            roll: 0, // Pendente
            modifier: prevCompanion.attributes.constitution.modifier,
            total: 0,
          };
          newHistory = [...prevCompanion.hpHistory, emptyEntry].sort((a, b) => a.level - b.level);
        }
        // Don't recalculate HP when creating empty entry
      }

      return {
        ...prevCompanion,
        level: newLevel,
        attributes: newAttributes,
        hpHistory: newHistory,
        maxHp: newMaxHp,
        hp: newHp,
        attributeIncreases: newAttributeIncreases,
        selectedAbilities: newSelectedAbilities,
        skills: newSkills,
        expertiseSkill: newExpertiseSkill,
      };
    });
  };

  // Handle level-down (called when level prop changes to lower value)
  const handleLevelChange = (newLevel: number) => {
    if (newLevel < 1 || newLevel > 10) return;
    if (newLevel >= companion.level) return; // Level-up is handled by parent now

    // Level-down - remove HP history entries, attribute increases, and abilities
    const newHistory = companion.hpHistory.filter((entry) => entry.level <= newLevel);
    const newAttributeIncreases = companion.attributeIncreases.filter((inc) => inc.level <= newLevel);

    // Remove abilities above new level
    const newSelectedAbilities = { ...companion.selectedAbilities };
    if (newLevel < 3) delete newSelectedAbilities.level3;
    if (newLevel < 5) delete newSelectedAbilities.level5;
    if (newLevel < 7) delete newSelectedAbilities.level7;
    if (newLevel < 10) delete newSelectedAbilities.level10;

    // Remove expertise if below level 9
    let newExpertiseSkill = companion.expertiseSkill;
    const newSkills = { ...companion.skills };

    if (newLevel < 9 && companion.expertiseSkill) {
      // Remove expertise from the skill
      newSkills[companion.expertiseSkill] = {
        ...newSkills[companion.expertiseSkill],
        expertise: false,
      };
      newExpertiseSkill = undefined;
    }

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
      skills: newSkills,
      expertiseSkill: newExpertiseSkill,
      maxHp: newMaxHp,
      hp: Math.min(companion.hp, newMaxHp),
    });
  };

  // Expose functions to parent via ref
  useImperativeHandle(ref, () => ({
    getLevelUpRequirement,
    confirmLevelUp: handleConfirmLevelUp,
  }), [companion]);

  // Sync companion level with prop level (only for level-down)
  useEffect(() => {
    if (isLoaded && level < companion.level) {
      // Level-down only
      handleLevelChange(level);
    }
  }, [level, isLoaded, companion.level]);


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

  const selectExpertise = (skillKey: SkillKey) => {
    // Remover expertise da skill anterior (se houver)
    const updatedSkills = { ...companion.skills };

    if (companion.expertiseSkill) {
      updatedSkills[companion.expertiseSkill] = {
        ...updatedSkills[companion.expertiseSkill],
        expertise: false,
      };
    }

    // Adicionar expertise na nova skill
    updatedSkills[skillKey] = {
      ...updatedSkills[skillKey],
      expertise: true,
    };

    setCompanion({
      ...companion,
      expertiseSkill: skillKey,
      skills: updatedSkills,
    });
  };

  const updateHPRoll = (level: number, newRoll: number) => {
    const hpEntry = companion.hpHistory.find((entry) => entry.level === level);
    if (!hpEntry) return;

    const updatedHistory = companion.hpHistory.map((entry) => {
      if (entry.level === level) {
        return {
          ...entry,
          roll: newRoll,
          total: newRoll + entry.modifier,
        };
      }
      return entry;
    });

    const newMaxHp = calculateMaxHP(updatedHistory);

    setCompanion({
      ...companion,
      hpHistory: updatedHistory,
      maxHp: newMaxHp,
      hp: Math.min(companion.hp, newMaxHp),
    });
  };

  const updateAttributeIncrease = (level: number, attributes: [AttributeKey, AttributeKey]) => {
    const existingIncrease = companion.attributeIncreases.find((inc) => inc.level === level);

    // Calculate the difference to apply/remove
    const oldAttributes = existingIncrease?.attributes || [undefined, undefined];
    const newAttributes = { ...companion.attributes };

    // Remove old increases
    if (oldAttributes[0]) {
      newAttributes[oldAttributes[0]] = {
        value: newAttributes[oldAttributes[0]].value - 1,
        modifier: calculateModifier(newAttributes[oldAttributes[0]].value - 1),
      };
    }
    if (oldAttributes[1] && oldAttributes[1] !== oldAttributes[0]) {
      newAttributes[oldAttributes[1]] = {
        value: newAttributes[oldAttributes[1]].value - 1,
        modifier: calculateModifier(newAttributes[oldAttributes[1]].value - 1),
      };
    } else if (oldAttributes[1] && oldAttributes[1] === oldAttributes[0]) {
      newAttributes[oldAttributes[0]] = {
        value: newAttributes[oldAttributes[0]].value - 1,
        modifier: calculateModifier(newAttributes[oldAttributes[0]].value - 1),
      };
    }

    // Apply new increases
    newAttributes[attributes[0]] = {
      value: newAttributes[attributes[0]].value + 1,
      modifier: calculateModifier(newAttributes[attributes[0]].value + 1),
    };

    if (attributes[1] !== attributes[0]) {
      newAttributes[attributes[1]] = {
        value: newAttributes[attributes[1]].value + 1,
        modifier: calculateModifier(newAttributes[attributes[1]].value + 1),
      };
    } else {
      newAttributes[attributes[0]] = {
        value: newAttributes[attributes[0]].value + 1,
        modifier: calculateModifier(newAttributes[attributes[0]].value + 1),
      };
    }

    // Update or add the attribute increase
    const updatedIncreases = existingIncrease
      ? companion.attributeIncreases.map((inc) =>
          inc.level === level ? { level, attributes } : inc
        )
      : [...companion.attributeIncreases, { level, attributes }];

    // Recalculate HP with new CON modifier
    const conModifier = newAttributes.constitution.modifier;
    const updatedHistory = companion.hpHistory.map((entry) => ({
      ...entry,
      modifier: conModifier,
      total: entry.roll + conModifier,
    }));
    const newMaxHp = calculateMaxHP(updatedHistory);

    setCompanion({
      ...companion,
      attributes: newAttributes,
      attributeIncreases: updatedIncreases,
      hpHistory: updatedHistory,
      maxHp: newMaxHp,
      hp: Math.min(companion.hp, newMaxHp),
    });
  };

  // Check for unselected abilities (deprecated - kept for compatibility)
  const getUnselectedAbilityLevels = (): number[] => {
    const unselected: number[] = [];
    if (companion.level >= 3 && !companion.selectedAbilities.level3) unselected.push(3);
    if (companion.level >= 5 && !companion.selectedAbilities.level5) unselected.push(5);
    if (companion.level >= 9 && !companion.expertiseSkill) unselected.push(9);
    if (companion.level >= 7 && !companion.selectedAbilities.level7) unselected.push(7);
    if (companion.level >= 10 && !companion.selectedAbilities.level10) unselected.push(10);
    return unselected;
  };

  // Get total pending count using new system
  const getTotalPendingCount = (): number => {
    return getTotalCaoPendingCount(
      companion.level,
      companion.hpHistory,
      companion.selectedAbilities,
      companion.attributeIncreases,
      companion.expertiseSkill
    );
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
          maxLevel={10}
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
          readOnly={readOnly}
        />

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="PV"
            value={`${companion.hp}/${companion.maxHp}`}
            color="red"
            interactive={!readOnly ? {
              onDecrease: () => handleHPChange(companion.hp - 1),
              onIncrease: () => handleHPChange(companion.hp + 1),
            } : undefined}
          />
          <StatCard label="CA" value={companion.ac} color="blue" />
          <StatCard label="Deslocamento" value={`${companion.speed}m`} color="green" />
          <StatCard label="PROFICIÊNCIA" value={`+${getProficiencyBonus(companion.level)}`} color="amber" />
        </div>

        {/* Attributes */}
        <AttributeGrid attributes={companion.attributes} themeColor="amber" />

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
            { id: 'combat', label: 'Combate', icon: '⚔️' },
            { id: 'abilities', label: 'Progressão', icon: '🧭', badge: getTotalPendingCount() },
            { id: 'skills', label: 'Perícias', icon: '🎓' },
            { id: 'hp', label: 'Pontos de Vida', icon: '❤️' },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'combat' | 'abilities' | 'hp' | 'skills')}
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
                {BASE_COMPANION_ABILITIES.filter(ability => companion.level >= ability.level).map((ability) => (
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
                    themeColor="amber"
                  />
                ))}

                {/* Selected Path Abilities */}
                {Object.entries(companion.selectedAbilities).map(([levelKey, selectedAbility]) => {
                  if (!selectedAbility) return null;
                  // Only show abilities at or below current level
                  if (selectedAbility.level > companion.level) return null;

                  // Find the full ability data from ABILITIES array
                  const fullAbility = ABILITIES.find(a => a.id === selectedAbility.id);
                  if (!fullAbility) return null;

                  return (
                    <EnhancedAbilityCard
                      key={fullAbility.id}
                      name={`${PATH_NAMES[fullAbility.path]} – ${fullAbility.name}`}
                      description={fullAbility.description}
                      type={fullAbility.type}
                      actionType={fullAbility.actionType}
                      range={fullAbility.range}
                      duration={fullAbility.duration}
                      damageType={fullAbility.damageType}
                      damage={fullAbility.damage}
                      savingThrow={fullAbility.savingThrow}
                      condition={fullAbility.condition}
                      limit={fullAbility.limit}
                      cost={fullAbility.cost}
                      isUnlocked={true}
                      isSelected={false}
                      canSelect={false}
                      themeColor={getPathThemeColor(fullAbility.path)}
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
          <div className="space-y-3">
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
                  icon="👻"
                  title="Eco Espiritual"
                  subtitle="espiritual"
                  description="Interage com espíritos e protege contra ameaças sobrenaturais. Ideal para enfrentar mortos-vivos e aparições."
                  borderColor="border-purple-700/50"
                  bgGradient="from-purple-950/20"
                />
              </div>
              <p className="mt-3 text-xs italic text-neutral-500">
                💡 Dica: Você pode mesclar caminhos diferentes em cada nível para criar um cão único!
              </p>
            </ContentBox>

            {/* Level 1 */}
            <LevelAccordion
              level={1}
              title="Habilidade de Classe"
              isLocked={companion.level < 1}
              isPending={getCaoPendingItemsForLevel(1, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(1, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 1}
              themeColor="amber"
            >
              {BASE_COMPANION_ABILITIES.filter(ability => ability.level === 1).map((ability) => (
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
                  isUnlocked={companion.level >= 1}
                  isSelected={false}
                  canSelect={false}
                  themeColor="amber"
                />
              ))}
              <HPRollEditor
                level={1}
                hpEntry={companion.hpHistory.find(e => e.level === 1)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(1, roll)}
                canEdit={false}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 2 */}
            <LevelAccordion
              level={2}
              title="Habilidade de Classe"
              isLocked={companion.level < 2}
              isPending={getCaoPendingItemsForLevel(2, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(2, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 2}
              themeColor="amber"
            >
              {BASE_COMPANION_ABILITIES.filter(ability => ability.level === 2).map((ability) => (
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
                  isUnlocked={companion.level >= 2}
                  isSelected={false}
                  canSelect={false}
                  themeColor="amber"
                />
              ))}
              <HPRollEditor
                level={2}
                hpEntry={companion.hpHistory.find(e => e.level === 2)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(2, roll)}
                canEdit={companion.level >= 2 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 3 - Path Selection & Attribute Increase */}
            <LevelAccordion
              level={3}
              title="Escolha de Caminho"
              isLocked={companion.level < 3}
              isPending={getCaoPendingItemsForLevel(3, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(3, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 3}
              themeColor="amber"
            >
              {getAbilitiesForLevel(3).map((ability) => {
                const isSelected = companion.selectedAbilities.level3?.id === ability.id;

                return (
                  <EnhancedAbilityCard
                    key={ability.id}
                    name={`${PATH_NAMES[ability.path]} – ${ability.name}`}
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
                    isUnlocked={companion.level >= 3}
                    isSelected={isSelected}
                    canSelect={companion.level >= 3 && !readOnly}
                    onClick={() => !readOnly && selectAbility(ability)}
                    themeColor={getPathThemeColor(ability.path)}
                  />
                );
              })}
              <AttributeIncreaseEditor
                level={3}
                attributeIncrease={companion.attributeIncreases.find(a => a.level === 3)}
                onUpdate={(attrs) => updateAttributeIncrease(3, attrs)}
                canEdit={companion.level >= 3 && !readOnly}
                themeColor="amber"
              />
              <HPRollEditor
                level={3}
                hpEntry={companion.hpHistory.find(e => e.level === 3)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(3, roll)}
                canEdit={companion.level >= 3 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 4 */}
            <LevelAccordion
              level={4}
              title="Progressão de Nível"
              isLocked={companion.level < 4}
              isPending={getCaoPendingItemsForLevel(4, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(4, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 4}
              themeColor="amber"
            >
              <HPRollEditor
                level={4}
                hpEntry={companion.hpHistory.find(e => e.level === 4)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(4, roll)}
                canEdit={companion.level >= 4 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 5 - Path Selection & Attribute Increase */}
            <LevelAccordion
              level={5}
              title="Escolha de Caminho"
              isLocked={companion.level < 5}
              isPending={getCaoPendingItemsForLevel(5, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(5, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 5}
              themeColor="amber"
            >
              {getAbilitiesForLevel(5).map((ability) => {
                const isSelected = companion.selectedAbilities.level5?.id === ability.id;

                return (
                  <EnhancedAbilityCard
                    key={ability.id}
                    name={`${PATH_NAMES[ability.path]} – ${ability.name}`}
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
                    isUnlocked={companion.level >= 5}
                    isSelected={isSelected}
                    canSelect={companion.level >= 5 && !readOnly}
                    onClick={() => !readOnly && selectAbility(ability)}
                    themeColor={getPathThemeColor(ability.path)}
                  />
                );
              })}
              <AttributeIncreaseEditor
                level={5}
                attributeIncrease={companion.attributeIncreases.find(a => a.level === 5)}
                onUpdate={(attrs) => updateAttributeIncrease(5, attrs)}
                canEdit={companion.level >= 5 && !readOnly}
                themeColor="amber"
              />
              <HPRollEditor
                level={5}
                hpEntry={companion.hpHistory.find(e => e.level === 5)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(5, roll)}
                canEdit={companion.level >= 5 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 6 */}
            <LevelAccordion
              level={6}
              title="Progressão de Nível"
              isLocked={companion.level < 6}
              isPending={getCaoPendingItemsForLevel(6, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(6, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 6}
              themeColor="amber"
            >
              <HPRollEditor
                level={6}
                hpEntry={companion.hpHistory.find(e => e.level === 6)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(6, roll)}
                canEdit={companion.level >= 6 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 7 - Path Selection & Attribute Increase */}
            <LevelAccordion
              level={7}
              title="Escolha de Caminho"
              isLocked={companion.level < 7}
              isPending={getCaoPendingItemsForLevel(7, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(7, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 7}
              themeColor="amber"
            >
              {getAbilitiesForLevel(7).map((ability) => {
                const isSelected = companion.selectedAbilities.level7?.id === ability.id;

                return (
                  <EnhancedAbilityCard
                    key={ability.id}
                    name={`${PATH_NAMES[ability.path]} – ${ability.name}`}
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
                    isUnlocked={companion.level >= 7}
                    isSelected={isSelected}
                    canSelect={companion.level >= 7 && !readOnly}
                    onClick={() => !readOnly && selectAbility(ability)}
                    themeColor={getPathThemeColor(ability.path)}
                  />
                );
              })}
              <AttributeIncreaseEditor
                level={7}
                attributeIncrease={companion.attributeIncreases.find(a => a.level === 7)}
                onUpdate={(attrs) => updateAttributeIncrease(7, attrs)}
                canEdit={companion.level >= 7 && !readOnly}
                themeColor="amber"
              />
              <HPRollEditor
                level={7}
                hpEntry={companion.hpHistory.find(e => e.level === 7)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(7, roll)}
                canEdit={companion.level >= 7 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 8 */}
            <LevelAccordion
              level={8}
              title="Progressão de Nível"
              isLocked={companion.level < 8}
              isPending={getCaoPendingItemsForLevel(8, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(8, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 8}
              themeColor="amber"
            >
              <HPRollEditor
                level={8}
                hpEntry={companion.hpHistory.find(e => e.level === 8)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(8, roll)}
                canEdit={companion.level >= 8 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 9 - Expertise */}
            <LevelAccordion
              level={9}
              title="Expertise"
              isLocked={companion.level < 9}
              isPending={getCaoPendingItemsForLevel(9, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(9, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 9}
              themeColor="amber"
            >
              <ExpertiseSelector
                skills={companion.skills}
                selectedExpertise={companion.expertiseSkill}
                onSelect={selectExpertise}
                canSelect={companion.level >= 9 && !readOnly}
                themeColor="amber"
              />
              <HPRollEditor
                level={9}
                hpEntry={companion.hpHistory.find(e => e.level === 9)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(9, roll)}
                canEdit={companion.level >= 9 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>

            {/* Level 10 - Path Selection & Attribute Increase */}
            <LevelAccordion
              level={10}
              title="Escolha de Caminho"
              isLocked={companion.level < 10}
              isPending={getCaoPendingItemsForLevel(10, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount > 0}
              pendingCount={getCaoPendingItemsForLevel(10, companion.level, companion.hpHistory, companion.selectedAbilities, companion.attributeIncreases, companion.expertiseSkill).pendingCount}
              defaultOpen={companion.level === 10}
              themeColor="amber"
            >
              {getAbilitiesForLevel(10).map((ability) => {
                const isSelected = companion.selectedAbilities.level10?.id === ability.id;

                return (
                  <EnhancedAbilityCard
                    key={ability.id}
                    name={`${PATH_NAMES[ability.path]} – ${ability.name}`}
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
                    isUnlocked={companion.level >= 10}
                    isSelected={isSelected}
                    canSelect={companion.level >= 10 && !readOnly}
                    onClick={() => !readOnly && selectAbility(ability)}
                    themeColor={getPathThemeColor(ability.path)}
                  />
                );
              })}
              <AttributeIncreaseEditor
                level={10}
                attributeIncrease={companion.attributeIncreases.find(a => a.level === 10)}
                onUpdate={(attrs) => updateAttributeIncrease(10, attrs)}
                canEdit={companion.level >= 10 && !readOnly}
                themeColor="amber"
              />
              <HPRollEditor
                level={10}
                hpEntry={companion.hpHistory.find(e => e.level === 10)}
                maxDice={6}
                conModifier={companion.attributes.constitution.modifier}
                onUpdate={(roll) => updateHPRoll(10, roll)}
                canEdit={companion.level >= 10 && !readOnly}
                themeColor="amber"
              />
            </LevelAccordion>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <ContentBox title="Perícias do Companheiro" icon="🎓" themeColor="amber">
              <SkillsTable
                attributes={companion.attributes}
                skills={companion.skills}
                proficiencyBonus={getProficiencyBonus(companion.level)}
                themeColor="amber"
              />
            </ContentBox>
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
    </div>
  );
});

export default CaoPage;
