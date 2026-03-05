import { useState } from 'react';
import type { CategoryResult, RiskLevel } from '../engine/types';
import { CATEGORY_LABELS } from '../engine/types';
import { RiskBadge } from './RiskBadge';

const BORDER: Record<RiskLevel, string> = {
  HIGH:   'border-l-[#ff453a]',
  MEDIUM: 'border-l-[#ff9f0a]',
  LOW:    'border-l-[#0a84ff]',
  CLEAR:  'border-l-[#0e2a4a]',
};

const FLAG_BORDER: Record<RiskLevel, string> = {
  HIGH:   'border-l-[#ff453a]',
  MEDIUM: 'border-l-[#ff9f0a]',
  LOW:    'border-l-[#0a84ff]',
  CLEAR:  'border-l-[#32d74b]',
};

export function RiskCategoryCard({ cat }: { cat: CategoryResult }) {
  const [open, setOpen] = useState(false);
  const hasFlags = cat.flags.length > 0;
  const isActive = cat.level !== 'CLEAR';

  return (
    <div className={`border-l-2 ${BORDER[cat.level]} bg-[#071830]`}>
      <button
        onClick={() => hasFlags && setOpen(o => !o)}
        className={`w-full text-left px-4 py-3 flex items-center justify-between gap-4 transition-colors ${
          hasFlags ? 'cursor-pointer hover:bg-[#091a35]' : 'cursor-default'
        }`}
      >
        <span className={`text-sm font-medium ${isActive ? 'text-[#c0d8ee]' : 'text-[#2e5570]'}`}>
          {CATEGORY_LABELS[cat.category]}
        </span>
        <div className="flex items-center gap-3 flex-shrink-0">
          <RiskBadge level={cat.level} />
          {hasFlags && (
            <span className="text-[#2e5570] text-[10px] font-mono">{open ? '▲' : '▼'}</span>
          )}
        </div>
      </button>

      {open && hasFlags && (
        <div className="border-t border-[#0a2040] divide-y divide-[#081830]">
          {cat.flags.map(flag => (
            <div key={flag.code} className={`border-l-2 ${FLAG_BORDER[flag.severity]} px-4 py-3 bg-[#030c18]`}>
              <div className="flex items-start gap-2.5 mb-2">
                <RiskBadge level={flag.severity} />
                <p className="text-sm font-semibold text-[#c0d8ee] leading-snug">{flag.title}</p>
              </div>
              <p className="text-xs text-[#8ab5d5] leading-relaxed mb-3">{flag.detail}</p>
              <div className="space-y-1.5">
                <p className="text-[11px] font-mono text-[#4070a0]">
                  <span className="text-[#4a90e0]">REF</span>{'  '}{flag.guidebookRef}
                </p>
                <p className="text-xs text-[#98c0d8] border-l border-[#1a3a60] pl-3 py-1">
                  {flag.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
