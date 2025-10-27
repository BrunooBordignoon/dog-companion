'use client';

interface WarningBannerProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function WarningBanner({ title, message, buttonText, onButtonClick }: WarningBannerProps) {
  return (
    <div className="mb-4 rounded-lg border border-yellow-700/50 bg-yellow-950/30 p-3 sm:p-4">
      <div className="flex items-start gap-2 sm:items-center">
        <span className="text-xl sm:text-2xl flex-shrink-0">⚠️</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-yellow-200 text-sm sm:text-base">{title}</div>
          <div className="text-xs sm:text-sm text-yellow-300 break-words">{message}</div>
          <button
            onClick={onButtonClick}
            className="mt-2 rounded bg-yellow-700 px-3 py-1 text-xs sm:text-sm font-semibold text-yellow-50 hover:bg-yellow-600 active:bg-yellow-800"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
