import { useState, useRef } from 'react';
import type { TLDRiskReport, RiskLevel } from '../engine/types';
import { RiskBadge } from './RiskBadge';
import { RiskCategoryCard } from './RiskCategoryCard';
import { RiskRadarChart } from './RadarChart';
import { AIAnalysisPanel } from './AIAnalysisPanel';

const BG: Record<RiskLevel, string> = {
  HIGH:   'border-red-300 bg-red-50',
  MEDIUM: 'border-amber-300 bg-amber-50',
  LOW:    'border-blue-300 bg-blue-50',
  CLEAR:  'border-green-300 bg-green-50',
};

const HEADER_BG: Record<RiskLevel, string> = {
  HIGH:   'bg-red-600',
  MEDIUM: 'bg-amber-500',
  LOW:    'bg-blue-600',
  CLEAR:  'bg-green-600',
};

type Tab = 'overview' | 'details' | 'recommendations';

export function RiskReport({ report }: { report: TLDRiskReport }) {
  const [tab, setTab] = useState<Tab>('overview');

  // Cache AI analysis text so switching tabs doesn't re-call the API
  const aiCacheRef = useRef<Record<string, string>>({});

  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-sm ${BG[report.overallLevel]}`}>

      {/* Hard Blocked Banner */}
      {report.isHardBlocked && (
        <div className="bg-red-700 text-white px-6 py-3 flex items-center gap-3">
          <span className="text-2xl">⛔</span>
          <div>
            <p className="font-bold text-sm">HARD BLOCKED — DO NOT APPLY</p>
            <p className="text-xs text-red-200 mt-0.5">This string is permanently ineligible. No amount of effort, legal action, or resources can change this outcome. Remove it from your candidate list.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`${HEADER_BG[report.overallLevel]} px-6 py-4 text-white`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-80">Candidate TLD</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${report.appType === 'brand' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80'}`}>
                {report.appType === 'brand' ? '.Brand' : 'Open Generic'}
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">.{report.normalized}</h2>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80 mb-1">Overall Risk Score</div>
            <div className="text-5xl font-black">{report.overallScore}</div>
            <div className="text-xs opacity-70">out of 100</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white/60 backdrop-blur">
        {(['overview', 'details', 'recommendations'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
              tab === t
                ? 'text-slate-900 border-b-2 border-slate-900 bg-white/80'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'overview' ? 'Overview' : t === 'details' ? 'Category Details' : 'Recommendations'}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-5">
            {/* AI Analysis — auto-runs on mount, cached on tab switch */}
            <AIAnalysisPanel
              report={report}
              cachedText={aiCacheRef.current[report.normalized] ?? ''}
              onCacheUpdate={(text) => { aiCacheRef.current[report.normalized] = text; }}
            />

            {/* Radar chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-600 mb-2">Risk Profile</h3>
              <RiskRadarChart categories={report.categories} />
            </div>

            {/* Top flags */}
            {report.topFlags.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-600 mb-3">Top Issues</h3>
                <div className="space-y-2">
                  {report.topFlags.map(flag => (
                    <div key={flag.code} className="flex items-start gap-2.5 text-sm">
                      <RiskBadge level={flag.severity} />
                      <span className="text-slate-700 flex-1">{flag.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar TLDs */}
            {report.similarTLDs.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-600 mb-3">Most Similar Existing TLDs</h3>
                <div className="space-y-1.5">
                  {report.similarTLDs.map(t => (
                    <div key={t.tld} className="flex items-center justify-between">
                      <span className="text-sm font-mono font-medium text-slate-700">.{t.tld}</span>
                      <div className="flex items-center gap-2 flex-1 mx-4">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-slate-400"
                            style={{ width: `${t.visualScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">{t.visualScore}%</span>
                        <span className="text-xs text-slate-400 capitalize">({t.type})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DETAILS TAB */}
        {tab === 'details' && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 mb-3">Click any category to expand details and guidebook references.</p>
            {report.categories.map(cat => (
              <RiskCategoryCard key={cat.category} cat={cat} />
            ))}
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {tab === 'recommendations' && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Action Items</h3>
              <ol className="space-y-3">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-slate-700 flex-1">{rec}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 text-xs text-slate-500">
              <strong className="text-slate-700">Disclaimer:</strong> This tool provides a preliminary risk assessment based on publicly available criteria from the ICANN 2026 Round Applicant Guidebook (V1-2025.12.16). It does not constitute legal advice or a definitive ICANN evaluation. Always engage qualified legal and technical counsel before submitting an application.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
