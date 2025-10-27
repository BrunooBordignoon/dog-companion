'use client';

interface PathInfoCardProps {
  icon: string;
  title: string;
  subtitle: string; // e.g., "ofensivo", "defensivo", "investigativo"
  description: string;
  borderColor?: string; // e.g., "border-red-700/50"
  bgGradient?: string; // e.g., "from-red-950/20"
}

export default function PathInfoCard({
  icon,
  title,
  subtitle,
  description,
  borderColor = 'border-amber-700/50',
  bgGradient = 'from-amber-950/20'
}: PathInfoCardProps) {
  return (
    <div className={`rounded-lg border-2 ${borderColor} bg-gradient-to-br ${bgGradient} to-neutral-900 p-3`}>
      <h3 className="mb-2 font-bold text-amber-100 text-sm sm:text-base flex items-center gap-1">
        <span className="flex-shrink-0">{icon}</span>
        <span className="break-words">{title}</span>
      </h3>
      <p className="text-xs text-neutral-300">
        Caminho <span className={`font-semibold ${getSubtitleColor(borderColor)}`}>{subtitle}</span>. {description}
      </p>
    </div>
  );
}

function getSubtitleColor(borderColor: string): string {
  if (borderColor.includes('red')) return 'text-red-300';
  if (borderColor.includes('blue')) return 'text-blue-300';
  if (borderColor.includes('purple')) return 'text-purple-300';
  if (borderColor.includes('amber')) return 'text-amber-300';
  return 'text-neutral-300';
}
