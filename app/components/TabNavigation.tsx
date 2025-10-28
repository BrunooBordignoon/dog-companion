'use client';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  themeColor?: 'amber' | 'red' | 'purple';
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  themeColor = 'amber'
}: TabNavigationProps) {
  const colors = {
    amber: {
      border: 'border-amber-700/50',
      activeBorder: 'border-amber-600',
      activeText: 'text-amber-100',
      inactiveText: 'text-neutral-400',
      hoverText: 'hover:text-neutral-200',
      badge: 'bg-yellow-600',
    },
    red: {
      border: 'border-red-700/50',
      activeBorder: 'border-red-600',
      activeText: 'text-red-100',
      inactiveText: 'text-neutral-400',
      hoverText: 'hover:text-neutral-200',
      badge: 'bg-yellow-600',
    },
    purple: {
      border: 'border-purple-700/50',
      activeBorder: 'border-purple-600',
      activeText: 'text-purple-100',
      inactiveText: 'text-neutral-400',
      hoverText: 'hover:text-neutral-200',
      badge: 'bg-yellow-600',
    },
  };

  const theme = colors[themeColor];

  return (
    <div className={`mb-6 overflow-x-auto border-b-2 ${theme.border}`}>
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? `border-b-2 ${theme.activeBorder} ${theme.activeText}`
                : `${theme.inactiveText} ${theme.hoverText}`
            }`}
          >
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full ${theme.badge} text-xs font-bold text-white`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
