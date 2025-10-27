'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DebugButtonInner() {
  const searchParams = useSearchParams();
  const showDebug = searchParams.get('debug') !== null;
  const [debugMode, setDebugMode] = useState(false);

  const resetCharacterSelection = () => {
    if (confirm('Tem certeza que deseja resetar a seleção de personagem?')) {
      localStorage.removeItem('selected-character');
      window.location.href = '/';
    }
  };

  if (!showDebug) {
    return null;
  }

  return (
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
            onClick={resetCharacterSelection}
            className="w-full rounded border-2 border-red-600 bg-red-900 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-800"
          >
            Reset Character Selection
          </button>
        </div>
      )}
    </>
  );
}

export default function DebugButton() {
  return (
    <Suspense fallback={null}>
      <DebugButtonInner />
    </Suspense>
  );
}
