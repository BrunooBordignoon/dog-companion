export type SwordAbility = {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active' | 'reaction';
  awakening: 1 | 2 | 3 | 7 | 10;
  // Detalhes estilo D&D
  actionType?: 'action' | 'bonus' | 'reaction' | 'free' | 'none';
  range?: string;
  duration?: string;
  damageType?: string;
  damage?: string;
  savingThrow?: string;
  condition?: string;
  limit?: string;
  cost?: string;
};

export type SelectedSwordAbilities = {
  level3?: SwordAbility;
  level7?: SwordAbility;
  level10?: SwordAbility;
};

export type SwordData = {
  characterName: string;
  level: number;
  selectedAbilities: SelectedSwordAbilities;
};

export const SWORD_ABILITIES: SwordAbility[] = [
  // Nível 1 - Eco do Aço (TROCADO COM NÍVEL 2)
  {
    id: 'eco-aco',
    name: 'Eco do Aço',
    description: 'A espada armazena parte da energia das mortes que causou. O usuário recebe +1 em testes de Intimidação e Percepção passiva para detectar espíritos. O portador sente uma presença gélida quando há mortos-vivos ou espectros próximos.',
    type: 'passive',
    awakening: 1,
    actionType: 'none',
    range: '6 metros (detecção)',
    duration: 'Permanente',
    condition: 'Empunhando a espada',
  },
  // Nível 2 - Lâmina Desperta (TROCADO COM NÍVEL 1)
  {
    id: 'lamina-desperta',
    name: 'Lâmina Desperta',
    description: 'A espada torna-se consciente, sussurrando em voz quase inaudível. Todos os golpes agora contam como mágicos e podem atingir criaturas etéreas, espíritos, aparições e mortos-vivos normalmente.',
    type: 'passive',
    awakening: 2,
    actionType: 'none',
    duration: 'Permanente',
    damageType: 'Mágico',
  },
  // Nível 3 - Primeiro Despertar
  {
    id: 'choro-almas',
    name: 'Choro das Almas',
    description: 'A cada acerto crítico, o inimigo sofre dano necrótico adicional. Se o alvo for um espírito ou morto-vivo, o dano adicional é reduzido mas causa dano radiante.',
    type: 'passive',
    awakening: 3,
    actionType: 'none',
    damage: '+1d6 necrótico / +1d4 radiante (mortos-vivos)',
    damageType: 'Necrótico ou Radiante',
    condition: 'Acerto crítico',
  },
  {
    id: 'cicatriz-viva',
    name: 'Cicatriz Viva',
    description: 'Ao matar uma criatura, a espada absorve parte de sua essência vital, recuperando pontos de vida do usuário.',
    type: 'passive',
    awakening: 3,
    actionType: 'none',
    damage: 'Cura 1d4 PV',
    condition: 'Matar uma criatura',
    limit: '1 vez por rodada',
  },
  {
    id: 'grito-forja',
    name: 'Grito da Forja',
    description: 'O usuário desperta os ecos presos na lâmina, liberando uma explosão de energia que amplifica seus ataques. Após o efeito, a energia sombria remanescente fere o portador.',
    type: 'active',
    awakening: 3,
    actionType: 'bonus',
    duration: 'Até o fim do turno',
    damage: '+1d6 em todos os ataques',
    damageType: 'Necrótico',
    cost: '1d4 de dano necrótico (após o efeito)',
    limit: '1x por descanso curto',
  },
  // Nível 7 - Segundo Despertar
  {
    id: 'ecos-ceifa',
    name: 'Ecos da Ceifa',
    description: 'Quando acertar uma criatura com a espada, o eco espiritual do golpe ressoa, atingindo uma segunda criatura hostil próxima. O dano é reduzido, mas ignora resistências físicas.',
    type: 'passive',
    awakening: 7,
    actionType: 'none',
    range: '3 metros (da primeira criatura)',
    damage: '1d4 espiritual',
    damageType: 'Espiritual (força)',
    condition: 'Acertar uma criatura',
    limit: '1 vez por turno',
  },
  {
    id: 'fome-aco',
    name: 'Fome do Aço',
    description: 'O usuário sacrifica sua própria vitalidade para alimentar a lâmina com energia sombria concentrada. O próximo golpe que acertar libera toda essa energia acumulada.',
    type: 'active',
    awakening: 7,
    actionType: 'bonus',
    damage: '+2d8 necrótico (próximo ataque)',
    damageType: 'Necrótico',
    cost: '5 PV',
    limit: '1x por descanso curto',
  },
  {
    id: 'luz-chora',
    name: 'Luz que Chora',
    description: 'Quando a lâmina atinge um ponto vital, ela emite um lamento sobrenatural que aterroriza o alvo. Criaturas fracas de espírito podem ficar paralisadas de medo.',
    type: 'passive',
    awakening: 7,
    actionType: 'none',
    savingThrow: 'Sabedoria CD 13',
    condition: 'Acerto crítico',
    damageType: 'Amedrontado (1 turno)',
  },
  // Nível 10 - Terceiro Despertar
  {
    id: 'eco-imortal',
    name: 'Eco Imortal',
    description: 'As almas presas na espada se recusam a deixar seu portador morrer. Quando cairia a 0 PV, vozes sussurram "ainda não terminou" e o usuário é imediatamente ressuscitado com 1 PV.',
    type: 'passive',
    awakening: 10,
    actionType: 'none',
    damage: 'Cura para 1 PV',
    condition: 'Cair a 0 PV',
    limit: '1x por descanso longo',
  },
  {
    id: 'coracao-ferro-frio',
    name: 'Coração de Ferro Frio',
    description: 'A consciência sombria da espada protege a mente do usuário contra influências externas, enquanto sua presença física reforça suas defesas. O portador torna-se mais resiliente em combate.',
    type: 'passive',
    awakening: 10,
    actionType: 'none',
    duration: 'Permanente',
    condition: 'Empunhando a espada',
    savingThrow: 'Vantagem contra medo e encantamento',
    damageType: '+1 CA',
  },
  {
    id: 'explosao-ceifa',
    name: 'Explosão da Ceifa',
    description: 'O usuário finca a espada no chão, liberando um pulso explosivo de energia espiritual. Todas as criaturas hostis próximas são atingidas pela onda de energia sombria ou radiante.',
    type: 'active',
    awakening: 10,
    actionType: 'action',
    range: 'Raio de 6 metros',
    damage: '3d8 radiante ou necrótico (à escolha)',
    damageType: 'Radiante ou Necrótico',
    savingThrow: 'Constituição CD 15',
    condition: 'Criaturas ficam Derrubadas (falha)',
    limit: '1x por descanso longo',
  },
];

export const AWAKENING_NAMES: Record<number, string> = {
  1: 'Lâmina Desperta',
  2: 'Lâmina Desperta',
  3: '1º Despertar',
  7: '2º Despertar',
  10: '3º Despertar',
};

export const ABILITY_TYPE_NAMES: Record<SwordAbility['type'], string> = {
  passive: 'Passiva',
  active: 'Ativa',
  reaction: 'Reação',
};

export const ABILITY_TYPE_COLORS: Record<SwordAbility['type'], string> = {
  passive: 'border-amber-700/50 bg-amber-950/20',
  active: 'border-red-700/50 bg-red-950/20',
  reaction: 'border-blue-700/50 bg-blue-950/20',
};

export const ACTION_TYPE_NAMES: Record<string, string> = {
  action: 'Ação',
  bonus: 'Ação Bônus',
  reaction: 'Reação',
  free: 'Ação Livre',
  none: 'Automática',
};

export function getAwakeningLevel(level: number): number {
  if (level >= 10) return 10;
  if (level >= 7) return 7;
  if (level >= 3) return 3;
  if (level >= 2) return 2;
  return 1;
}

export function getBaseDamage(): string {
  return '1d8 (uma mão) / 1d10 (duas mãos)';
}

export function getSwordBonus(): string {
  return '+1 (mágica)';
}
