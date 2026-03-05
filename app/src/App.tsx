import { useState, useRef } from 'react';
import { assess, normalizeString } from './engine/assess';
import type { TLDRiskReport, AppType } from './engine/types';
import { RiskReport } from './components/RiskReport';
import { RiskBadge } from './components/RiskBadge';

const MAX_STRINGS = 5;

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [appType, setAppType] = useState<AppType>('open');
  const [reports, setReports] = useState<TLDRiskReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const parts = raw.split(/[\s,\n]+/).map(s => s.trim().replace(/^\.+/, '').toLowerCase()).filter(Boolean);
    const newTags: string[] = [];
    for (const part of parts) {
      if (!part) continue;
      if (tags.length + newTags.length >= MAX_STRINGS) {
        setError(`Maximum ${MAX_STRINGS} strings allowed per assessment.`);
        break;
      }
      if (tags.includes(part) || newTags.includes(part)) continue;
      newTags.push(part);
    }
    if (newTags.length > 0) { setTags(prev => [...prev, ...newTags]); setError(''); }
    setInputValue('');
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag));
    setReports(prev => prev.filter(r => r.normalized !== normalizeString(tag)));
    if (activeReport === normalizeString(tag)) setActiveReport(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && inputValue.trim()) {
      e.preventDefault(); addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) removeTag(tags[tags.length - 1]);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault(); addTag(e.clipboardData.getData('text'));
  }

  async function runAssessment() {
    if (tags.length === 0) { setError('Please enter at least one TLD string.'); return; }
    setLoading(true); setError(''); setReports([]); setActiveReport(null);
    await new Promise(r => setTimeout(r, 50));
    const results = tags.map(t => assess(t, appType));
    setReports(results);
    setActiveReport(results[0].normalized);
    setLoading(false);
  }

  const activeReportData = reports.find(r => r.normalized === activeReport);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#1e3a5f] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TLD Risk Checker</h1>
            <p className="text-blue-200 text-sm mt-0.5">ICANN 2026 Round — Applicant Guidebook Risk Assessment</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Assess Candidate TLD Strings</h2>
          <p className="text-sm text-slate-500 mb-5">
            Type a string and press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono border">Enter</kbd> or comma to add. Up to {MAX_STRINGS} strings. Do not include the leading dot.
          </p>

          {/* Application Type */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Application Type</label>
            <div className="flex gap-3">
              {(['open', 'brand'] as AppType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setAppType(t)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                    appType === t ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="font-bold">{t === 'open' ? 'Open Generic TLD' : '.Brand TLD'}</div>
                  <div className={`text-xs mt-0.5 ${appType === t ? 'text-blue-200' : 'text-slate-400'}`}>
                    {t === 'open' ? 'e.g. .shop, .cloud — open registration' : 'e.g. .yourcompany — single registrant'}
                  </div>
                </button>
              ))}
            </div>
            {appType === 'brand' && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                <strong>.Brand mode:</strong> Trademark scoring is adjusted assuming you are the rights holder. All other checks — IGO protections, geographic names, DNS collision — apply in full.
              </p>
            )}
          </div>

          {/* Tag input */}
          <div
            className="flex flex-wrap gap-2 p-3 border-2 border-slate-200 rounded-xl focus-within:border-[#1e3a5f] transition-colors min-h-[56px] cursor-text bg-slate-50"
            onClick={() => inputRef.current?.focus()}
          >
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-[#1e3a5f] text-white text-sm font-semibold rounded-lg px-3 py-1">
                .{tag}
                <button onClick={e => { e.stopPropagation(); removeTag(tag); }} className="ml-1 text-white/60 hover:text-white leading-none text-base" aria-label={`Remove .${tag}`}>×</button>
              </span>
            ))}
            {tags.length < MAX_STRINGS && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onBlur={() => inputValue.trim() && addTag(inputValue)}
                placeholder={tags.length === 0 ? 'e.g. shop, cloud, registry ...' : ''}
                className="flex-1 min-w-[160px] bg-transparent outline-none text-slate-800 text-sm placeholder-slate-400"
              />
            )}
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-slate-400">{tags.length}/{MAX_STRINGS} strings · {appType === 'brand' ? '.Brand' : 'Open Generic'}</span>
            <button
              onClick={runAssessment}
              disabled={loading || tags.length === 0}
              className="px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#2a4a73] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {loading ? 'Assessing...' : `Assess Risk${tags.length > 1 ? ` (${tags.length} strings)` : ''}`}
            </button>
          </div>
        </section>

        {reports.length > 0 && (
          <section className="space-y-5">
            {reports.length > 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <h2 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">Assessment Summary</h2>
                <div className="flex flex-wrap gap-2">
                  {reports.map(r => (
                    <button
                      key={r.normalized}
                      onClick={() => setActiveReport(r.normalized)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-semibold ${
                        activeReport === r.normalized ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white shadow' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>.{r.normalized}</span>
                      {r.isHardBlocked
                        ? <span className="text-xs bg-red-600 text-white rounded px-1.5 py-0.5 font-bold tracking-wide">⛔ BLOCKED</span>
                        : <RiskBadge level={r.applicationRiskLevel} />
                      }
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeReportData && <RiskReport report={activeReportData} />}
          </section>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>TLD Risk Checker · ICANN New gTLD Program: 2026 Round Applicant Guidebook (V1-2025.12.16)</p>
        <p className="mt-1">For internal use only. Preliminary assessment only — not legal advice or an official ICANN evaluation.</p>
      </footer>
    </div>
  );
}
