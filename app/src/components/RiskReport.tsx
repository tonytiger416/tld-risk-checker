import { useRef } from 'react';
import type { TLDRiskReport, RiskLevel } from '../engine/types';
import { APPLICATION_RISK_CATEGORIES, COMPETITIVE_DEMAND_CATEGORIES } from '../engine/types';
import { RiskBadge } from './RiskBadge';
import { RiskCategoryCard } from './RiskCategoryCard';
import { AIAnalysisPanel } from './AIAnalysisPanel';

// Top border accent color per risk level
const ACCENT_BORDER: Record<RiskLevel, string> = {
  HIGH:   'border-t-[#ff453a]',
  MEDIUM: 'border-t-[#ff9f0a]',
  LOW:    'border-t-[#0a84ff]',
  CLEAR:  'border-t-[#32d74b]',
};

const DEMAND_LABEL: Record<RiskLevel, string> = {
  HIGH:   'Auction Likely',
  MEDIUM: 'Competition Expected',
  LOW:    'Limited Interest',
  CLEAR:  'Minimal Demand',
};

const DEMAND_COLOR: Record<RiskLevel, string> = {
  HIGH:   'text-[#ff453a]',
  MEDIUM: 'text-[#ff9f0a]',
  LOW:    'text-[#0a84ff]',
  CLEAR:  'text-[#32d74b]',
};

const APP_RISK_COLOR: Record<RiskLevel, string> = {
  HIGH:   'text-[#ff453a]',
  MEDIUM: 'text-[#ff9f0a]',
  LOW:    'text-[#0a84ff]',
  CLEAR:  'text-[#32d74b]',
};

export function RiskReport({ report }: { report: TLDRiskReport }) {
  const aiCacheRef = useRef<Record<string, string>>({});

  const appRiskLevel = report.applicationRiskLevel;
  const demandLevel  = report.competitiveDemandLevel;

  const appRiskCategories = report.categories.filter(c => APPLICATION_RISK_CATEGORIES.has(c.category));
  const demandCategories  = report.categories.filter(c => COMPETITIVE_DEMAND_CATEGORIES.has(c.category));

  return (
    <div className={`bg-[#12151e] border border-[#1e2436] border-t-2 ${ACCENT_BORDER[appRiskLevel]} rounded-lg overflow-hidden`}>

      {/* Hard Blocked Banner */}
      {report.isHardBlocked && (
        <div className="bg-[#1a0808] border-b border-[#3a1010] px-6 py-3 flex items-center gap-3">
          <span className="text-lg">⛔</span>
          <div>
            <p className="font-mono font-bold text-sm text-[#ff453a] tracking-wider">HARD BLOCKED — DO NOT APPLY</p>
            <p className="text-xs text-[#6b3030] mt-0.5">This string is permanently ineligible. No amount of effort, legal action, or resources can change this outcome.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1a1e2e]">
        <div className="flex items-start justify-between flex-wrap gap-6">

          {/* TLD identity */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold text-[#3a4060] tracking-[0.2em] uppercase">Candidate TLD</span>
              <span className="text-[10px] font-mono text-[#2a3050] border border-[#1e2436] px-2 py-0.5 rounded">
                {report.appType === 'brand' ? '.Brand' : 'Open Generic'}
              </span>
            </div>
            <h2 className="text-4xl font-mono font-bold tracking-tight text-[#e2e8f0]">.{report.normalized}</h2>
          </div>

          {/* Scores */}
          <div className="flex items-stretch gap-px border border-[#1e2436] rounded-lg overflow-hidden">

            <div className="bg-[#0f1219] px-5 py-3 min-w-[140px]">
              <div className="text-[10px] font-mono text-[#3a4060] tracking-[0.15em] uppercase mb-2">Application Risk</div>
              <div className={`text-xl font-mono font-black ${APP_RISK_COLOR[appRiskLevel]}`}>
                {appRiskLevel}
              </div>
            </div>

            <div className="w-px bg-[#1a1e2e]" />

            <div className="bg-[#0f1219] px-5 py-3 min-w-[160px]">
              <div className="text-[10px] font-mono text-[#3a4060] tracking-[0.15em] uppercase mb-2">Competitive Demand</div>
              <div className={`text-xl font-mono font-black ${DEMAND_COLOR[demandLevel]}`}>
                {DEMAND_LABEL[demandLevel].toUpperCase()}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">

        {/* AI Analysis */}
        <AIAnalysisPanel
          report={report}
          cachedText={aiCacheRef.current[report.normalized] ?? ''}
          onCacheUpdate={(text) => { aiCacheRef.current[report.normalized] = text; }}
        />

        {/* Top Issues */}
        {(() => {
          const keyFlags = report.topFlags.filter(f => f.severity === 'HIGH' || f.severity === 'MEDIUM');
          return keyFlags.length > 0 ? (
            <div className="bg-[#12151e] border border-[#1e2436] rounded-lg p-4">
              <h3 className="text-[10px] font-mono font-bold text-[#3a4060] tracking-[0.2em] uppercase mb-3">Top Issues</h3>
              <div className="space-y-2.5">
                {keyFlags.map(flag => (
                  <div key={flag.code} className="flex items-start gap-3">
                    <RiskBadge level={flag.severity} />
                    <span className="text-sm text-[#9ba8c0] flex-1 leading-snug">{flag.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Similar TLDs */}
        {report.similarTLDs.length > 0 && (
          <div className="bg-[#12151e] border border-[#1e2436] rounded-lg p-4">
            <h3 className="text-[10px] font-mono font-bold text-[#3a4060] tracking-[0.2em] uppercase mb-3">Most Similar Existing TLDs</h3>
            <div className="space-y-2">
              {report.similarTLDs.map(t => (
                <div key={t.tld} className="flex items-center gap-4">
                  <span className="text-sm font-mono text-[#8891b0] w-24 flex-shrink-0">.{t.tld}</span>
                  <div className="flex-1 bg-[#0b0d14] rounded-full h-1 overflow-hidden">
                    <div className="h-full rounded-full bg-[#2a3050]" style={{ width: `${t.visualScore}%` }} />
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs font-mono text-[#4a5270]">{t.visualScore}%</span>
                    <span className="text-xs text-[#2a3050] capitalize">({t.type})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Risk Categories */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-[#1a1e2e]" />
            <span className="text-[10px] font-mono font-bold text-[#2a3050] tracking-[0.2em] uppercase whitespace-nowrap">Application Risk</span>
            <div className="h-px flex-1 bg-[#1a1e2e]" />
          </div>
          <p className="text-xs text-[#2a3050] font-mono mb-3">
            Can the application succeed through ICANN evaluation? Click any row to expand.
          </p>
          <div className="divide-y divide-[#141720] border border-[#1e2436] rounded-lg overflow-hidden">
            {appRiskCategories.map(cat => (
              <RiskCategoryCard key={cat.category} cat={cat} />
            ))}
          </div>
        </div>

        {/* Competitive Demand Categories */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-[#1a1e2e]" />
            <span className="text-[10px] font-mono font-bold text-[#2a3050] tracking-[0.2em] uppercase whitespace-nowrap">Competitive Demand</span>
            <div className="h-px flex-1 bg-[#1a1e2e]" />
          </div>
          <p className="text-xs text-[#2a3050] font-mono mb-3">
            How many competitors should you expect, and is an ICANN auction likely?
          </p>
          <div className="border border-[#1e2436] rounded-lg overflow-hidden">
            {demandCategories.map(cat => (
              <RiskCategoryCard key={cat.category} cat={cat} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
