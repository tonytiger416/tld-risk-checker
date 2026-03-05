import { useState } from 'react';
import type { CategoryResult, RiskLevel } from '../engine/types';
import { CATEGORY_LABELS } from '../engine/types';
import { RiskBadge } from './RiskBadge';

const BORDER: Record<RiskLevel, string> = {
  HIGH:   'border-l-[#ff453a]',
  MEDIUM: 'border-l-[#ff9f0a]',
  LOW:    'border-l-[#0a84ff]',
  CLEAR:  'border-l-[#1e2436]',
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
    <div className={`border-l-2 ${BORDER[cat.level]} bg-[#12151e]`}>
      <button
        onClick={() => hasFlags && setOpen(o => !o)}
        className={`w-full text-left px-4 py-3 flex items-center justify-between gap-4 transition-colors ${
          hasFlags ? 'cursor-pointer hover:bg-[#171b27]' : 'cursor-default'
        }`}
      >
        <span className={`text-sm font-medium ${isActive ? 'text-[#e2e8f0]' : 'text-[#3a4060]'}`}>
          {CATEGORY_LABELS[cat.category]}
        </span>
        <div className="flex items-center gap-3 flex-shrink-0">
          <RiskBadge level={cat.level} />
          {hasFlags && (
            <span className="text-[#3a4060] text-[10px] font-mono">{open ? '▲' : '▼'}</span>
          )}
        </div>
      </button>

      {open && hasFlags && (
        <div className="border-t border-[#1a1e2e] divide-y divide-[#141720]">
          {cat.flags.map(flag => (
            <div key={flag.code} className={`border-l-2 ${FLAG_BORDER[flag.severity]} px-4 py-3 bg-[#0f1219]`}>
              <div className="flex items-start gap-2.5 mb-2">
                <RiskBadge level={flag.severity} />
                <p className="text-sm font-semibold text-[#d8dce8] leading-snug">{flag.title}</p>
              </div>
              <p className="text-xs text-[#6b7390] leading-relaxed mb-3">{flag.detail}</p>
              <div className="space-y-1.5">
                <p className="text-[11px] font-mono text-[#3a4878]">
                  <span className="text-[#2a5aad]">REF</span>{'  '}{flag.guidebookRef}
                </p>
                <p className="text-xs text-[#8891b0] border-l border-[#2a3050] pl-3 py-1">
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
