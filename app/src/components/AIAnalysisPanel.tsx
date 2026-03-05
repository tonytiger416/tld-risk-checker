import { useState, useRef, useEffect } from 'react';
import type { TLDRiskReport } from '../engine/types';
import { streamAnalysis } from '../lib/claude';

// ---------------------------------------------------------------------------
// Verdict configuration — colours for each possible verdict
// ---------------------------------------------------------------------------
type Verdict =
  | 'STRONG APPLY'
  | 'APPLY WITH STRATEGY'
  | 'HIGH RISK – PROCEED WITH CAUTION'
  | 'DO NOT APPLY';

const VERDICT_STYLE: Record<Verdict, { bg: string; border: string; text: string; dot: string }> = {
  'STRONG APPLY': {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  'APPLY WITH STRATEGY': {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  'HIGH RISK – PROCEED WITH CAUTION': {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  'DO NOT APPLY': {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
};

const KNOWN_VERDICTS = Object.keys(VERDICT_STYLE) as Verdict[];

// Citation type → badge colour
const CITATION_BADGE: Record<string, string> = {
  AGB:   'bg-indigo-100 text-indigo-700 border-indigo-200',   // Guidebook
  PREC:  'bg-purple-100 text-purple-700 border-purple-200',   // 2012 precedents
  ICANN: 'bg-blue-100   text-blue-700   border-blue-200',     // Board resolutions
  GAC:   'bg-amber-100  text-amber-700  border-amber-200',    // GAC communiqués
  RFC:   'bg-green-100  text-green-700  border-green-200',    // Technical RFCs
};
// Human-readable label for each citation type badge
const CITATION_LABEL: Record<string, string> = {
  AGB:   'Guidebook',
  PREC:  '2012 Round',
  ICANN: 'ICANN Board',
  GAC:   'GAC',
  RFC:   'RFC',
};

// ---------------------------------------------------------------------------
// Parse the streamed text into sections once generation is complete
// ---------------------------------------------------------------------------
interface CitationItem {
  type: string;   // e.g. 'AGB', 'PREC', 'ICANN', 'GAC', 'RFC'
  text: string;
}

interface ParsedAnalysis {
  verdict: Verdict | null;
  recommendationBody: string;
  citations: CitationItem[];
  competitiveLandscape: string;
}

// Strip markdown bold/italic asterisks from plain text display
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

  // Search through first 5 lines for a verdict — Claude sometimes adds preamble
  const lines = recSection.split('\n');
  let verdict: Verdict | null = null;
  let verdictLineIdx = -1;

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const upper = lines[i].trim().toUpperCase();
    const found = KNOWN_VERDICTS.find(v => upper === v);
    if (found) {
      verdict = found;
      verdictLineIdx = i;
      break;
    }
  }

  // Body is everything after the verdict line (or the whole section if no verdict found)
  const bodyLines = verdictLineIdx >= 0
    ? lines.slice(verdictLineIdx + 1).join('\n').trim()
    : recSection;

  // Parse citation lines: "[CODE] description" → { type, text }
  const citations: CitationItem[] = citSection
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
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

// ---------------------------------------------------------------------------
// Human-readable error messages
// ---------------------------------------------------------------------------
function friendlyError(err: Error): string {
  const msg = err.message;
  if (msg === 'NO_KEY') return 'AI analysis is not configured. Add VITE_CLAUDE_API_KEY in Vercel project settings.';
  if (msg.includes('401') || msg.includes('authentication')) return 'Invalid API key. Check VITE_CLAUDE_API_KEY in Vercel.';
  if (msg.includes('429') || msg.includes('rate')) return 'Rate limit reached — wait a moment and try again.';
  if (msg.includes('529') || msg.includes('overload')) return 'Claude is temporarily busy. Try again in a few seconds.';
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) return 'Network error — check your internet connection.';
  return `Error: ${msg}`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
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
  // Prevent double-invocation in React StrictMode
  const startedRef = useRef(false);

  async function doGenerate() {
    setGenState('generating');
    setDisplayText('');
    setErrorMsg('');
    accumulatedRef.current = '';

    await streamAnalysis(
      report,
      (chunk) => {
        accumulatedRef.current += chunk;
        setDisplayText(accumulatedRef.current);
      },
      () => {
        onCacheUpdate(accumulatedRef.current);
        setGenState('done');
      },
      (err) => {
        setErrorMsg(friendlyError(err));
        setGenState('error');
      },
    );
  }

  // Auto-trigger on mount when there is no cached result
  useEffect(() => {
    if (cachedText) return;          // already have a result — show it
    if (!hasApiKey) return;          // nothing we can do without a key
    if (startedRef.current) return;  // already started (StrictMode guard)
    startedRef.current = true;
    doGenerate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- No API key configured ----
  if (!hasApiKey) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 px-5 py-6 text-center">
        <p className="text-sm font-semibold text-slate-600">AI analysis not configured</p>
        <p className="text-xs text-slate-400 mt-1">
          Add <code className="bg-slate-100 px-1 rounded">VITE_CLAUDE_API_KEY</code> in Vercel → Project Settings → Environment Variables, then redeploy.
        </p>
      </div>
    );
  }

  // ---- Generating — live streaming text ----
  if (genState === 'generating') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="text-xs text-slate-500 font-medium">Generating AI analysis for .{report.normalized}…</span>
        </div>
        {displayText && (
          <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 rounded-lg p-3 min-h-[80px]">
            {displayText}
            <span className="inline-block w-0.5 h-3.5 bg-slate-400 ml-0.5 animate-pulse align-text-bottom" />
          </div>
        )}
      </div>
    );
  }

  // ---- Error ----
  if (genState === 'error') {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-red-700 mb-0.5">AI analysis failed</p>
            <p className="text-xs text-slate-500">{errorMsg}</p>
          </div>
          <button
            onClick={() => { startedRef.current = false; doGenerate(); }}
            className="flex-shrink-0 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ---- Done — structured output ----
  const parsed = parseAnalysis(displayText);
  const verdictStyle = parsed.verdict ? VERDICT_STYLE[parsed.verdict] : null;

  return (
    <div className="space-y-3">
      {/* Recommendation */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">AI Recommendation</h3>
          <button
            onClick={() => { startedRef.current = false; doGenerate(); }}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            title="Regenerate"
          >
            ↻ Regenerate
          </button>
        </div>

        {parsed.verdict && verdictStyle ? (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold mb-3 ${verdictStyle.bg} ${verdictStyle.border} ${verdictStyle.text}`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${verdictStyle.dot}`} />
            {parsed.verdict}
          </div>
        ) : null}

        {parsed.recommendationBody && (
          <p className="text-sm text-slate-700 leading-relaxed">{parsed.recommendationBody}</p>
        )}
      </div>

      {/* Sources & Precedents */}
      {parsed.citations.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Sources &amp; Precedents</h3>
          <ul className="space-y-2">
            {parsed.citations.map((c, i) => {
              const badgeClass = CITATION_BADGE[c.type] ?? 'bg-slate-100 text-slate-600 border-slate-200';
              const label      = CITATION_LABEL[c.type] ?? c.type;
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className={`flex-shrink-0 mt-0.5 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeClass}`}>
                    {label}
                  </span>
                  <span className="text-slate-600 leading-snug">{c.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Competitive Landscape */}
      {parsed.competitiveLandscape && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Competitive Landscape</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{parsed.competitiveLandscape}</p>
        </div>
      )}

      {/* Fallback: raw text if parsing found nothing */}
      {!parsed.verdict && !parsed.recommendationBody && !parsed.citations.length && !parsed.competitiveLandscape && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {displayText}
        </div>
      )}

      <p className="text-xs text-slate-400 px-1">
        ✨ AI-generated analysis · Not legal advice · Always consult qualified ICANN counsel before applying.
      </p>
    </div>
  );
}
