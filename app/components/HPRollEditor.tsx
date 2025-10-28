import React from 'react';
import type { HPHistoryEntry } from '@/types/companion';

type HPRollEditorProps = {
  level: number;
  hpEntry: HPHistoryEntry | undefined;
  maxDice: number; // Maximum dice value (e.g., 6 for d6, 8 for d8)
  conModifier: number;
  onUpdate: (roll: number) => void;
  canEdit: boolean;
  themeColor?: 'amber' | 'red' | 'purple';
};

export default function HPRollEditor({
  level,
  hpEntry,
  maxDice,
  conModifier,
  onUpdate,
  canEdit,
  themeColor = 'amber'
}: HPRollEditorProps) {
  const themeClasses = {
    amber: {
      border: 'border-amber-700/50',
      bg: 'bg-amber-950/20',
      text: 'text-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700',
      buttonDisabled: 'bg-neutral-700 text-neutral-500',
    },
    red: {
      border: 'border-red-700/50',
      bg: 'bg-red-950/20',
      text: 'text-red-200',
      button: 'bg-red-600 hover:bg-red-700',
      buttonDisabled: 'bg-neutral-700 text-neutral-500',
    },
    purple: {
      border: 'border-purple-700/50',
      bg: 'bg-purple-950/20',
      text: 'text-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700',
      buttonDisabled: 'bg-neutral-700 text-neutral-500',
    },
  };

  const theme = themeClasses[themeColor];
  // If no entry or roll is 0, it's pending (no value)
  const isPending = !hpEntry || hpEntry.roll === 0;
  const currentRoll = hpEntry?.roll || 0;
  const totalHP = currentRoll + conModifier;
  // Locked if no entry exists
  const isLocked = !hpEntry;
  const isLevel1 = level === 1;

  return (
    <div className={`rounded-lg border-2 p-3 sm:p-4 shadow-md ${
      isLocked
        ? 'border-neutral-800 bg-neutral-950/50 opacity-50'
        : `${theme.border} ${theme.bg}`
    }`}>
      <h4 className={`mb-3 text-sm sm:text-base font-semibold flex items-center gap-2 ${theme.text}`}>
        {isLocked && <span className="text-base sm:text-lg">🔒</span>}
        <span>❤️ Dado de Vida</span>
      </h4>

      {!isLocked && (
        <div className="space-y-3">
          {isPending ? (
            <div className="text-center py-4">
              <p className="text-yellow-500 font-semibold mb-2">⚠️ Pendente</p>
              <p className="text-neutral-400 text-sm">
                {isLevel1
                  ? 'Você sempre ganha o máximo de PV no nível 1'
                  : 'Selecione o resultado da rolagem do dado'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">
                  {isLevel1 ? `Máximo do d${maxDice}:` : `Rolagem do d${maxDice}:`}
                </span>
                <span className="text-neutral-200 font-bold">{currentRoll}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-300 font-semibold">PV Ganhos:</span>
                <span className={`text-lg font-bold ${theme.text}`}>
                  +{totalHP}
                </span>
              </div>
            </>
          )}

          {!isPending && isLevel1 && (
            <p className="text-xs text-neutral-500 italic">
              No nível 1, você sempre ganha o máximo de PV possível.
            </p>
          )}

          {canEdit && (
            <div className="border-t border-neutral-700 pt-3">
              <p className="text-xs text-neutral-500 mb-2">
                {isLevel1
                  ? `Confirmar máximo (${maxDice}):`
                  : `Selecionar rolagem (1-${maxDice}):`}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {isLevel1 ? (
                  <button
                    onClick={() => onUpdate(maxDice)}
                    className={`px-3 py-2 rounded text-sm font-bold transition-colors ${
                      currentRoll === maxDice
                        ? `${theme.button} text-white`
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {maxDice}
                  </button>
                ) : (
                  Array.from({ length: maxDice }, (_, i) => i + 1).map((value) => (
                    <button
                      key={value}
                      onClick={() => onUpdate(value)}
                      className={`px-3 py-2 rounded text-sm font-bold transition-colors ${
                        value === currentRoll && !isPending
                          ? `${theme.button} text-white`
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
