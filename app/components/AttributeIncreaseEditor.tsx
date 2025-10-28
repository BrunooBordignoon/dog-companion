import React from 'react';
import type { AttributeKey, AttributeIncrease } from '@/types/companion';
import { ATTRIBUTE_NAMES, ATTRIBUTE_ABBR } from '@/types/companion';

type AttributeIncreaseEditorProps = {
  level: number;
  attributeIncrease: AttributeIncrease | undefined;
  onUpdate: (attributes: [AttributeKey, AttributeKey]) => void;
  canEdit: boolean;
  themeColor?: 'amber' | 'red' | 'purple';
};

const ALL_ATTRIBUTES: AttributeKey[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

export default function AttributeIncreaseEditor({
  level,
  attributeIncrease,
  onUpdate,
  canEdit,
  themeColor = 'amber'
}: AttributeIncreaseEditorProps) {
  const themeClasses = {
    amber: {
      border: 'border-amber-700/50',
      bg: 'bg-amber-950/20',
      text: 'text-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700',
      buttonSelected: 'bg-amber-600 text-white ring-2 ring-amber-400',
      buttonUnselected: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700',
    },
    red: {
      border: 'border-red-700/50',
      bg: 'bg-red-950/20',
      text: 'text-red-200',
      button: 'bg-red-600 hover:bg-red-700',
      buttonSelected: 'bg-red-600 text-white ring-2 ring-red-400',
      buttonUnselected: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700',
    },
    purple: {
      border: 'border-purple-700/50',
      bg: 'bg-purple-950/20',
      text: 'text-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700',
      buttonSelected: 'bg-purple-600 text-white ring-2 ring-purple-400',
      buttonUnselected: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700',
    },
  };

  const theme = themeClasses[themeColor];
  const [firstAttribute, secondAttribute] = attributeIncrease?.attributes || [undefined, undefined];

  const handleAttributeClick = (attr: AttributeKey) => {
    if (!canEdit) return;

    if (!firstAttribute) {
      // Select first attribute
      onUpdate([attr, attr]); // Temporarily set both to same
    } else if (!secondAttribute || firstAttribute === secondAttribute) {
      // Select second attribute
      onUpdate([firstAttribute, attr]);
    } else {
      // Both selected, replace first with clicked and reset second
      onUpdate([attr, attr]);
    }
  };

  const getAttributeCount = (attr: AttributeKey): number => {
    if (!attributeIncrease) return 0;
    const [first, second] = attributeIncrease.attributes;
    let count = 0;
    if (first === attr) count++;
    if (second === attr && second !== undefined) count++;
    return count;
  };

  const isAttributeSelected = (attr: AttributeKey): boolean => {
    return getAttributeCount(attr) > 0;
  };

  const selectedCount = (firstAttribute ? 1 : 0) + (secondAttribute && secondAttribute !== firstAttribute ? 1 : 0);
  const isLocked = !attributeIncrease;
  const showLockedStyle = isLocked && !canEdit;

  return (
    <div className={`rounded-lg border-2 p-3 sm:p-4 shadow-md ${
      showLockedStyle
        ? 'border-neutral-800 bg-neutral-950/50 opacity-50'
        : `${theme.border} ${theme.bg}`
    }`}>
      <h4 className={`mb-3 text-sm sm:text-base font-semibold flex items-center gap-2 ${theme.text}`}>
        {showLockedStyle && <span className="text-base sm:text-lg">🔒</span>}
        <span>⬆️ Aumento de Atributo</span>
      </h4>

      <div className="space-y-3">
        <p className="text-sm text-neutral-400">
          Escolha 2 atributos para aumentar (pode escolher o mesmo 2x):
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_ATTRIBUTES.map((attr) => {
            const count = getAttributeCount(attr);
            const isSelected = isAttributeSelected(attr);

            return (
              <button
                key={attr}
                onClick={() => handleAttributeClick(attr)}
                disabled={!canEdit}
                className={`px-3 py-2 rounded text-sm font-bold transition-all ${
                  isSelected
                    ? theme.buttonSelected
                    : theme.buttonUnselected
                } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{ATTRIBUTE_ABBR[attr]}</span>
                  {count > 0 && (
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                      +{count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-neutral-500 mt-2">
          {selectedCount === 0 && 'Selecione o primeiro atributo'}
          {selectedCount === 1 && 'Selecione o segundo atributo'}
          {selectedCount === 2 && '✓ Dois atributos selecionados'}
        </div>

        {attributeIncrease && (
          <div className={`border-t border-neutral-700 pt-3 text-sm ${theme.text}`}>
            <div className="font-semibold mb-1">Aumentos aplicados:</div>
            <div className="text-neutral-300">
              {ATTRIBUTE_NAMES[firstAttribute!]} +1
              {secondAttribute && secondAttribute !== firstAttribute && (
                <>, {ATTRIBUTE_NAMES[secondAttribute]} +1</>
              )}
              {secondAttribute && secondAttribute === firstAttribute && (
                <> (+1 = +2 total)</>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
