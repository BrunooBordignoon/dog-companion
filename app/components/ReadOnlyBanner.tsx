'use client';

interface ReadOnlyBannerProps {
  characterName: string;
  exportedAt?: string;
  onReturn: () => void;
}

export default function ReadOnlyBanner({ characterName, exportedAt, onReturn }: ReadOnlyBannerProps) {
  return (
    <div className="sticky top-0 z-50 border-b-2 border-yellow-700/50 bg-gradient-to-r from-yellow-900/90 via-yellow-800/90 to-yellow-900/90 px-4 py-3 shadow-lg backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
        {/* Icon and Message */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-yellow-600 bg-yellow-950/50">
            <span className="text-xl">🔒</span>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-sm font-bold text-yellow-100">
              Visualizando ficha de <span className="text-yellow-300">{characterName}</span>
            </div>
            <div className="text-xs text-yellow-300/80">
              Modo somente leitura {exportedAt && `• Exportada ${exportedAt}`}
            </div>
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={onReturn}
          className="flex-shrink-0 rounded-lg border-2 border-yellow-600 bg-yellow-900/70 px-4 py-2 font-semibold text-yellow-100 transition-colors hover:bg-yellow-900 active:bg-yellow-950"
        >
          ← Voltar para Minha Ficha
        </button>
      </div>
    </div>
  );
}
