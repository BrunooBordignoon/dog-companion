'use client';

interface ContentBoxProps {
  title?: string;
  icon?: string;
  children: React.ReactNode;
  themeColor?: 'amber' | 'red';
}

export default function ContentBox({ title, icon, children, themeColor = 'amber' }: ContentBoxProps) {
  const colors = {
    amber: {
      border: 'border-amber-700/50',
      bgGradient: 'from-amber-950/20',
      dividerBorder: 'border-amber-700/30',
      titleText: 'text-amber-100',
    },
    red: {
      border: 'border-red-700/50',
      bgGradient: 'from-red-950/20',
      dividerBorder: 'border-red-700/30',
      titleText: 'text-red-100',
    },
  };

  const theme = colors[themeColor];

  return (
    <div className={`rounded-lg border-2 ${theme.border} bg-gradient-to-br ${theme.bgGradient} to-neutral-900 p-3 sm:p-4 shadow-lg`}>
      {title && (
        <h2 className={`mb-4 flex items-center gap-2 border-b ${theme.dividerBorder} pb-2 font-serif text-lg sm:text-xl font-bold ${theme.titleText}`}>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="break-words">{title}</span>
        </h2>
      )}
      {children}
    </div>
  );
}
