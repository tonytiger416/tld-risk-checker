import { useState } from 'react';
import type { CategoryResult, RiskLevel } from '../engine/types';
import { CATEGORY_LABELS } from '../engine/types';
import { RiskBadge } from './RiskBadge';
import type { ObjectionSignals, ObjectionSeverity } from './AIAnalysisPanel';

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

const SEV_COLOR: Record<ObjectionSeverity, string> = {
  'None':      'text-[#32d74b] border-[#1a4a2a]',
  'Possible':  'text-[#0a84ff] border-[#0a2a5a]',
  'Likely':    'text-[#ff9f0a] border-[#4a3010]',
  'High risk': 'text-[#ff453a] border-[#4a1510]',
};

const SEV_DOT: Record<ObjectionSeverity, string> = {
  'None':      'bg-[#32d74b]',
  'Possible':  'bg-[#0a84ff]',
  'Likely':    'bg-[#ff9f0a]',
  'High risk': 'bg-[#ff453a]',
};

interface Props {
  cat: CategoryResult;
  aiObjectionSignals?: ObjectionSignals | null;
}

export function RiskCategoryCard({ cat, aiObjectionSignals }: Props) {
  const [open, setOpen] = useState(false);
  const hasFlags = cat.flags.length > 0;
  const isActive = cat.level !== 'CLEAR';

  // AI has elevated the objection risk if any signal is Likely/High risk
  // and the engine didn't catch it (engine is CLEAR or LOW)
  const aiElevated = aiObjectionSignals != null && (
    ['Likely', 'High risk'].includes(aiObjectionSignals.gac.severity) ||
    ['Likely', 'High risk'].includes(aiObjectionSignals.lpi.severity) ||
    ['Likely', 'High risk'].includes(aiObjectionSignals.community.severity) ||
    ['Likely', 'High risk'].includes(aiObjectionSignals.lro.severity)
  ) && (cat.level === 'CLEAR' || cat.level === 'LOW');

  const canExpand = hasFlags || aiObjectionSignals != null;

  return (
    <div className={`border-l-2 ${BORDER[cat.level]} bg-[#071830]`}>
      <button
        onClick={() => canExpand && setOpen(o => !o)}
        className={`w-full text-left px-4 py-3 flex items-center justify-between gap-4 transition-colors ${
          canExpand ? 'cursor-pointer hover:bg-[#091a35]' : 'cursor-default'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-sm font-medium ${isActive ? 'text-[#e0f0ff]' : 'text-[#5a98c8]'}`}>
            {CATEGORY_LABELS[cat.category]}
          </span>
          {aiElevated && (
            <span className="flex-shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#4a3010] text-[#ff9f0a] tracking-wider">
              AI ↑
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <RiskBadge level={cat.level} />
          {canExpand && (
            <span className="text-[#5a98c8] text-[10px] font-mono">{open ? '▲' : '▼'}</span>
          )}
        </div>
      </button>

      {open && canExpand && (
        <div className="border-t border-[#0a2040] divide-y divide-[#081830]">
          {cat.flags.map(flag => (
            <div key={flag.code} className={`border-l-2 ${FLAG_BORDER[flag.severity]} px-4 py-3 bg-[#030c18]`}>
              <div className="flex items-start gap-2.5 mb-2">
                <RiskBadge level={flag.severity} />
                <p className="text-sm font-semibold text-[#e0f0ff] leading-snug">{flag.title}</p>
              </div>
              <p className="text-xs text-[#b8d8f0] leading-relaxed mb-3">{flag.detail}</p>
              <div className="space-y-1.5">
                <p className="text-[11px] font-mono text-[#6898d0]">
                  <span className="text-[#70b8ff]">REF</span>{'  '}{flag.guidebookRef}
                </p>
                <p className="text-xs text-[#c8e8f8] border-l border-[#1a4a80] pl-3 py-1">
                  {flag.recommendation}
                </p>
              </div>
            </div>
          ))}

          {/* AI Objection Assessment */}
          {aiObjectionSignals && (
            <div className="px-4 py-3 bg-[#030c18]">
              <p className="text-[9px] font-mono font-bold text-[#6898d0] tracking-[0.18em] uppercase mb-2.5">
                AI Objection Assessment
              </p>
              <div className="space-y-1.5">
                {([
                  { label: 'GAC',       signal: aiObjectionSignals.gac },
                  { label: 'LPI',       signal: aiObjectionSignals.lpi },
                  { label: 'Community', signal: aiObjectionSignals.community },
                  { label: 'LRO',       signal: aiObjectionSignals.lro },
                ] as const).map(({ label, signal }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <span className={`flex-shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border mt-0.5 ${SEV_COLOR[signal.severity]}`}>
                      {label}
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${SEV_DOT[signal.severity]}`} />
                      <span className="text-xs text-[#b8d8f0] leading-snug">
                        <span className={`font-mono font-semibold ${SEV_COLOR[signal.severity].split(' ')[0]}`}>
                          {signal.severity}
                        </span>
                        {signal.reason !== '—' && ` — ${signal.reason}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
