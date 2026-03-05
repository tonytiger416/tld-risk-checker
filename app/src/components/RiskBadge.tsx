import type { RiskLevel } from '../engine/types';

const CONFIG: Record<RiskLevel, { text: string; dot: string; label: string }> = {
  HIGH:   { text: 'text-[#ff453a]', dot: 'bg-[#ff453a]', label: 'HIGH RISK' },
  MEDIUM: { text: 'text-[#ff9f0a]', dot: 'bg-[#ff9f0a]', label: 'MEDIUM'    },
  LOW:    { text: 'text-[#0a84ff]', dot: 'bg-[#0a84ff]', label: 'LOW RISK'  },
  CLEAR:  { text: 'text-[#32d74b]', dot: 'bg-[#32d74b]', label: 'CLEAR'     },
};

interface Props {
  level: RiskLevel;
  score?: number;
  large?: boolean;
}

export function RiskBadge({ level, large }: Props) {
  const c = CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold tracking-wider ${c.text} ${large ? 'text-sm' : 'text-[11px]'}`}>
      <span className={`inline-block rounded-full flex-shrink-0 ${c.dot} ${large ? 'w-2 h-2' : 'w-1.5 h-1.5'}`} />
      {c.label}
    </span>
  );
}
