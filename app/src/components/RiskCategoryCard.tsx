import { useState } from 'react';
import type { CategoryResult, RiskLevel } from '../engine/types';
import { CATEGORY_LABELS } from '../engine/types';
import { RiskBadge } from './RiskBadge';

const LEVEL_BAR: Record<RiskLevel, string> = {
  HIGH:   'bg-red-500',
  MEDIUM: 'bg-amber-500',
  LOW:    'bg-blue-400',
  CLEAR:  'bg-green-500',
};

const SEV_COLOR: Record<RiskLevel, string> = {
  HIGH:   'border-red-400 bg-red-50',
  MEDIUM: 'border-amber-400 bg-amber-50',
  LOW:    'border-blue-400 bg-blue-50',
  CLEAR:  'border-green-400 bg-green-50',
};

const SEV_DOT: Record<RiskLevel, string> = {
  HIGH:   'bg-red-500',
  MEDIUM: 'bg-amber-500',
  LOW:    'bg-blue-500',
  CLEAR:  'bg-green-500',
};

export function RiskCategoryCard({ cat }: { cat: CategoryResult }) {
  const [open, setOpen] = useState(false);
  const hasFlags = cat.flags.length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => hasFlags && setOpen(o => !o)}
        className={`w-full text-left px-4 py-3 flex items-center gap-3 ${hasFlags ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'} transition-colors`}
      >
        {/* Score bar */}
        <div className="w-1.5 self-stretch rounded-full flex-shrink-0 bg-slate-100 relative overflow-hidden">
          <div
            className={`absolute bottom-0 left-0 right-0 rounded-full ${LEVEL_BAR[cat.level]} transition-all`}
            style={{ height: `${cat.score}%` }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800">{CATEGORY_LABELS[cat.category]}</span>
            <RiskBadge level={cat.level} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{cat.summary}</p>
        </div>

        {hasFlags && (
          <span className="text-slate-400 text-sm flex-shrink-0">{open ? '▲' : '▼'}</span>
        )}
      </button>

      {open && hasFlags && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-3">
          {cat.flags.map(flag => (
            <div key={flag.code} className={`rounded-lg border-l-4 px-3 py-2.5 ${SEV_COLOR[flag.severity]}`}>
              <div className="flex items-start gap-2">
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${SEV_DOT[flag.severity]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{flag.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{flag.detail}</p>
                  <div className="mt-2 flex flex-col gap-1">
                    <p className="text-xs text-slate-500">
                      <span className="font-medium">Guidebook ref:</span> {flag.guidebookRef}
                    </p>
                    <p className="text-xs text-slate-700 bg-white/70 rounded px-2 py-1 border border-slate-200">
                      <span className="font-medium">Recommendation:</span> {flag.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
