'use client';

import { useState } from 'react';
import { generateShareURL } from '@/lib/share-utils';

interface ShareButtonProps {
  characterType: 'detetive' | 'soldado';
  themeColor: 'amber' | 'red';
}

export default function ShareButton({ characterType, themeColor }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareURL, setShareURL] = useState('');
  const [error, setError] = useState<string | null>(null);

  const colors = {
    amber: {
      button: 'border-amber-700 bg-amber-900/50 text-amber-100 hover:bg-amber-900/70',
      modal: 'border-amber-700/50',
      title: 'text-amber-100',
      copyButton: 'border-amber-700 bg-amber-900/50 hover:bg-amber-900/70 text-amber-100',
      copyButtonSuccess: 'border-green-700 bg-green-900/50 hover:bg-green-900/70 text-green-100',
    },
    red: {
      button: 'border-red-700 bg-red-900/50 text-red-100 hover:bg-red-900/70',
      modal: 'border-red-700/50',
      title: 'text-red-100',
      copyButton: 'border-red-700 bg-red-900/50 hover:bg-red-900/70 text-red-100',
      copyButtonSuccess: 'border-green-700 bg-green-900/50 hover:bg-green-900/70 text-green-100',
    },
  };

  const theme = colors[themeColor];

  const handleShare = () => {
    try {
      setError(null);
      const url = generateShareURL(characterType);
      setShareURL(url);
      setShowModal(true);
      setCopied(false);
    } catch (e) {
      console.error('Failed to generate share URL:', e);
      setError('Erro ao gerar link de compartilhamento');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Failed to copy:', e);
      setError('Erro ao copiar para área de transferência');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCopied(false);
    setError(null);
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold transition-colors ${theme.button}`}
        title="Compartilhar ficha"
      >
        <span>🔗</span>
        <span className="hidden sm:inline">Compartilhar</span>
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className={`w-full max-w-2xl rounded-lg border-2 ${theme.modal} bg-neutral-900 p-6 shadow-2xl`}>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`font-serif text-2xl font-bold ${theme.title}`}>
                🔗 Compartilhar Ficha
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            {/* Instructions */}
            <div className="mb-4 rounded-lg border border-blue-700/50 bg-blue-950/20 p-4">
              <p className="mb-2 text-sm font-semibold text-blue-300">ℹ️ Como funciona:</p>
              <ul className="space-y-1 text-sm text-neutral-300">
                <li>• Este link contém todos os dados da sua ficha</li>
                <li>• Qualquer pessoa pode visualizar, mas <strong>não pode editar</strong></li>
                <li>• Os dados ficam salvos na URL (não usamos servidor)</li>
                <li>• O link pode ficar longo, mas é seguro compartilhar</li>
              </ul>
            </div>

            {/* URL Box */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-neutral-300">
                Link de Compartilhamento:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareURL}
                  readOnly
                  className="flex-1 rounded-lg border-2 border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-300 selection:bg-blue-500/30"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={copyToClipboard}
                  className={`flex-shrink-0 rounded-lg border-2 px-4 py-2 font-semibold transition-colors ${
                    copied ? theme.copyButtonSuccess : theme.copyButton
                  }`}
                >
                  {copied ? '✓ Copiado!' : '📋 Copiar'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-700/50 bg-red-950/20 p-3 text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}

            {/* Warning */}
            <div className="mb-4 rounded-lg border border-yellow-700/50 bg-yellow-950/20 p-4">
              <p className="text-sm font-semibold text-yellow-300">⚠️ Importante:</p>
              <p className="mt-1 text-sm text-neutral-300">
                O link contém o estado atual da ficha. Se você fizer alterações depois de gerar o link,
                precisará gerar um novo link para compartilhar as mudanças.
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="rounded-lg border-2 border-neutral-700 bg-neutral-800 px-6 py-2 font-semibold text-neutral-300 transition-colors hover:bg-neutral-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
