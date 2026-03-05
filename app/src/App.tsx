import { useState, useRef } from 'react';
import { assess, normalizeString } from './engine/assess';
import type { TLDRiskReport } from './engine/types';
import { RiskReport } from './components/RiskReport';
import { RiskBadge } from './components/RiskBadge';

const MAX_STRINGS = 5;

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
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
    const results = tags.map(t => assess(t, 'open'));
    setReports(results);
    setActiveReport(results[0].normalized);
    setLoading(false);
  }

  const activeReportData = reports.find(r => r.normalized === activeReport);

  return (
    <div className="min-h-screen bg-[#04101f]">

      {/* Header */}
      <header className="border-b border-[#0e2a4a]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <span className="font-mono text-sm font-bold tracking-[0.15em] text-white uppercase">TLD Checker</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-5">

        {/* Input form */}
        <section className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-6">

          {/* String input */}
          <div className="mb-5">
            <p className="text-[10px] font-mono font-bold text-[#7ab8e0] tracking-[0.2em] uppercase mb-3">TLD Strings</p>
            <div
              className="flex flex-wrap gap-2 px-3 py-2.5 border border-[#0e2a4a] rounded-lg focus-within:border-[#1a4a7a] transition-colors min-h-[48px] cursor-text bg-[#030c18]"
              onClick={() => inputRef.current?.focus()}
            >
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 bg-[#0a2040] text-[#c8e8ff] text-xs font-mono px-2.5 py-1 rounded">
                  .{tag}
                  <button
                    onClick={e => { e.stopPropagation(); removeTag(tag); }}
                    className="text-[#6a9ec0] hover:text-[#a0c8e8] leading-none text-sm"
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
                  className="flex-1 min-w-[160px] bg-transparent outline-none text-white text-sm placeholder-[#2a5070] font-mono"
                />
              )}
            </div>
            {error && <p className="text-[#ff453a] text-xs font-mono mt-2">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#4a88b8]">{tags.length}/{MAX_STRINGS} strings</span>
            <button
              onClick={runAssessment}
              disabled={loading || tags.length === 0}
              className="px-6 py-2.5 bg-white hover:bg-[#e0f0ff] disabled:bg-[#0a2040] disabled:text-[#4a7898] disabled:cursor-not-allowed text-[#04101f] font-bold rounded-lg transition-colors text-sm tracking-wide font-mono"
            >
              {loading ? 'Assessing...' : tags.length > 1 ? `Assess ${tags.length} Strings` : 'Assess Risk'}
            </button>
          </div>
        </section>

        {/* Multi-string selector */}
        {reports.length > 1 && (
          <div className="flex gap-px border border-[#0e2a4a] rounded-lg overflow-hidden bg-[#030c18]">
            {reports.map(r => (
              <button
                key={r.normalized}
                onClick={() => setActiveReport(r.normalized)}
                className={`flex-1 px-4 py-3 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeReport === r.normalized
                    ? 'bg-[#071830] text-white'
                    : 'text-[#6a9ec0] hover:text-[#a0c8e8] hover:bg-[#040e1a]'
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

      <footer className="mt-20 border-t border-[#081830] py-6 text-center">
        <p className="text-[11px] font-mono text-[#4a88b8] tracking-wider">TLD CHECKER · ICANN NEW GTLD PROGRAM 2026</p>
        <p className="text-[11px] font-mono text-[#1e3a58] mt-1">For internal use only · Preliminary assessment · Not legal advice</p>
      </footer>

    </div>
  );
}
