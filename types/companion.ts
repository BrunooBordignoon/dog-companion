export type Attribute = {
  value: number;
  modifier: number;
};

export type Attributes = {
  strength: Attribute;
  dexterity: Attribute;
  constitution: Attribute;
  intelligence: Attribute;
  wisdom: Attribute;
  charisma: Attribute;
};

export type PathType = 'presa-firme' | 'escudo-fiel' | 'olhar-fantasma';

export type Ability = {
  id: string;
  name: string;
  description: string;
  path: PathType;
  level: 3 | 5 | 7 | 10;
};

export type SelectedAbilities = {
  level3?: Ability;
  level5?: Ability;
  level7?: Ability;
  level10?: Ability;
};

export type HPHistoryEntry = {
  level: number;
  roll: number; // d6 roll result
  modifier: number; // CON modifier at that level
  total: number; // roll + modifier
};

export type AttributeKey = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export type AttributeIncrease = {
  level: number;
  attributes: [AttributeKey, AttributeKey]; // Two attributes chosen (can be same)
};

export type CompanionData = {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  ac: number;
  speed: number;
  attributes: Attributes;
  selectedAbilities: SelectedAbilities;
  hpHistory: HPHistoryEntry[]; // HP gains per level
  attributeIncreases: AttributeIncrease[]; // Attribute increases per level
};

export const ABILITIES: Ability[] = [
  // Nível 3 - Presa Firme
  {
    id: 'mordida-precisa',
    name: 'Mordida Precisa',
    description: 'Passiva. O ataque de mordida causa 1d8 + Destreza de dano. Se o dono atacar o mesmo alvo no turno, o cão causa +2 de dano adicional.',
    path: 'presa-firme',
    level: 3,
  },
  // Nível 3 - Escudo Fiel
  {
    id: 'instinto-protetor',
    name: 'Instinto Protetor',
    description: 'Reativa. Quando o dono for atacado, o cão pode usar sua reação para impor desvantagem no ataque.',
    path: 'escudo-fiel',
    level: 3,
  },
  // Nível 3 - Olhar Fantasma
  {
    id: 'instinto-espiritual',
    name: 'Instinto Espiritual Aprimorado',
    description: 'Passiva. Detecta espíritos e mortos-vivos a até 9m. 1/descanso curto, pode uivar, concedendo vantagem em Percepção e Religião ao grupo por 1 minuto.',
    path: 'olhar-fantasma',
    level: 3,
  },
  // Nível 5 - Presa Firme
  {
    id: 'investida-predatoria',
    name: 'Investida Predatória',
    description: 'Ativa. 1/descanso curto. O cão corre até 6m em linha reta e faz um ataque de mordida. Se acertar, causa +1d8 de dano e o alvo deve passar em um teste de Força (CD 13) ou cair no chão.',
    path: 'presa-firme',
    level: 5,
  },
  // Nível 5 - Escudo Fiel
  {
    id: 'posicao-defensiva',
    name: 'Posição Defensiva',
    description: 'Ativa. Ação bônus, 1/descanso curto. O cão assume postura protetora por 1 minuto. Enquanto estiver a até 3m do dono, ambos ganham +1 CA e vantagem contra medo.',
    path: 'escudo-fiel',
    level: 5,
  },
  // Nível 5 - Olhar Fantasma
  {
    id: 'uivo-espiritual',
    name: 'Uivo Espiritual',
    description: 'Ativa. 1/descanso curto. O cão emite um uivo que revela criaturas invisíveis ou etéreas a até 9m, visíveis por 1 rodada. O grupo ganha vantagem em Percepção até o final do próximo turno.',
    path: 'olhar-fantasma',
    level: 5,
  },
  // Nível 7 - Presa Firme
  {
    id: 'presa-incansavel',
    name: 'Presa Incansável',
    description: 'Passiva. Quando causar dano em um inimigo, o cão pode usar a reação para mover-se até metade do deslocamento em direção ao mesmo alvo.',
    path: 'presa-firme',
    level: 7,
  },
  // Nível 7 - Escudo Fiel
  {
    id: 'interpor-se',
    name: 'Interpor-se',
    description: 'Reativa. Quando o dono sofrer dano, o cão pode usar sua reação para absorver metade do dano (1/descanso curto).',
    path: 'escudo-fiel',
    level: 7,
  },
  // Nível 7 - Olhar Fantasma
  {
    id: 'silencio-horror',
    name: 'Silêncio Antes do Horror',
    description: 'Passiva. Uma vez por descanso curto, o cão sente presenças hostis antes que ataquem, concedendo vantagem em Iniciativa a todo o grupo.',
    path: 'olhar-fantasma',
    level: 7,
  },
  // Nível 10 - Presa Firme
  {
    id: 'furia-leal',
    name: 'Fúria Leal',
    description: 'Ativa. 1/descanso longo. Quando o dono cair a 0 PV, o cão entra em fúria até o fim do combate: ganha vantagem em ataques e resistência a dano físico.',
    path: 'presa-firme',
    level: 10,
  },
  // Nível 10 - Escudo Fiel
  {
    id: 'ultimo-uivo',
    name: 'Último Uivo',
    description: 'Ativa. 1/descanso longo. Quando o dono cair a 0 PV, o cão se move até ele e o protege, concedendo cobertura total até ele ser estabilizado ou curado.',
    path: 'escudo-fiel',
    level: 10,
  },
  // Nível 10 - Olhar Fantasma
  {
    id: 'olhos-alem',
    name: 'Olhos do Além',
    description: 'Ativa. 1/descanso longo. O cão pode enxergar criaturas invisíveis e etéreas a até 6m por 1 minuto.',
    path: 'olhar-fantasma',
    level: 10,
  },
];

export const PATH_NAMES: Record<PathType, string> = {
  'presa-firme': '⚔️ Presa Firme',
  'escudo-fiel': '🛡️ Escudo Fiel',
  'olhar-fantasma': '🔍 Olhar Fantasma',
};

export const PATH_COLORS: Record<PathType, string> = {
  'presa-firme': 'border-red-700/50 bg-red-950/20',
  'escudo-fiel': 'border-blue-700/50 bg-blue-950/20',
  'olhar-fantasma': 'border-purple-700/50 bg-purple-950/20',
};

export function calculateModifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

export function calculateMaxHP(hpHistory: HPHistoryEntry[]): number {
  return hpHistory.reduce((sum, entry) => sum + entry.total, 0);
}

export function getInitialHPHistory(conModifier: number): HPHistoryEntry[] {
  // Level 1: max d6 (6) + CON modifier
  return [
    {
      level: 1,
      roll: 6,
      modifier: conModifier,
      total: 6 + conModifier,
    },
  ];
}

export function getDamageForLevel(level: number): string {
  if (level >= 9) return '2d6 + 2';
  if (level >= 5) return '1d8 + 2';
  return '1d6 + 2';
}

export const ATTRIBUTE_NAMES: Record<AttributeKey, string> = {
  strength: 'Força',
  dexterity: 'Destreza',
  constitution: 'Constituição',
  intelligence: 'Inteligência',
  wisdom: 'Sabedoria',
  charisma: 'Carisma',
};

export const ATTRIBUTE_ABBR: Record<AttributeKey, string> = {
  strength: 'FOR',
  dexterity: 'DES',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'SAB',
  charisma: 'CAR',
};
