'use client';

interface SectionHeaderProps {
  icon: string;
  title: string;
  themeColor?: 'amber' | 'red';
}

export default function SectionHeader({ icon, title, themeColor = 'amber' }: SectionHeaderProps) {
  const colors = {
    amber: {
      border: 'border-amber-700/30',
      text: 'text-amber-100',
    },
    red: {
      border: 'border-red-700/30',
      text: 'text-red-100',
    },
  };

  const theme = colors[themeColor];

  return (
    <h2 className={`mb-3 flex items-center gap-2 border-b ${theme.border} pb-2 font-serif text-lg sm:text-xl font-bold ${theme.text}`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="break-words">{title}</span>
    </h2>
  );
}
