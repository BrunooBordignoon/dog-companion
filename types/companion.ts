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

export type PathType = 'presa-firme' | 'escudo-fiel' | 'eco-espiritual';

export type Ability = {
  id: string;
  name: string;
  description: string;
  path: PathType;
  level: 3 | 5 | 7 | 10;
  type: 'passive' | 'active' | 'reaction';
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
  skills: import('./skills').Skills; // Skills with proficiency/expertise
  expertiseSkill?: import('./skills').SkillKey; // Skill com expertise (nível 6)
};

export const ABILITIES: Ability[] = [
  // Nível 3 - Presa Firme
  {
    id: 'mordida-silenciosa',
    name: 'Mordida Silenciosa',
    description: 'Quando o cão realiza um ataque de mordida a partir de uma emboscada (furtivo, invisível ou antes de ser detectado), ele tem vantagem na jogada de ataque e causa +1d6 de dano adicional. O cão se move em silêncio mortal, sua presença oculta até o último instante. Quando ataca, é rápido e certeiro — a vítima raramente ouve o rosnado antes da mordida perfurar a carne.',
    path: 'presa-firme',
    level: 3,
    type: 'passive',
    actionType: 'none',
    range: 'Corpo a corpo',
    duration: 'Permanente',
    damage: '+1d6 adicional',
    damageType: 'Perfurante',
    condition: 'Vantagem no ataque',
    limit: '1x por combate',
  },
  // Nível 3 - Escudo Fiel
  {
    id: 'instinto-protetor',
    name: 'Instinto Protetor',
    description: 'Quando o dono for atacado, o cão pode usar reação para impor desvantagem no ataque.',
    path: 'escudo-fiel',
    level: 3,
    type: 'reaction',
    actionType: 'reaction',
    range: 'Visão',
    duration: 'Instantâneo',
    limit: '1x por rodada',
  },
  // Nível 3 - Eco Espiritual
  {
    id: 'lamento-dos-ecos',
    name: 'Lamento dos Ecos',
    description: 'Quando o cão atingir um espírito, morto-vivo ou aparição, o alvo perde resistência a dano não mágico até o início do próximo turno do dono. O vínculo espiritual entre o cão e seu dono permite que apenas o dono possa acertar o espírito enfraquecido, causando +1 de dano adicional no primeiro ataque. O lamento ecoa pela conexão que os une, tornando o invisível vulnerável.',
    path: 'eco-espiritual',
    level: 3,
    type: 'passive',
    actionType: 'none',
    range: 'Corpo a corpo',
    duration: 'Até o início do próximo turno do dono',
    damage: '+1 dano adicional para o dono',
    condition: 'Alvo perde resistência a dano não mágico, apenas o dono pode atacar',
  },
  // Nível 5 - Presa Firme
  {
    id: 'investida-predatoria',
    name: 'Investida Predatória',
    description: 'O cão move-se até 6m em linha reta e faz uma mordida. Se acertar, causa +1d6 de dano adicional. O alvo deve fazer teste de Força (CD 13) ou cair derrubado.',
    path: 'presa-firme',
    level: 5,
    type: 'active',
    actionType: 'action',
    range: '6 metros em linha reta',
    duration: 'Instantâneo',
    damage: 'Mordida + 1d6',
    damageType: 'Perfurante',
    savingThrow: 'FOR CD 13',
    condition: 'Derrubado (em falha)',
    limit: '1/descanso curto',
  },
  // Nível 5 - Escudo Fiel
  {
    id: 'posicao-defensiva',
    name: 'Posição Defensiva',
    description: 'Usa ação bônus para assumir postura protetora por 1 minuto. Enquanto a até 3m do dono, ambos ganham +1 CA e vantagem em testes contra medo.',
    path: 'escudo-fiel',
    level: 5,
    type: 'active',
    actionType: 'bonus',
    range: '3 metros',
    duration: '1 minuto',
    condition: '+1 CA e vantagem contra medo',
    limit: '1/descanso curto',
  },
  // Nível 5 - Eco Espiritual
  {
    id: 'uivo-ponte-velha',
    name: 'Uivo da Ponte Velha',
    description: 'Espíritos e mortos-vivos num raio de 6m fazem teste de Sabedoria (CD 14). Em falha: sofrem 1d6 de dano radiante e ficam revelados até o fim do próximo turno. Em sucesso: apenas revelados. Aliados a até 6m ganham vantagem em testes contra medo até o fim do turno.',
    path: 'eco-espiritual',
    level: 5,
    type: 'active',
    actionType: 'action',
    range: '6 metros',
    duration: 'Até o fim do próximo turno',
    damage: '1d6',
    damageType: 'Radiante',
    savingThrow: 'SAB CD 14',
    condition: 'Revelados (todos), dano radiante (em falha)',
    limit: '1/descanso curto',
  },
  // Nível 7 - Presa Firme
  {
    id: 'presa-incansavel',
    name: 'Presa Incansável',
    description: 'Quando o dono causar dano a uma criatura, o cão pode usar sua reação para mover-se até metade do deslocamento em direção ao mesmo alvo. Este movimento não provoca ataques de oportunidade.',
    path: 'presa-firme',
    level: 7,
    type: 'reaction',
    actionType: 'reaction',
    range: 'Metade do deslocamento do cão',
    duration: 'Instantâneo',
    limit: '1x por rodada',
  },
  // Nível 7 - Escudo Fiel
  {
    id: 'interpor-se',
    name: 'Interpor-se',
    description: 'Quando o dono sofrer dano, o cão pode usar reação para absorver metade do dano.',
    path: 'escudo-fiel',
    level: 7,
    type: 'reaction',
    actionType: 'reaction',
    range: 'Visão',
    duration: 'Instantâneo',
    condition: 'Cão absorve metade do dano',
    limit: '1/descanso curto',
  },
  // Nível 7 - Eco Espiritual
  {
    id: 'vozes-alem',
    name: 'Vozes do Além',
    description: 'O cão reage instintivamente perto de locais ou objetos amaldiçoados, assombrados ou marcados por morte recente. Durante essas reações, o dono tem vantagem em testes de Religião e Intuição. 1x por descanso curto, o cão pode tentar repelir ou acalmar um espírito menor (CD 13 de Carisma do cão).',
    path: 'eco-espiritual',
    level: 7,
    type: 'passive',
    actionType: 'none',
    range: 'Proximidade (DM determina)',
    duration: 'Permanente',
    savingThrow: 'CAR CD 13 (para repelir espírito)',
    condition: 'Vantagem em Religião e Intuição',
    limit: '1/descanso curto (repelir espírito)',
  },
  // Nível 10 - Presa Firme
  {
    id: 'furia-leal',
    name: 'Fúria Leal',
    description: 'Quando o dono cair a 0 PV, o cão entra em fúria até o fim do combate. Ganha vantagem em ataques. Ganha resistência a dano cortante, perfurante e contundente. Perde controle tático e ataca inimigos próximos até o fim do combate.',
    path: 'presa-firme',
    level: 10,
    type: 'active',
    actionType: 'free',
    range: 'Próprio',
    duration: 'Até o fim do combate',
    condition: 'Vantagem em ataques, resistência a dano físico, perde controle tático',
    limit: '1/descanso longo',
  },
  // Nível 10 - Escudo Fiel
  {
    id: 'ultimo-uivo',
    name: 'Último Uivo',
    description: 'Quando o dono cair a 0 PV, o cão se move até ele e o protege. O dono ganha cobertura total. Ataques contra o dono têm desvantagem enquanto o cão estiver consciente. O cão não pode atacar durante esse período.',
    path: 'escudo-fiel',
    level: 10,
    type: 'active',
    actionType: 'free',
    range: 'Deslocamento do cão',
    duration: 'Até o dono ser estabilizado ou curado',
    condition: 'Cobertura total, ataques têm desvantagem, cão não pode atacar',
    limit: '1/descanso longo',
  },
  // Nível 10 - Eco Espiritual
  {
    id: 'guardiao-almas',
    name: 'Guardião das Almas Perdidas',
    description: 'Quando o dono cair a 0 PV, o cão liberta seu espírito por 1 minuto. O cão torna-se etéreo e protege a alma do dono. O dono fica imune a possessão, drenagem de vida e captura espiritual. Ataques espirituais e mágicos contra o dono têm desvantagem. Após o efeito, o cão sofre 1 nível de exaustão.',
    path: 'eco-espiritual',
    level: 10,
    type: 'active',
    actionType: 'free',
    range: 'Próprio',
    duration: '1 minuto',
    condition: 'Cão etéreo, dono imune a possessão/drenagem/captura, ataques mágicos têm desvantagem',
    cost: '1 nível de exaustão (após efeito)',
    limit: '1/descanso longo',
  },
];

export const PATH_NAMES: Record<PathType, string> = {
  'presa-firme': '⚔️ Presa Firme',
  'escudo-fiel': '🛡️ Escudo Fiel',
  'eco-espiritual': '👻 Eco Espiritual',
};

export const PATH_COLORS: Record<PathType, string> = {
  'presa-firme': 'border-red-700/50 bg-red-950/20',
  'escudo-fiel': 'border-blue-700/50 bg-blue-950/20',
  'eco-espiritual': 'border-purple-700/50 bg-purple-950/20',
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

// Base companion abilities (levels 1 and 2)
export type BaseCompanionAbility = {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active' | 'reaction';
  level: 1 | 2;
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

export const BASE_COMPANION_ABILITIES: BaseCompanionAbility[] = [
  {
    id: 'cao-investigador',
    name: 'Cão Investigador',
    description: 'Vantagem em testes de Investigação relacionados a cheiro, som e rastros. Sente presenças espirituais e mortos-vivos (sem direção exata). Ataques do cão contam como mágicos (podem ferir espíritos, aparições e mortos-vivos incorpóreos). Proficiência em Percepção, Investigação e Furtividade.',
    type: 'passive',
    level: 1,
    actionType: 'none',
    range: '9 metros (Percepção/Investigação), 6 metros (espíritos)',
    duration: 'Permanente',
  },
  {
    id: 'comando-delegado',
    name: 'Comando Delegado',
    description: 'O dono do cão pode deixá-lo sob o comando de outro jogador ou NPC até que ordene que pare. A palavra do dono permanece absoluta — ele pode retomar o controle a qualquer momento com uma ação livre.',
    type: 'passive',
    level: 1,
    actionType: 'free',
    duration: 'Até o dono ordenar o retorno',
    range: 'Próprio',
  },
  {
    id: 'laco-inquebravel',
    name: 'Laço Inquebrável',
    description: 'O dono pode rerrolar um teste de Percepção ou Investigação que tenha falhado, guiado pela conexão profunda com seu companheiro canino. Deve aceitar o novo resultado.',
    type: 'active',
    level: 2,
    actionType: 'free',
    duration: 'Instantâneo',
    limit: '1/descanso curto',
  },
];

// Helper function to map path to theme color
export function getPathThemeColor(path: PathType): 'red' | 'blue' | 'purple' {
  const colorMap: Record<PathType, 'red' | 'blue' | 'purple'> = {
    'presa-firme': 'red',
    'escudo-fiel': 'blue',
    'eco-espiritual': 'purple',
  };
  return colorMap[path];
}
