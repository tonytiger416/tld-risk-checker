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
    if (tags.length === 0) { setError('Enter at least one TLD string.'); return; }
    setLoading(true); setError(''); setReports([]); setActiveReport(null);
    await new Promise(r => setTimeout(r, 50));
    const results = tags.map(t => assess(t, appType));
    setReports(results);
    setActiveReport(results[0].normalized);
    setLoading(false);
  }

  const activeReportData = reports.find(r => r.normalized === activeReport);

  return (
    <div className="min-h-screen bg-[#0d1117]">

      {/* Header */}
      <header className="border-b border-[#21293d]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-baseline gap-4">
          <span className="font-mono text-sm font-bold tracking-[0.15em] text-[#e2e8f4] uppercase">TLD Risk Checker</span>
          <span className="text-xs font-mono text-[#4a566e] tracking-wider">ICANN 2026 · Applicant Guidebook V1</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-5">

        {/* Input form */}
        <section className="bg-[#161b28] border border-[#21293d] rounded-lg p-6">

          {/* Application type */}
          <div className="mb-6">
            <p className="text-[10px] font-mono font-bold text-[#5c698a] tracking-[0.2em] uppercase mb-3">Application Type</p>
            <div className="flex gap-2">
              {(['open', 'brand'] as AppType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setAppType(t)}
                  className={`flex-1 py-2.5 px-4 rounded-lg border text-left transition-all ${
                    appType === t
                      ? 'border-[#e2e8f4] bg-[#e2e8f4] text-[#0d1117]'
                      : 'border-[#21293d] text-[#6b7898] hover:border-[#2e3a52] hover:text-[#8a95b5]'
                  }`}
                >
                  <div className="text-sm font-semibold">{t === 'open' ? 'Open Generic' : '.Brand TLD'}</div>
                  <div className={`text-xs mt-0.5 font-mono ${appType === t ? 'text-[#4a566e]' : 'text-[#3a4560]'}`}>
                    {t === 'open' ? '.shop, .cloud — open registration' : '.yourcompany — single registrant'}
                  </div>
                </button>
              ))}
            </div>
            {appType === 'brand' && (
              <p className="text-xs font-mono text-[#6b7898] border-l border-[#2e3a52] pl-3 py-1 mt-3">
                Trademark scoring adjusted for rights holder. All other checks apply in full.
              </p>
            )}
          </div>

          {/* String input */}
          <div className="mb-5">
            <p className="text-[10px] font-mono font-bold text-[#5c698a] tracking-[0.2em] uppercase mb-3">Strings</p>
            <div
              className="flex flex-wrap gap-2 px-3 py-2.5 border border-[#21293d] rounded-lg focus-within:border-[#3a4a7a] transition-colors min-h-[48px] cursor-text bg-[#0d1117]"
              onClick={() => inputRef.current?.focus()}
            >
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 bg-[#1e2840] text-[#d0daea] text-xs font-mono px-2.5 py-1 rounded">
                  .{tag}
                  <button
                    onClick={e => { e.stopPropagation(); removeTag(tag); }}
                    className="text-[#5c698a] hover:text-[#9ba8c0] leading-none text-sm"
                    aria-label={`Remove .${tag}`}
                  >×</button>
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
                  placeholder={tags.length === 0 ? 'shop, cloud, registry...' : ''}
                  className="flex-1 min-w-[160px] bg-transparent outline-none text-[#e2e8f4] text-sm placeholder-[#2e3a52] font-mono"
                />
              )}
            </div>
            {error && <p className="text-[#ff453a] text-xs font-mono mt-2">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#3a4560]">{tags.length}/{MAX_STRINGS} strings</span>
            <button
              onClick={runAssessment}
              disabled={loading || tags.length === 0}
              className="px-6 py-2.5 bg-[#e2e8f4] hover:bg-white disabled:bg-[#1e2840] disabled:text-[#3a4560] disabled:cursor-not-allowed text-[#0d1117] font-bold rounded-lg transition-colors text-sm tracking-wide font-mono"
            >
              {loading ? 'Assessing...' : tags.length > 1 ? `Assess ${tags.length} Strings` : 'Assess Risk'}
            </button>
          </div>
        </section>

        {/* Multi-string selector */}
        {reports.length > 1 && (
          <div className="flex gap-px border border-[#21293d] rounded-lg overflow-hidden bg-[#0d1117]">
            {reports.map(r => (
              <button
                key={r.normalized}
                onClick={() => setActiveReport(r.normalized)}
                className={`flex-1 px-4 py-3 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeReport === r.normalized
                    ? 'bg-[#161b28] text-[#e2e8f4]'
                    : 'text-[#5c698a] hover:text-[#8a95b5] hover:bg-[#131820]'
                }`}
              >
                <span>.{r.normalized}</span>
                {r.isHardBlocked
                  ? <span className="text-[#ff453a]">BLOCKED</span>
                  : <RiskBadge level={r.applicationRiskLevel} />
                }
              </button>
            ))}
          </div>
        )}

        {/* Active report */}
        {activeReportData && <RiskReport report={activeReportData} />}

      </main>

      <footer className="mt-20 border-t border-[#1a2030] py-6 text-center">
        <p className="text-[11px] font-mono text-[#3a4560] tracking-wider">TLD RISK CHECKER · ICANN NEW GTLD PROGRAM 2026 · AGB V1-2025.12.16</p>
        <p className="text-[11px] font-mono text-[#21293d] mt-1">For internal use only · Preliminary assessment · Not legal advice</p>
      </footer>

    </div>
  );
}
