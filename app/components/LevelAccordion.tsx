'use client';

import { useState } from 'react';

interface LevelAccordionProps {
  level: number;
  title: string;
  isLocked: boolean;
  isPending: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
  themeColor?: 'amber' | 'red' | 'purple';
}

export default function LevelAccordion({
  level,
  title,
  isLocked,
  isPending,
  children,
  defaultOpen = false,
  themeColor = 'amber'
}: LevelAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const themeClasses = {
    amber: {
      border: 'border-amber-700/50',
      bg: 'bg-amber-950/30',
      bgHover: 'hover:bg-amber-900/40',
      text: 'text-amber-100',
    },
    red: {
      border: 'border-red-700/50',
      bg: 'bg-red-950/30',
      bgHover: 'hover:bg-red-900/40',
      text: 'text-red-100',
    },
    purple: {
      border: 'border-purple-700/50',
      bg: 'bg-purple-950/30',
      bgHover: 'hover:bg-purple-900/40',
      text: 'text-purple-100',
    },
  };

  const theme = themeClasses[themeColor];

  return (
    <div className={`rounded-lg overflow-hidden border-2 ${
      isLocked
        ? 'border-neutral-900 bg-black'
        : theme.border
    }`}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
          isLocked
            ? 'bg-neutral-950 hover:bg-neutral-900'
            : `${theme.bg} ${theme.bgHover}`
        }`}
      >
        <h2 className={`flex flex-wrap items-center gap-2 text-lg sm:text-xl font-bold ${
          isLocked ? 'text-neutral-500' : theme.text
        }`}>
          <span className="break-words">Nível {level} – {title}</span>
          {isLocked && <span className="flex-shrink-0">🔒</span>}
          {isPending && !isLocked && (
            <span className="rounded-full bg-yellow-600 px-2 py-1 text-xs font-bold text-white whitespace-nowrap flex-shrink-0">
              PENDENTE
            </span>
          )}
        </h2>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isLocked ? 'text-neutral-500' : 'text-current'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content - Collapsible */}
      {isOpen && (
        <div className="p-4 space-y-2 bg-neutral-950">
          {children}
        </div>
      )}
    </div>
  );
}
