# Claude Code - Documentação do Projeto

## Sistema de Level-Up e Expertise

### Expertise Selection

O sistema de expertise permite que personagens ganhem bônus dobrado de proficiência em uma perícia na qual já são proficientes.

#### Como Funciona

1. **Nível 6 do Cão**: O jogador escolhe uma perícia na qual o cão é proficiente para ganhar expertise
2. **Expertise** dobra o bônus de proficiência: `modificador + (proficiência × 2)`
3. **Exemplo**:
   - Proficiência normal no nível 6: `+2 (SAB) + 3 (prof) = +5`
   - Com expertise no nível 6: `+2 (SAB) + 6 (prof×2) = +8`

#### Implementação no Level-Up Modal

##### Types ([types/levelup.ts](types/levelup.ts))

```typescript
export type ExpertiseSelectionRequirement = {
  skills: Skills; // Current skills to filter proficient ones
};

export type ExpertiseSelectionData = {
  selectedSkill: SkillKey;
};

export type LevelUpRequirement = {
  // ... outros campos
  expertiseSelection?: ExpertiseSelectionRequirement;
};

export type LevelUpData = {
  // ... outros campos
  expertiseSelection?: ExpertiseSelectionData;
};
```

##### Componente Reutilizável

**[ExpertiseSelector](app/components/ExpertiseSelector.tsx)** - Seletor de expertise que pode ser usado em qualquer lugar:
- Filtra automaticamente apenas perícias proficientes
- Mostra visual feedback da seleção
- Suporta temas amber/red/purple
- Pode ser usado tanto na aba de habilidades quanto no level-up modal

#### Exemplo de Uso no Level-Up

No `getLevelUpRequirement` da página do personagem:

```typescript
// Nível 6 requer seleção de expertise
if (targetLevel === 6) {
  requirement.expertiseSelection = {
    skills: companion.skills,
  };
}
```

No `handleConfirmLevelUp`:

```typescript
if (data.expertiseSelection) {
  const skillKey = data.expertiseSelection.selectedSkill;

  // Remove expertise anterior
  if (companion.expertiseSkill) {
    updatedSkills[companion.expertiseSkill].expertise = false;
  }

  // Adiciona expertise na nova skill
  updatedSkills[skillKey].expertise = true;

  setCompanion({
    ...companion,
    expertiseSkill: skillKey,
    skills: updatedSkills,
  });
}
```

#### Componentes Envolvidos

1. **[LevelUpModal](app/components/LevelUpModal.tsx)** - Modal principal de level-up
2. **[ExpertiseSelector](app/components/ExpertiseSelector.tsx)** - Seletor reutilizável de expertise
3. **[types/levelup.ts](types/levelup.ts)** - Tipos e validações do sistema de level-up
4. **[types/skills.ts](types/skills.ts)** - Sistema de perícias e expertise

#### Outros Itens que Podem Usar

O `ExpertiseSelector` é um componente genérico que pode ser usado por qualquer item/personagem que precise selecionar expertise:
- Cão (nível 6)
- Personagens jogadores (se adicionados no futuro)
- Outros companheiros que ganhem expertise

Basta adicionar o `expertiseSelection` ao `LevelUpRequirement` do item.
