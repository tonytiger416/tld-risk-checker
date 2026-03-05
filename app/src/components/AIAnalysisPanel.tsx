import { useState, useRef, useEffect } from 'react';
import type { TLDRiskReport } from '../engine/types';
import { streamAnalysis } from '../lib/claude';

type Verdict =
  | 'STRONG APPLY'
  | 'APPLY WITH STRATEGY'
  | 'HIGH RISK – PROCEED WITH CAUTION'
  | 'DO NOT APPLY';

const VERDICT_STYLE: Record<Verdict, { border: string; text: string; dot: string }> = {
  'STRONG APPLY':                    { border: 'border-[#32d74b]', text: 'text-[#32d74b]', dot: 'bg-[#32d74b]' },
  'APPLY WITH STRATEGY':             { border: 'border-[#0a84ff]', text: 'text-[#0a84ff]', dot: 'bg-[#0a84ff]' },
  'HIGH RISK – PROCEED WITH CAUTION':{ border: 'border-[#ff9f0a]', text: 'text-[#ff9f0a]', dot: 'bg-[#ff9f0a]' },
  'DO NOT APPLY':                    { border: 'border-[#ff453a]', text: 'text-[#ff453a]', dot: 'bg-[#ff453a]' },
};

const KNOWN_VERDICTS = Object.keys(VERDICT_STYLE) as Verdict[];

const CITATION_BADGE: Record<string, string> = {
  AGB:   'border-[#1a3a7a] text-[#6a90e5]',
  PREC:  'border-[#2a1a60] text-[#9070d5]',
  ICANN: 'border-[#103060] text-[#5a98e5]',
  GAC:   'border-[#4e3e1e] text-[#c89030]',
  RFC:   'border-[#1a4030] text-[#40b860]',
};

const CITATION_LABEL: Record<string, string> = {
  AGB:   'Guidebook',
  PREC:  '2012 Round',
  ICANN: 'ICANN Board',
  GAC:   'GAC',
  RFC:   'RFC',
};

interface CitationItem { type: string; text: string; }

interface ParsedAnalysis {
  verdict: Verdict | null;
  recommendationBody: string;
  citations: CitationItem[];
  competitiveLandscape: string;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();
}

function parseAnalysis(raw: string): ParsedAnalysis {
  const recMatch  = raw.match(/##\s*RECOMMENDATION\s*([\s\S]*?)(?=##\s*CITATIONS|##\s*COMPETITIVE LANDSCAPE|$)/i);
  const citMatch  = raw.match(/##\s*CITATIONS\s*([\s\S]*?)(?=##\s*COMPETITIVE LANDSCAPE|$)/i);
  const compMatch = raw.match(/##\s*COMPETITIVE LANDSCAPE\s*([\s\S]*?)$/i);

  const recSection  = recMatch  ? recMatch[1].trim()  : '';
  const citSection  = citMatch  ? citMatch[1].trim()  : '';
  const compSection = compMatch ? compMatch[1].trim() : '';

  const lines = recSection.split('\n');
  let verdict: Verdict | null = null;
  let verdictLineIdx = -1;

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const upper = lines[i].trim().toUpperCase();
    const found = KNOWN_VERDICTS.find(v => upper === v);
    if (found) { verdict = found; verdictLineIdx = i; break; }
  }

  const bodyLines = verdictLineIdx >= 0
    ? lines.slice(verdictLineIdx + 1).join('\n').trim()
    : recSection;

  const citations: CitationItem[] = citSection
    .split('\n').map(l => l.trim()).filter(Boolean)
    .map(line => {
      const m = line.match(/^\[([A-Z]+)\]\s+(.+)$/);
      if (m) return { type: m[1], text: m[2] };
      return { type: '–', text: line };
    })
    .filter(c => c.text.length > 0);

  return {
    verdict,
    recommendationBody: stripMarkdown(bodyLines),
    citations,
    competitiveLandscape: stripMarkdown(compSection),
  };
}

function friendlyError(err: Error): string {
  const msg = err.message;
  if (msg === 'NO_KEY') return 'AI analysis not configured — add VITE_CLAUDE_API_KEY in project settings.';
  if (msg.includes('401') || msg.includes('authentication')) return 'Invalid API key.';
  if (msg.includes('429') || msg.includes('rate')) return 'Rate limit — wait a moment and retry.';
  if (msg.includes('529') || msg.includes('overload')) return 'Claude is busy — retry in a few seconds.';
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) return 'Network error.';
  return `Error: ${msg}`;
}

interface Props {
  report: TLDRiskReport;
  cachedText: string;
  onCacheUpdate: (text: string) => void;
}

type GenState = 'generating' | 'done' | 'error';

export function AIAnalysisPanel({ report, cachedText, onCacheUpdate }: Props) {
  const hasApiKey = !!(import.meta.env.VITE_CLAUDE_API_KEY as string | undefined);

  const [genState, setGenState] = useState<GenState>(cachedText ? 'done' : 'generating');
  const [displayText, setDisplayText] = useState(cachedText);
  const [errorMsg, setErrorMsg] = useState('');
  const accumulatedRef = useRef('');
  const startedRef = useRef(false);

  async function doGenerate() {
    setGenState('generating');
    setDisplayText('');
    setErrorMsg('');
    accumulatedRef.current = '';

    await streamAnalysis(
      report,
      (chunk) => { accumulatedRef.current += chunk; setDisplayText(accumulatedRef.current); },
      () => { onCacheUpdate(accumulatedRef.current); setGenState('done'); },
      (err) => { setErrorMsg(friendlyError(err)); setGenState('error'); },
    );
  }

  useEffect(() => {
    if (cachedText) return;
    if (!hasApiKey) return;
    if (startedRef.current) return;
    startedRef.current = true;
    doGenerate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasApiKey) {
    return (
      <div className="border border-dashed border-[#0e2a4a] rounded-lg px-5 py-6 text-center">
        <p className="text-sm font-mono text-[#2e5570]">AI analysis not configured</p>
        <p className="text-xs text-[#1e3a58] mt-1">
          Add <code className="font-mono text-[#5a88cc]">VITE_CLAUDE_API_KEY</code> in project settings → redeploy.
        </p>
      </div>
    );
  }

  if (genState === 'generating') {
    return (
      <div className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="inline-flex gap-1">
            {[0, 150, 300].map(delay => (
              <span key={delay} className="w-1.5 h-1.5 rounded-full bg-[#2a5888] animate-bounce" style={{ animationDelay: `${delay}ms` }} />
            ))}
          </span>
          <span className="text-xs font-mono text-[#3a6888]">Generating analysis for .{report.normalized}</span>
        </div>
        {displayText && (
          <div className="text-xs text-[#7aaabe] leading-relaxed whitespace-pre-wrap font-mono bg-[#030c18] rounded p-3 min-h-[80px]">
            {displayText}
            <span className="inline-block w-0.5 h-3.5 bg-[#2a5888] ml-0.5 animate-pulse align-text-bottom" />
          </div>
        )}
      </div>
    );
  }

  if (genState === 'error') {
    return (
      <div className="bg-[#071830] border border-[#2e1a1a] rounded-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-mono font-semibold text-[#ff453a] mb-0.5">Analysis failed</p>
            <p className="text-xs text-[#88a8c0]">{errorMsg}</p>
          </div>
          <button
            onClick={() => { startedRef.current = false; doGenerate(); }}
            className="flex-shrink-0 text-xs font-mono text-[#3a6888] hover:text-[#6a92b5] border border-[#0e2a4a] hover:border-[#1a3a60] px-3 py-1.5 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const parsed = parseAnalysis(displayText);
  const verdictStyle = parsed.verdict ? VERDICT_STYLE[parsed.verdict] : null;

  return (
    <div className="space-y-3">

      {/* Recommendation */}
      <div className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono font-bold text-[#3a6888] tracking-[0.2em] uppercase">AI Recommendation</span>
          <button
            onClick={() => { startedRef.current = false; doGenerate(); }}
            className="text-[11px] font-mono text-[#2e5570] hover:text-[#4a7898] transition-colors"
            title="Regenerate"
          >
            ↻ regenerate
          </button>
        </div>

        {parsed.verdict && verdictStyle && (
          <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded border ${verdictStyle.border} mb-4`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${verdictStyle.dot}`} />
            <span className={`text-sm font-mono font-bold tracking-wider ${verdictStyle.text}`}>
              {parsed.verdict}
            </span>
          </div>
        )}

        {parsed.recommendationBody && (
          <p className="text-sm text-[#b0cde8] leading-relaxed">{parsed.recommendationBody}</p>
        )}
      </div>

      {/* Sources */}
      {parsed.citations.length > 0 && (
        <div className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-5">
          <h3 className="text-[10px] font-mono font-bold text-[#3a6888] tracking-[0.2em] uppercase mb-3">Sources &amp; Precedents</h3>
          <ul className="space-y-2.5">
            {parsed.citations.map((c, i) => {
              const badgeClass = CITATION_BADGE[c.type] ?? 'border-[#0e2a4a] text-[#3a6888]';
              const label      = CITATION_LABEL[c.type] ?? c.type;
              return (
                <li key={i} className="flex items-start gap-2.5">
                  <span className={`flex-shrink-0 mt-0.5 inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeClass}`}>
                    {label}
                  </span>
                  <span className="text-xs text-[#90b5d0] leading-snug">{c.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Competitive Landscape */}
      {parsed.competitiveLandscape && (
        <div className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-5">
          <h3 className="text-[10px] font-mono font-bold text-[#3a6888] tracking-[0.2em] uppercase mb-3">Competitive Landscape</h3>
          <p className="text-sm text-[#b0cde8] leading-relaxed">{parsed.competitiveLandscape}</p>
        </div>
      )}

      {/* Fallback */}
      {!parsed.verdict && !parsed.recommendationBody && !parsed.citations.length && !parsed.competitiveLandscape && (
        <div className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-5 text-sm text-[#7aaabe] leading-relaxed whitespace-pre-wrap font-mono">
          {displayText}
        </div>
      )}

      <p className="text-[11px] font-mono text-[#1e3a58] px-1">
        AI-generated · Not legal advice · Consult qualified ICANN counsel before applying.
      </p>
    </div>
  );
}
