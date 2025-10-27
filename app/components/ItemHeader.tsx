'use client';

import { useState } from 'react';

interface ItemHeaderProps {
  itemName: string;
  itemType: string;
  itemLevel: number;
  itemLevelDescription?: string;
  itemSubtitle?: string;
  itemAlignment?: string;
  itemDescription?: string;
  themeColor: 'amber' | 'red';
  icon: React.ReactNode;
  onNameChange?: (name: string) => void;
  allowNameEdit?: boolean;
  maxLevel?: number;
  readOnly?: boolean;
}

export default function ItemHeader({
  itemName,
  itemType,
  itemLevel,
  itemLevelDescription,
  itemSubtitle,
  itemAlignment,
  itemDescription,
  themeColor,
  icon,
  onNameChange,
  allowNameEdit = false,
  maxLevel,
  readOnly = false,
}: ItemHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(itemName);

  // Color classes based on theme
  const colors = {
    amber: {
      border: 'border-amber-700/50',
      bgGradient: 'from-amber-950/30',
      iconBorder: 'border-amber-600/50',
      iconBg: 'bg-amber-900/30',
      iconColor: 'text-amber-400',
      typeColor: 'text-amber-600',
      nameColor: 'text-amber-100',
      nameHover: 'hover:text-amber-200',
      subtitleBg: 'bg-neutral-800/50',
      subtitleText: 'text-amber-300',
      inputBorder: 'border-amber-700/50',
      btnBg: 'bg-amber-800',
      btnHover: 'hover:bg-amber-700',
      editIconHover: 'hover:text-amber-200',
      dividerBorder: 'border-amber-700/30',
    },
    red: {
      border: 'border-red-700/50',
      bgGradient: 'from-red-950/30',
      iconBorder: 'border-red-600/50',
      iconBg: 'bg-red-900/30',
      iconColor: 'text-red-400',
      typeColor: 'text-red-600',
      nameColor: 'text-red-100',
      nameHover: 'hover:text-red-200',
      subtitleBg: 'bg-neutral-800/50',
      subtitleText: 'text-red-300',
      inputBorder: 'border-red-700/50',
      btnBg: 'bg-red-800',
      btnHover: 'hover:bg-red-700',
      editIconHover: 'hover:text-red-200',
      dividerBorder: 'border-red-700/30',
    },
  };

  const theme = colors[themeColor];

  const saveName = () => {
    if (onNameChange) {
      onNameChange(tempName);
    }
    setIsEditingName(false);
  };

  return (
    <div className={`mb-6 rounded-lg border-2 ${theme.border} bg-gradient-to-b ${theme.bgGradient} to-neutral-900/50 p-4 sm:p-6 shadow-xl`}>
      <div className={`mb-3 flex flex-col gap-3 border-b ${theme.dividerBorder} pb-3 sm:flex-row sm:items-center`}>
        {/* Top Row: Icon + Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 ${theme.iconBorder} ${theme.iconBg}`}>
            {icon}
          </div>

          {/* Name Section */}
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-semibold uppercase tracking-wider ${theme.typeColor}`}>
              {itemType}
            </div>
            {allowNameEdit && !readOnly ? (
              isEditingName ? (
                <div className="mt-1 flex flex-col gap-2 sm:flex-row min-w-0">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className={`flex-1 min-w-0 rounded border ${theme.inputBorder} bg-neutral-900 px-2 py-1 sm:px-3 sm:py-2 text-base sm:text-xl font-bold ${theme.nameColor}`}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  />
                  <button
                    onClick={saveName}
                    className={`flex-shrink-0 rounded ${theme.btnBg} px-4 py-2 text-sm font-semibold ${theme.btnHover} whitespace-nowrap`}
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <h1
                    onClick={() => setIsEditingName(true)}
                    className={`cursor-pointer font-serif text-lg sm:text-2xl font-bold ${theme.nameColor} ${theme.nameHover} truncate`}
                  >
                    {itemName}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className={`text-neutral-400 ${theme.editIconHover} flex-shrink-0`}
                    title="Editar nome"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              )
            ) : (
              <div className={`mt-1 font-serif text-lg sm:text-2xl font-bold ${theme.nameColor} truncate`}>
                {itemName}
              </div>
            )}
          </div>
        </div>

        {/* Level Display */}
        <div className="flex flex-col items-start sm:items-center justify-center sm:flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg sm:text-2xl font-bold text-neutral-100 whitespace-nowrap">Nível {itemLevel}</span>
            {maxLevel && itemLevel >= maxLevel && (
              <span className="text-sm sm:text-lg font-semibold text-green-400 whitespace-nowrap">⭐ MAX</span>
            )}
          </div>
          {itemLevelDescription && (
            <div className="text-xs text-neutral-400 whitespace-nowrap">{itemLevelDescription}</div>
          )}
        </div>
      </div>

      {/* Bottom Info Row */}
      {(itemSubtitle || itemAlignment || itemDescription) && (
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {itemSubtitle && (
              <span className={`rounded ${theme.subtitleBg} px-2 py-1 font-semibold ${theme.subtitleText} whitespace-nowrap`}>
                {itemSubtitle}
              </span>
            )}
            {itemSubtitle && itemAlignment && <span className="text-neutral-400 hidden sm:inline">•</span>}
            {itemAlignment && <span className="text-neutral-300">{itemAlignment}</span>}
          </div>
          {itemDescription && (
            <div className="text-xs italic text-neutral-500">{itemDescription}</div>
          )}
        </div>
      )}
    </div>
  );
}
