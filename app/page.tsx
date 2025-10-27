'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCharacterId, setPendingCharacterId] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user has already selected a character
  useEffect(() => {
    const saved = localStorage.getItem('selected-character');
    if (saved) {
      setSelectedCharacter(saved);
      // Redirect to their character sheet
      router.push(`/${saved}`);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleCharacterClick = (characterId: string) => {
    setPendingCharacterId(characterId);
    setShowConfirmModal(true);
  };

  const confirmSelection = () => {
    if (pendingCharacterId) {
      localStorage.setItem('selected-character', pendingCharacterId);
      setSelectedCharacter(pendingCharacterId);
      setShowConfirmModal(false);
      router.push(`/${pendingCharacterId}`);
    }
  };

  const cancelSelection = () => {
    setPendingCharacterId(null);
    setShowConfirmModal(false);
  };

  // Debug function to reset selection
  const resetSelection = () => {
    localStorage.removeItem('selected-character');
    setSelectedCharacter(null);
    window.location.reload();
  };

  const characters = [
    {
      id: 'detetive',
      name: 'José',
      icon: '🔍',
      color: 'from-amber-900/40 to-amber-950/40',
      borderColor: 'border-amber-700/50',
      available: true,
    },
    {
      id: 'soldado',
      name: 'Moyza',
      icon: '⚔️',
      color: 'from-red-900/40 to-red-950/40',
      borderColor: 'border-red-700/50',
      available: true,
    },
    {
      id: 'personagem3',
      name: 'Em Breve',
      icon: '❓',
      color: 'from-neutral-800/40 to-neutral-900/40',
      borderColor: 'border-neutral-700/50',
      available: false,
    },
    {
      id: 'personagem4',
      name: 'Em Breve',
      icon: '❓',
      color: 'from-neutral-800/40 to-neutral-900/40',
      borderColor: 'border-neutral-700/50',
      available: false,
    },
  ];

  const pendingCharacter = characters.find(c => c.id === pendingCharacterId);

  // ALWAYS show debug button, even when redirecting
  const debugButton = (
    <>
      <button
        onClick={() => setDebugMode(!debugMode)}
        className="fixed right-4 top-4 z-[9999] rounded bg-purple-900 border-2 border-purple-600 px-4 py-2 text-sm font-bold text-purple-200 shadow-xl hover:bg-purple-800"
        style={{ position: 'fixed', right: '16px', top: '16px' }}
      >
        🐛 Debug
      </button>

      {debugMode && (
        <div
          className="fixed right-4 top-20 z-[9999] min-w-[200px] rounded-lg border-2 border-purple-600 bg-purple-950 p-4 shadow-2xl"
          style={{ position: 'fixed', right: '16px', top: '80px' }}
        >
          <p className="mb-3 text-sm font-bold text-purple-200">Debug Controls</p>
          <button
            onClick={resetSelection}
            className="w-full rounded border-2 border-red-600 bg-red-900 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-800"
          >
            Reset Character Selection
          </button>
        </div>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        {debugButton}
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {debugButton}

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-5xl font-bold text-amber-100 sm:text-6xl">
            Fichas de Personagem
          </h1>
          <p className="text-lg text-neutral-400">
            Escolha seu personagem para gerenciar sua ficha
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-amber-700/50"></div>
            <span className="text-amber-600">⚔️</span>
            <div className="h-px w-16 bg-amber-700/50"></div>
          </div>
        </div>

        {/* Character Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => character.available && handleCharacterClick(character.id)}
              className={`group relative overflow-hidden rounded-lg border-2 ${character.borderColor} bg-gradient-to-br ${character.color} p-6 shadow-xl transition-all ${
                character.available
                  ? 'hover:scale-105 hover:shadow-2xl cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Icon */}
              <div className="mb-4 flex items-center justify-center">
                <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${character.borderColor} bg-neutral-900/50 text-5xl transition-transform ${
                  character.available ? 'group-hover:scale-110' : ''
                }`}>
                  {character.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h2 className="mb-4 font-serif text-2xl font-bold text-amber-100">
                  {character.name}
                </h2>

                {/* Status Badge */}
                {character.available ? (
                  <span className="inline-block rounded-full bg-green-900/50 border border-green-700/50 px-3 py-1 text-xs font-semibold text-green-300">
                    Disponível
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-neutral-800/50 border border-neutral-700/50 px-3 py-1 text-xs font-semibold text-neutral-500">
                    Em Desenvolvimento
                  </span>
                )}
              </div>

              {/* Hover Effect Border */}
              {character.available && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-600/0 via-amber-600/0 to-amber-600/0 opacity-0 transition-opacity group-hover:from-amber-600/10 group-hover:via-amber-600/5 group-hover:to-amber-600/10 group-hover:opacity-100"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-neutral-500">
          <p>Sistema de fichas para campanha de RPG</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-lg border-2 border-amber-700/50 bg-neutral-900 p-6 shadow-2xl">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-700/50 bg-neutral-950/50 text-3xl">
                ⚠️
              </div>
            </div>

            <h2 className="mb-4 text-center font-serif text-2xl font-bold text-amber-100">
              Confirmar Seleção de Personagem
            </h2>

            <div className="mb-6 rounded-lg border border-amber-700/30 bg-amber-950/20 p-4">
              <p className="mb-3 text-center text-lg font-semibold text-amber-200">
                {pendingCharacter.icon} {pendingCharacter.name}
              </p>
              <p className="text-sm text-neutral-300">
                Você está prestes a selecionar <span className="font-bold text-amber-300">{pendingCharacter.name}</span> como seu personagem.
              </p>
            </div>

            <div className="mb-6 rounded-lg border border-red-700/50 bg-red-950/20 p-4">
              <p className="text-sm font-semibold text-red-300">⚠️ ATENÇÃO:</p>
              <p className="mt-2 text-sm text-neutral-300">
                Esta é uma escolha <span className="font-bold text-red-400">permanente</span> e <span className="font-bold text-red-400">não pode ser revertida</span>.
                Certifique-se de que este é realmente o seu personagem antes de confirmar.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelSelection}
                className="flex-1 rounded-lg border-2 border-neutral-700 bg-neutral-800 px-4 py-3 font-semibold text-neutral-300 transition-colors hover:bg-neutral-700"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSelection}
                className="flex-1 rounded-lg border-2 border-amber-700 bg-amber-900/50 px-4 py-3 font-semibold text-amber-100 transition-colors hover:bg-amber-900/70"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
