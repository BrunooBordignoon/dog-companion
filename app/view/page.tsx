'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { importCharacterData, CharacterExportData, formatExportDate } from '@/lib/share-utils';
import ReadOnlyBanner from '@/app/components/ReadOnlyBanner';
import DetetivePage from '@/app/detetive/page';
import SoldadoPage from '@/app/soldado/page';

function ViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [characterData, setCharacterData] = useState<CharacterExportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    const charParam = searchParams.get('char');

    if (!dataParam || !charParam) {
      setError('Link inválido: parâmetros ausentes');
      return;
    }

    if (charParam !== 'detetive' && charParam !== 'soldado') {
      setError('Tipo de personagem inválido');
      return;
    }

    try {
      const imported = importCharacterData(dataParam);

      // Validar que o tipo de personagem corresponde
      if (imported.characterType !== charParam) {
        setError('Tipo de personagem não corresponde aos dados');
        return;
      }

      setCharacterData(imported);
    } catch (e) {
      console.error('Failed to import character data:', e);
      setError(e instanceof Error ? e.message : 'Erro ao carregar dados do personagem');
    }
  }, [searchParams]);

  const handleReturn = () => {
    router.push('/');
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-md rounded-lg border-2 border-red-700/50 bg-red-950/20 p-6 text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="mb-3 font-serif text-2xl font-bold text-red-300">Erro ao Carregar Ficha</h2>
          <p className="mb-4 text-sm text-neutral-300">{error}</p>
          <button
            onClick={handleReturn}
            className="rounded-lg border-2 border-neutral-700 bg-neutral-800 px-6 py-2 font-semibold text-neutral-300 transition-colors hover:bg-neutral-700"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  if (!characterData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-neutral-400">Carregando ficha compartilhada...</p>
        </div>
      </div>
    );
  }

  const formattedDate = formatExportDate(characterData.exportedAt);

  return (
    <div className="min-h-screen bg-neutral-950">
      <ReadOnlyBanner
        characterName={characterData.characterName || 'Personagem'}
        exportedAt={formattedDate}
        onReturn={handleReturn}
      />

      {/* Renderizar página apropriada em modo read-only */}
      {characterData.characterType === 'detetive' && (
        <DetetivePage readOnly initialData={characterData.data} />
      )}
      {characterData.characterType === 'soldado' && (
        <SoldadoPage readOnly initialData={characterData.data} />
      )}
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-950">
          <div className="text-center">
            <div className="mb-4 text-4xl">⏳</div>
            <p className="text-neutral-400">Carregando...</p>
          </div>
        </div>
      }
    >
      <ViewPageContent />
    </Suspense>
  );
}
