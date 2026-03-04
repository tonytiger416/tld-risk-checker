import type { RiskLevel } from '../engine/types';

const CONFIG: Record<RiskLevel, { bg: string; text: string; label: string; dot: string }> = {
  HIGH:   { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'HIGH RISK' },
  MEDIUM: { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500',  label: 'MEDIUM RISK' },
  LOW:    { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'LOW RISK' },
  CLEAR:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'CLEAR' },
};

interface Props {
  level: RiskLevel;
  score?: number;
  large?: boolean;
}

export function RiskBadge({ level, score, large }: Props) {
  const c = CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${c.bg} ${c.text} ${large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}`}>
      <span className={`rounded-full ${c.dot} ${large ? 'w-2.5 h-2.5' : 'w-2 h-2'}`} />
      {c.label}{score !== undefined && ` — ${score}/100`}
    </span>
  );
}
