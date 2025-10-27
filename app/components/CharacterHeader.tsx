'use client';

import { useState } from 'react';
import ShareButton from './ShareButton';

interface CharacterHeaderProps {
  characterName: string;
  characterDescription: string;
  characterLevel: number;
  characterImage: string | null;
  themeColor: 'amber' | 'red';
  defaultIcon: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onLevelChange: (level: number) => void;
  onImageChange: (image: string | null) => void;
  readOnly?: boolean;
  characterType?: 'detetive' | 'soldado';
}

export default function CharacterHeader({
  characterName,
  characterDescription,
  characterLevel,
  characterImage,
  themeColor,
  defaultIcon,
  onNameChange,
  onDescriptionChange,
  onLevelChange,
  onImageChange,
  readOnly = false,
  characterType,
}: CharacterHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempName, setTempName] = useState(characterName);
  const [tempDescription, setTempDescription] = useState(characterDescription);

  // Color classes based on theme
  const colors = {
    amber: {
      border: 'border-amber-700/40',
      bgGradient: 'from-amber-950/40',
      portraitBorder: 'border-amber-700/60',
      portraitBg: 'from-amber-900/20',
      iconColor: 'text-amber-700/40',
      inputBorder: 'border-amber-700/50',
      nameText: 'text-amber-100',
      descBg: 'bg-amber-900/20',
      descBorder: 'border-amber-700/30',
      descText: 'text-amber-300',
      levelText: 'text-amber-100',
    },
    red: {
      border: 'border-red-700/40',
      bgGradient: 'from-red-950/40',
      portraitBorder: 'border-red-700/60',
      portraitBg: 'from-red-900/20',
      iconColor: 'text-red-700/40',
      inputBorder: 'border-red-700/50',
      nameText: 'text-red-100',
      descBg: 'bg-red-900/20',
      descBorder: 'border-red-700/30',
      descText: 'text-red-300',
      levelText: 'text-red-100',
    },
  };

  const theme = colors[themeColor];

  const saveName = () => {
    onNameChange(tempName);
    setIsEditingName(false);
  };

  const saveDescription = () => {
    onDescriptionChange(tempDescription);
    setIsEditingDescription(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Imagem muito grande! Por favor, escolha uma imagem menor que 1MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onImageChange(null);
  };

  const handleLevelChange = (newLevel: number) => {
    if (newLevel < 1 || newLevel > 20) return;
    onLevelChange(newLevel);
  };

  return (
    <div className={`relative mb-8 rounded-lg border-2 ${theme.border} bg-gradient-to-br ${theme.bgGradient} via-neutral-900 to-neutral-950 p-6 shadow-2xl`}>
      {/* Share Button - Top Right (Absolute Position) */}
      {!readOnly && characterType && (
        <div className="absolute right-4 top-4 z-10">
          <ShareButton characterType={characterType} themeColor={themeColor} />
        </div>
      )}

      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Character Portrait */}
        <div className="relative flex-shrink-0 self-center sm:self-start">
          <div className={`group relative h-32 w-32 overflow-hidden rounded-lg border-4 ${theme.portraitBorder} bg-gradient-to-br ${theme.portraitBg} to-neutral-900 shadow-xl`}>
            {characterImage ? (
              <>
                <img
                  src={characterImage}
                  alt={characterName}
                  className="h-full w-full object-cover"
                />
                {!readOnly && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="pointer-events-auto absolute right-1 top-1 z-10 rounded bg-red-900/90 p-1 text-xs opacity-0 transition-opacity hover:bg-red-800 group-hover:opacity-100"
                    title="Remover imagem"
                  >
                    ✕
                  </button>
                )}
              </>
            ) : (
              <div className={`flex h-full w-full flex-col items-center justify-center ${theme.iconColor}`}>
                <span className="text-5xl">{defaultIcon}</span>
              </div>
            )}
            {!readOnly && (
              <label className="absolute inset-0 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  title="Clique para fazer upload da imagem"
                />
              </label>
            )}
          </div>
          {!readOnly && (
            <div className="mt-2 text-center text-xs text-neutral-500">
              Clique para {characterImage ? 'alterar' : 'adicionar'}
            </div>
          )}
        </div>

        {/* Character Info */}
        <div className="flex flex-1 flex-col justify-center gap-4">
          {/* Name */}
          {!readOnly && isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName();
                  if (e.key === 'Escape') {
                    setTempName(characterName);
                    setIsEditingName(false);
                  }
                }}
                className={`flex-1 min-w-0 rounded border-2 ${theme.inputBorder} bg-neutral-900 px-2 py-1 sm:px-4 sm:py-2 text-lg sm:text-2xl font-bold ${theme.nameText} shadow-inner`}
                autoFocus
              />
              <button
                onClick={saveName}
                className="flex-shrink-0 rounded bg-green-800 px-3 py-1 sm:px-4 sm:py-2 font-semibold hover:bg-green-700"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setTempName(characterName);
                  setIsEditingName(false);
                }}
                className="flex-shrink-0 rounded bg-neutral-700 px-3 py-1 sm:px-4 sm:py-2 font-semibold hover:bg-neutral-600"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-wide ${theme.nameText} drop-shadow-lg`}>
                {characterName}
              </h1>
              {!readOnly && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="flex-shrink-0 rounded bg-neutral-800/70 px-2 py-1 text-xs hover:bg-neutral-700"
                  title="Editar nome"
                >
                  ✏️
                </button>
              )}
            </div>
          )}

          {/* Description/Class and Level */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Description */}
            {!readOnly && isEditingDescription ? (
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <input
                  type="text"
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveDescription();
                    if (e.key === 'Escape') {
                      setTempDescription(characterDescription);
                      setIsEditingDescription(false);
                    }
                  }}
                  className={`flex-1 min-w-0 rounded border-2 ${theme.inputBorder} bg-neutral-900 px-2 py-1 sm:px-4 sm:py-2 text-base sm:text-lg ${theme.descText} shadow-inner`}
                  autoFocus
                />
                <button
                  onClick={saveDescription}
                  className="flex-shrink-0 rounded bg-green-800 px-3 py-1 sm:px-4 sm:py-2 font-semibold hover:bg-green-700"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setTempDescription(characterDescription);
                    setIsEditingDescription(false);
                  }}
                  className="flex-shrink-0 rounded bg-neutral-700 px-3 py-1 sm:px-4 sm:py-2 font-semibold hover:bg-neutral-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-1 items-center gap-3">
                <span className={`rounded-lg border ${theme.descBorder} ${theme.descBg} px-3 py-1 sm:px-4 sm:py-2 text-base sm:text-lg font-semibold ${theme.descText}`}>
                  {characterDescription}
                </span>
                {!readOnly && (
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    className="flex-shrink-0 rounded bg-neutral-800/70 px-3 py-1 text-sm hover:bg-neutral-700"
                  >
                    ✏️
                  </button>
                )}
              </div>
            )}

            {/* Level Control */}
            <div className="flex items-center gap-3 rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-4 py-2">
              <span className="text-sm text-neutral-400">Nível:</span>
              {!readOnly ? (
                <>
                  <button
                    onClick={() => handleLevelChange(characterLevel - 1)}
                    disabled={characterLevel <= 1}
                    className="rounded bg-neutral-800 px-3 py-1 font-semibold hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className={`text-2xl font-bold ${theme.levelText}`}>{characterLevel}</span>
                  <button
                    onClick={() => handleLevelChange(characterLevel + 1)}
                    disabled={characterLevel >= 20}
                    className="rounded bg-neutral-800 px-3 py-1 font-semibold hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
                </>
              ) : (
                <span className={`text-2xl font-bold ${theme.levelText}`}>{characterLevel}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
