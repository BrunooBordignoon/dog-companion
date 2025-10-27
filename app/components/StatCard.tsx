'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: 'red' | 'blue' | 'green' | 'amber' | 'purple';
  interactive?: {
    onDecrease: () => void;
    onIncrease: () => void;
  };
}

export default function StatCard({ label, value, color = 'amber', interactive }: StatCardProps) {
  const colors = {
    red: {
      border: 'border-red-700/30',
      labelText: 'text-red-600',
      valueText: 'text-red-400',
    },
    blue: {
      border: 'border-blue-700/30',
      labelText: 'text-blue-600',
      valueText: 'text-blue-400',
    },
    green: {
      border: 'border-green-700/30',
      labelText: 'text-green-600',
      valueText: 'text-green-400',
    },
    amber: {
      border: 'border-amber-700/30',
      labelText: 'text-amber-600',
      valueText: 'text-amber-400',
    },
    purple: {
      border: 'border-purple-700/30',
      labelText: 'text-purple-600',
      valueText: 'text-purple-400',
    },
  };

  const theme = colors[color];

  return (
    <div className={`rounded-lg border-2 ${theme.border} bg-gradient-to-br from-neutral-900 to-neutral-950 p-3 shadow-lg`}>
      <div className={`text-xs font-semibold uppercase tracking-wider ${theme.labelText}`}>
        {label}
      </div>
      {interactive ? (
        <div className="mt-1 flex items-center justify-center gap-1 sm:gap-2">
          <button
            onClick={interactive.onDecrease}
            className="rounded bg-neutral-800 px-2 py-1 text-sm hover:bg-neutral-700 active:bg-neutral-600"
          >
            -
          </button>
          <span className={`text-xl sm:text-2xl font-bold ${theme.valueText} min-w-0 text-center`}>{value}</span>
          <button
            onClick={interactive.onIncrease}
            className="rounded bg-neutral-800 px-2 py-1 text-sm hover:bg-neutral-700 active:bg-neutral-600"
          >
            +
          </button>
        </div>
      ) : (
        <div className={`mt-1 text-xl sm:text-2xl font-bold ${theme.valueText}`}>{value}</div>
      )}
    </div>
  );
}
