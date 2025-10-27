export type EquipmentColor = 'red' | 'blue' | 'amber' | 'purple' | 'green';

export type Equipment = {
  id: string;
  name: string;
  icon: string;
  color: EquipmentColor;
  enabled: boolean;
  description?: string;
};

export const EQUIPMENT_COLORS: Record<
  EquipmentColor,
  {
    border: string;
    borderSelected: string;
    bg: string;
    bgSelected: string;
    text: string;
    hover: string;
    shadow: string;
  }
> = {
  amber: {
    border: 'border-amber-700/40',
    borderSelected: 'border-amber-600',
    bg: 'bg-gradient-to-br from-amber-900/40 to-amber-950/40',
    bgSelected: 'bg-gradient-to-br from-amber-900/70 to-amber-950/60',
    text: 'text-amber-200',
    hover: 'hover:from-amber-900/60 hover:to-amber-950/50',
    shadow: 'shadow-amber-600/30',
  },
  red: {
    border: 'border-red-700/40',
    borderSelected: 'border-red-600',
    bg: 'bg-gradient-to-br from-red-900/40 to-red-950/40',
    bgSelected: 'bg-gradient-to-br from-red-900/70 to-red-950/60',
    text: 'text-red-200',
    hover: 'hover:from-red-900/60 hover:to-red-950/50',
    shadow: 'shadow-red-600/30',
  },
  blue: {
    border: 'border-blue-700/40',
    borderSelected: 'border-blue-600',
    bg: 'bg-gradient-to-br from-blue-900/40 to-blue-950/40',
    bgSelected: 'bg-gradient-to-br from-blue-900/70 to-blue-950/60',
    text: 'text-blue-200',
    hover: 'hover:from-blue-900/60 hover:to-blue-950/50',
    shadow: 'shadow-blue-600/30',
  },
  purple: {
    border: 'border-purple-700/40',
    borderSelected: 'border-purple-600',
    bg: 'bg-gradient-to-br from-purple-900/40 to-purple-950/40',
    bgSelected: 'bg-gradient-to-br from-purple-900/70 to-purple-950/60',
    text: 'text-purple-200',
    hover: 'hover:from-purple-900/60 hover:to-purple-950/50',
    shadow: 'shadow-purple-600/30',
  },
  green: {
    border: 'border-green-700/40',
    borderSelected: 'border-green-600',
    bg: 'bg-gradient-to-br from-green-900/40 to-green-950/40',
    bgSelected: 'bg-gradient-to-br from-green-900/70 to-green-950/60',
    text: 'text-green-200',
    hover: 'hover:from-green-900/60 hover:to-green-950/50',
    shadow: 'shadow-green-600/30',
  },
};

// Configuração de equipamentos por personagem
export const DETETIVE_EQUIPMENTS: Equipment[] = [
  {
    id: 'cao',
    name: 'Cão',
    icon: '🐕',
    color: 'amber',
    enabled: true,
    description: 'Companheiro Canino',
  },
  {
    id: 'item2',
    name: 'Item 2',
    icon: '❓',
    color: 'blue',
    enabled: false,
  },
  {
    id: 'item3',
    name: 'Item 3',
    icon: '❓',
    color: 'purple',
    enabled: false,
  },
];

export const SOLDADO_EQUIPMENTS: Equipment[] = [
  {
    id: 'espada',
    name: 'Espada',
    icon: '⚔️',
    color: 'red',
    enabled: true,
    description: 'Ceifadora dos Sussurros',
  },
  {
    id: 'item2',
    name: 'Item 2',
    icon: '❓',
    color: 'blue',
    enabled: false,
  },
  {
    id: 'item3',
    name: 'Item 3',
    icon: '❓',
    color: 'green',
    enabled: false,
  },
];
