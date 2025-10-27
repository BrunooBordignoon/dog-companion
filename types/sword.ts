export type SwordAbility = {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active';
  awakening: 1 | 2 | 3 | 7 | 10;
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
  // Nível 1 - Habilidade Base (automática)
  {
    id: 'lamina-desperta',
    name: 'Lâmina Desperta',
    description: 'A espada torna-se consciente, sussurrando em voz quase inaudível. Todos os golpes agora são mágicos e afetam espíritos, aparições e mortos-vivos normalmente.',
    type: 'passive',
    awakening: 1,
  },
  // Nível 2 - Habilidade Base (automática)
  {
    id: 'eco-aco',
    name: 'Eco do Aço',
    description: 'A espada armazena parte da energia das mortes que causou. O usuário recebe +1 em testes de Intimidação enquanto estiver empunhando-a. Além disso, a lâmina brilha levemente diante de presenças espirituais a até 6 metros.',
    type: 'passive',
    awakening: 2,
  },
  // Nível 3 - Primeiro Despertar
  {
    id: 'choro-almas',
    name: 'Choro das Almas',
    description: 'A cada acerto crítico, o inimigo sofre +1d6 de dano necrótico. Se for um espírito ou morto-vivo, o dano adicional é radiante.',
    type: 'passive',
    awakening: 3,
  },
  {
    id: 'cicatriz-viva',
    name: 'Cicatriz Viva',
    description: 'Ao matar um inimigo, o usuário recupera 1d4 pontos de vida. Pode ocorrer apenas uma vez por rodada.',
    type: 'passive',
    awakening: 3,
  },
  {
    id: 'grito-forja',
    name: 'Grito da Forja',
    description: '1/descanso curto. Como ação bônus, o usuário desperta os ecos na lâmina, causando +1d8 de dano adicional em todos os ataques com ela até o fim do turno. Após o efeito, sofre 1d4 de dano necrótico.',
    type: 'active',
    awakening: 3,
  },
  // Nível 7 - Segundo Despertar
  {
    id: 'ecos-ceifa',
    name: 'Ecos da Ceifa',
    description: 'Quando atingir uma criatura, uma segunda criatura hostil a até 3 metros sofre 1d4 de dano espiritual (eco do golpe).',
    type: 'passive',
    awakening: 7,
  },
  {
    id: 'fome-aco',
    name: 'Fome do Aço',
    description: '1/descanso curto. O usuário sacrifica 5 PV para carregar a lâmina com energia sombria. O próximo ataque que acertar causa +2d8 de dano necrótico.',
    type: 'active',
    awakening: 7,
  },
  {
    id: 'luz-chora',
    name: 'Luz que Chora',
    description: 'Em um acerto crítico, o inimigo deve fazer um teste de Sabedoria (CD 13) ou ficar Amedrontado por 1 turno.',
    type: 'passive',
    awakening: 7,
  },
  // Nível 10 - Terceiro Despertar
  {
    id: 'eco-imortal',
    name: 'Eco Imortal',
    description: '1/descanso longo, quando o usuário cair a 0 PV, ele automaticamente volta a 1 PV. Vozes sussurram "ainda não terminou".',
    type: 'passive',
    awakening: 10,
  },
  {
    id: 'coracao-ferro-frio',
    name: 'Coração de Ferro Frio',
    description: 'O usuário ganha vantagem em testes contra medo e encanto, e +1 CA enquanto empunhar a espada.',
    type: 'passive',
    awakening: 10,
  },
  {
    id: 'explosao-ceifa',
    name: 'Explosão da Ceifa',
    description: '1/descanso longo. Como ação, finca a espada no chão, liberando um pulso espiritual. Todas as criaturas hostis em um raio de 6 metros fazem um teste de Constituição (CD 15) ou sofrem 3d8 de dano radiante ou necrótico (à escolha) e ficam derrubadas.',
    type: 'active',
    awakening: 10,
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
};

export const ABILITY_TYPE_COLORS: Record<SwordAbility['type'], string> = {
  passive: 'border-amber-700/50 bg-amber-950/20',
  active: 'border-red-700/50 bg-red-950/20',
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
