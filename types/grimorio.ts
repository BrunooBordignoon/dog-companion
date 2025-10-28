export type GrimorioAbility = {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active';
  awakening: 1 | 2 | 3 | 6 | 9 | 11;
  usage?: string; // "1/descanso curto", "1/descanso longo", "uso livre"
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

export type SelectedGrimorioAbilities = {
  level3?: GrimorioAbility;
  level6?: GrimorioAbility;
  level9?: GrimorioAbility;
  level11?: GrimorioAbility;
};

export type GrimorioData = {
  characterName: string;
  level: number;
  selectedAbilities: SelectedGrimorioAbilities;
};

export const GRIMORIO_ABILITIES: GrimorioAbility[] = [
  // Nível 1 - Habilidade Base (automática)
  {
    id: 'crescimento-profano',
    name: 'Crescimento Profano',
    type: 'active',
    awakening: 1,
    usage: 'uso livre',
    actionType: 'action',
    range: '3 metros',
    duration: 'Instantâneo',
    description: 'O personagem pode tocar o solo e acelerar o crescimento de plantas naturais — ervas, raízes, grãos, flores ou palha — em um raio de até 3 metros. Pode ser usado para camuflagem, distrações, esconder objetos, criar pequenas barreiras ou manipular o ambiente. Não causa dano, mas mostra que o campo responde à sua vontade. Em áreas corrompidas, o crescimento parece "sofrer" e sussurra.',
  },

  // Nível 2 - Habilidade Base (automática)
  {
    id: 'lingua-corvos',
    name: 'Língua dos Corvos',
    type: 'passive',
    awakening: 2,
    actionType: 'none',
    limit: 'Até 3 corvos aliados ativos',
    description: 'O personagem pode falar com corvos e espantalhos animados. Eles compreendem ordens simples (vigiar, distrair, seguir) e podem relatar o que viram nas últimas 24 horas, em linguagem simbólica ("asas sobre o norte", "algo anda sob o solo"). Até 3 aliados corvídeos podem ser ativos simultaneamente.',
  },

  // Nível 3 - Primeira Colheita (escolher 1)
  {
    id: 'ouvido-raizes',
    name: 'Ouvido das Raízes',
    type: 'active',
    awakening: 3,
    usage: '1/descanso curto',
    actionType: 'action',
    range: '50 metros',
    duration: 'Instantâneo',
    description: 'O personagem ajoelha-se e toca o solo, ouvindo o "coração da terra". Pode sentir a quantidade aproximada de criaturas vivas (animais, humanos ou espíritos) num raio de até 50 metros, sem distinguir intenções. Não atravessa pedra ou metal espesso.',
  },
  {
    id: 'vinhas-famintas',
    name: 'Vinhas Famintas',
    type: 'active',
    awakening: 3,
    usage: '1/descanso curto',
    actionType: 'action',
    range: '6 metros',
    duration: 'Até o fim do próximo turno',
    savingThrow: 'Força CD 13',
    condition: 'Preso até o fim do próximo turno',
    description: 'O personagem faz o chão germinar violentamente. Plantas e raízes emergem e se enrolam em inimigos num raio de 6 metros. Criaturas afetadas devem fazer um teste de Força (CD 13) ou ficam presas até o fim do próximo turno.',
  },
  {
    id: 'solo-enredado',
    name: 'Solo Enredado',
    type: 'active',
    awakening: 3,
    usage: '1/descanso curto',
    actionType: 'action',
    range: '4,5 metros',
    duration: 'Até o fim do combate',
    damage: '1d4 por rodada',
    damageType: 'Cortante',
    condition: 'Terreno difícil',
    description: 'O personagem faz brotar vegetação viva e densa em uma área de 4,5 metros. Essa área se torna terreno difícil — criaturas que se moverem por ela sofrem 1d4 de dano cortante por rodada.',
  },

  // Nível 6 - Segunda Colheita (escolher 1)
  {
    id: 'brotar-sangue',
    name: 'Brotação de Sangue',
    type: 'passive',
    awakening: 6,
    actionType: 'none',
    range: '9 metros',
    damage: '+1 no próximo ataque',
    limit: '1x por rodada',
    description: 'Sempre que uma criatura morrer a até 9 metros, raízes vermelhas brotam do solo. O personagem ganha +1 de dano em seu próximo ataque até o fim do turno seguinte. Máximo de 1 vez por rodada.',
  },
  {
    id: 'canticos-safra',
    name: 'Cânticos da Safra',
    type: 'active',
    awakening: 6,
    usage: '1/descanso curto',
    actionType: 'action',
    range: '6 metros',
    duration: 'Até o fim do próximo turno',
    condition: 'Vantagem contra medo e encantamento',
    description: 'O personagem recita versos do Grimório. Até o final do turno seguinte, ele e aliados a até 6 metros têm vantagem em testes contra medo e encantamento.',
  },
  {
    id: 'colheita-amarga',
    name: 'Colheita Amarga',
    type: 'active',
    awakening: 6,
    usage: '1/descanso curto',
    actionType: 'action',
    range: '3 metros',
    duration: 'Até o fim do próximo turno',
    damage: '2d6',
    damageType: 'Cortante',
    savingThrow: 'Destreza CD 14',
    condition: 'Preso até o fim do próximo turno',
    description: 'O personagem invoca raízes cortantes sob o solo. Criaturas hostis num raio de 3 metros fazem um teste de Destreza (CD 14). Em falha, sofrem 2d6 de dano cortante e ficam presas até o fim do próximo turno.',
  },

  // Nível 9 - Terceira Colheita (escolher 1)
  {
    id: 'corpo-palha',
    name: 'Corpo de Palha',
    type: 'passive',
    awakening: 9,
    actionType: 'none',
    condition: 'Resistência a cortante/perfurante não mágico; Vulnerabilidade a fogo',
    description: 'O corpo do personagem se torna parcialmente ressecado e rígido. Recebe resistência a dano cortante e perfurante não mágico, mas vulnerabilidade a fogo.',
  },
  {
    id: 'raizes-vigiam',
    name: 'Raízes Sentinelas',
    type: 'passive',
    awakening: 9,
    actionType: 'none',
    range: '3 metros',
    condition: 'Desperta ao detectar criatura hostil',
    description: 'Enquanto o personagem dorme ou está inconsciente, o Grimório cria raízes sentinelas ao redor. Qualquer criatura que se aproxime a 3 metros é detectada — o personagem acorda instantaneamente.',
  },
  {
    id: 'sopro-estacao',
    name: 'Sopro da Última Estação',
    type: 'active',
    awakening: 9,
    usage: '1/descanso longo',
    actionType: 'action',
    range: 'Cone de 4,5 metros',
    duration: 'Instantâneo',
    damage: '3d6',
    damageType: 'Necrótico',
    savingThrow: 'Constituição CD 15',
    condition: 'Cego até o fim do próximo turno',
    description: 'O personagem exala uma névoa de grãos secos e sangue. Inimigos num cone de 4,5 metros fazem um teste de Constituição (CD 15). Em falha, sofrem 3d6 de dano necrótico e ficam cegos até o fim do próximo turno.',
  },

  // Nível 11 - Colheita Final (escolher 1)
  {
    id: 'ceifa-lua',
    name: 'Ceifa da Lua Vermelha',
    type: 'active',
    awakening: 11,
    usage: '1/descanso longo',
    actionType: 'action',
    range: '6 metros',
    duration: 'Instantâneo',
    damage: '4d6',
    damageType: 'Necrótico',
    savingThrow: 'Constituição CD 16',
    condition: 'Paralisado por 1 turno',
    cost: '1 nível de exaustão',
    description: 'O personagem invoca o Espírito da Colheita. O solo em um raio de 6 metros se abre com grãos e ossos em chamas. Inimigos fazem teste de Constituição (CD 16) ou sofrem 4d6 de dano necrótico e ficam paralisados por 1 turno. Após o uso, o personagem sofre 1 nível de exaustão.',
  },
  {
    id: 'semente-eterna',
    name: 'A Semente Eterna',
    type: 'passive',
    awakening: 11,
    actionType: 'none',
    duration: '1 minuto para renascer',
    condition: 'Renasce com metade dos PV máximos',
    limit: '1x por semana',
    description: 'Quando o personagem morre, seu corpo se dissolve em grãos e palha. Após 1 minuto, ele renasce com metade dos PV máximos. Esse efeito só pode ocorrer uma vez por semana.',
  },
  {
    id: 'chamado-terra',
    name: 'O Chamado da Terra Faminta',
    type: 'active',
    awakening: 11,
    usage: '1/descanso longo',
    actionType: 'action',
    range: '6 metros',
    duration: 'Até o fim do próximo turno',
    damage: '3d6 (metade em sucesso)',
    damageType: 'Ácido',
    savingThrow: 'Força CD 16',
    condition: 'Restrito até o fim do próximo turno',
    limit: 'Até 2 inimigos Médios ou menores',
    description: 'O personagem finca o Grimório no solo e convoca raízes colossais. Até 2 inimigos Médios ou menores a até 6 metros devem fazer teste de Força (CD 16). Em falha, são arrastados para o subsolo, sofrem 3d6 de dano ácido e ficam restritos até o fim do próximo turno. Em sucesso, sofrem metade do dano e não ficam restritos.',
  },
];

// Helpers
export const AWAKENING_NAMES: Record<number, string> = {
  1: 'Primeira Semente',
  2: 'Raízes Profundas',
  3: 'Primeira Colheita',
  6: 'Segunda Colheita',
  9: 'Terceira Colheita',
  11: 'A Colheita Final',
};

export const ABILITY_TYPE_NAMES: Record<'passive' | 'active', string> = {
  passive: 'Passiva',
  active: 'Ativa',
};

export const ABILITY_TYPE_COLORS: Record<'passive' | 'active', string> = {
  passive: 'border-purple-700/50 bg-purple-950/20',
  active: 'border-green-700/50 bg-green-950/20',
};

export const ACTION_TYPE_NAMES: Record<string, string> = {
  action: 'Ação',
  bonus: 'Ação Bônus',
  reaction: 'Reação',
  free: 'Ação Livre',
  none: 'Automática',
};

export function getAwakeningLevel(level: number): number {
  if (level >= 11) return 11;
  if (level >= 9) return 9;
  if (level >= 6) return 6;
  if (level >= 3) return 3;
  if (level >= 2) return 2;
  return 1;
}
