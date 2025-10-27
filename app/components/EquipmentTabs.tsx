'use client';

import { Equipment, EQUIPMENT_COLORS } from '@/types/equipment';

type EquipmentTabsProps = {
  equipments: Equipment[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function EquipmentTabs({ equipments, selectedId, onSelect }: EquipmentTabsProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-4 sm:gap-6 min-w-max pb-2">
        {equipments.map((equipment) => {
          const isSelected = equipment.id === selectedId;
          const colors = EQUIPMENT_COLORS[equipment.color];
          const isDisabled = !equipment.enabled;

          return (
            <button
              key={equipment.id}
              onClick={() => equipment.enabled && onSelect(equipment.id)}
              disabled={isDisabled}
              className={`
                group relative flex h-[120px] w-[120px] flex-col items-center justify-center gap-2 rounded-lg border-2 transition-all duration-200
                ${
                  isDisabled
                    ? 'cursor-not-allowed border-dashed border-neutral-700 bg-neutral-900 opacity-40'
                    : isSelected
                      ? `${colors.borderSelected} ${colors.bgSelected} shadow-lg ${colors.shadow} cursor-default`
                      : `${colors.border} ${colors.bg} opacity-70 hover:opacity-100 ${colors.hover} cursor-pointer`
                }
              `}
              title={equipment.description || equipment.name}
            >
              {/* Ícone */}
              <div
                className={`text-${isSelected ? '5xl' : '4xl'} transition-all ${
                  isDisabled ? 'opacity-30' : ''
                }`}
              >
                {equipment.icon}
              </div>

              {/* Nome */}
              <div
                className={`text-sm font-semibold ${isSelected ? 'text-base' : ''} ${
                  isDisabled ? 'text-neutral-600' : colors.text
                }`}
              >
                {isDisabled && equipment.id !== 'cao' && equipment.id !== 'espada' ? 'Em Breve' : equipment.name}
              </div>

              {/* Indicador de seleção */}
              {isSelected && !isDisabled && (
                <div className="absolute -bottom-1 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-current opacity-80" />
              )}

              {/* Brilho de hover para itens não-selecionados */}
              {!isSelected && !isDisabled && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/0 via-white/0 to-white/0 transition-opacity group-hover:from-white/5 group-hover:via-white/0 group-hover:to-white/5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
