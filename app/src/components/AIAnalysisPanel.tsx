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

// ---------------------------------------------------------------------------
// Parse the streamed text into sections once generation is complete
// ---------------------------------------------------------------------------
interface ParsedAnalysis {
  verdict: Verdict | null;
  recommendationBody: string;
  competitiveLandscape: string;
}

function parseAnalysis(raw: string): ParsedAnalysis {
  // Split on ## headings
  const recMatch = raw.match(/##\s*RECOMMENDATION\s*([\s\S]*?)(?=##\s*COMPETITIVE LANDSCAPE|$)/i);
  const compMatch = raw.match(/##\s*COMPETITIVE LANDSCAPE\s*([\s\S]*?)$/i);

  const recSection = recMatch ? recMatch[1].trim() : '';
  const compSection = compMatch ? compMatch[1].trim() : '';

  // Extract verdict from first line of recommendation section
  const firstLine = recSection.split('\n')[0].trim().toUpperCase();
  const verdict = KNOWN_VERDICTS.find(v => firstLine.startsWith(v)) ?? null;

  // Body is everything after the first line
  const bodyLines = recSection.split('\n').slice(1).join('\n').trim();

  return {
    verdict,
    recommendationBody: bodyLines,
    competitiveLandscape: compSection,
  };
}

// ---------------------------------------------------------------------------
// Human-readable error messages
// ---------------------------------------------------------------------------
function friendlyError(err: Error): string {
  const msg = err.message;
  if (msg === 'NO_KEY') return 'AI analysis is not configured for this deployment. Contact your administrator.';
  if (msg.includes('401') || msg.includes('authentication')) return 'Invalid API key. Check the VITE_CLAUDE_API_KEY setting in Vercel.';
  if (msg.includes('429') || msg.includes('rate')) return 'Rate limit reached — wait a moment and try again.';
  if (msg.includes('529') || msg.includes('overload')) return 'Claude is temporarily busy. Try again in a few seconds.';
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) return 'Network error — check your internet connection and try again.';
  return `Unexpected error: ${msg}`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface Props {
  report: TLDRiskReport;
  cachedText: string;
  onCacheUpdate: (text: string) => void;
}

type GenState = 'idle' | 'generating' | 'done' | 'error';

export function AIAnalysisPanel({ report, cachedText, onCacheUpdate }: Props) {
  const hasApiKey = !!(import.meta.env.VITE_CLAUDE_API_KEY as string | undefined);

  // Initialise from cache if available
  const [genState, setGenState] = useState<GenState>(cachedText ? 'done' : 'idle');
  const [displayText, setDisplayText] = useState(cachedText);
  const [errorMsg, setErrorMsg] = useState('');
  const accumulatedRef = useRef('');

  // When the report changes (new assessment), reset if the cache is empty
  useEffect(() => {
    if (!cachedText) {
      setGenState('idle');
      setDisplayText('');
      setErrorMsg('');
      accumulatedRef.current = '';
    }
  }, [report.normalized, cachedText]);

  async function handleGenerate() {
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

  // ---- No API key configured ----
  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3">🔑</div>
        <p className="text-sm font-semibold text-slate-700">AI analysis is not configured</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Add a <code className="bg-slate-100 px-1 rounded">VITE_CLAUDE_API_KEY</code> environment variable in your Vercel project settings and redeploy.
        </p>
      </div>
    );
  }

  // ---- Idle — ready to generate ----
  if (genState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="text-4xl mb-3">✨</div>
        <p className="text-sm font-semibold text-slate-700 mb-1">AI-powered strategic analysis</p>
        <p className="text-xs text-slate-500 mb-5 max-w-xs">
          Claude will synthesise all {report.categories.length} risk categories and give you a clear apply recommendation and competitive outlook.
        </p>
        <button
          onClick={handleGenerate}
          className="px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#2a4a73] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Generate AI Analysis
        </button>
      </div>
    );
  }

  // ---- Error ----
  if (genState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-sm font-semibold text-red-700 mb-1">Analysis failed</p>
        <p className="text-xs text-slate-500 mb-5 max-w-xs">{errorMsg}</p>
        <button
          onClick={handleGenerate}
          className="px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#2a4a73] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ---- Generating — show raw streaming text ----
  if (genState === 'generating') {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="text-xs text-slate-500 font-medium">Analysing .{report.normalized}…</span>
        </div>
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-xs min-h-[120px]">
          {displayText}
          <span className="inline-block w-0.5 h-4 bg-slate-500 ml-0.5 animate-pulse align-text-bottom" />
        </div>
      </div>
    );
  }

  // ---- Done — parse and display structured output ----
  const parsed = parseAnalysis(displayText);
  const verdictStyle = parsed.verdict ? VERDICT_STYLE[parsed.verdict] : null;

  return (
    <div className="space-y-4">
      {/* Recommendation section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Recommendation</h3>

        {parsed.verdict && verdictStyle ? (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold mb-3 ${verdictStyle.bg} ${verdictStyle.border} ${verdictStyle.text}`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${verdictStyle.dot}`} />
            {parsed.verdict}
          </div>
        ) : null}

        {parsed.recommendationBody ? (
          <p className="text-sm text-slate-700 leading-relaxed">{parsed.recommendationBody}</p>
        ) : (
          <p className="text-sm text-slate-500 italic">No reasoning provided.</p>
        )}
      </div>

      {/* Competitive landscape section */}
      {parsed.competitiveLandscape && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Competitive Landscape</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{parsed.competitiveLandscape}</p>
        </div>
      )}

      {/* Fallback: show raw text if parsing produced nothing */}
      {!parsed.verdict && !parsed.recommendationBody && !parsed.competitiveLandscape && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {displayText}
        </div>
      )}

      {/* Regenerate button */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          ↻ Regenerate
        </button>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500">
        <strong className="text-slate-600">AI Disclaimer:</strong> This analysis is generated by Claude and synthesises the automated risk assessment above. It does not constitute legal advice. Always engage qualified ICANN counsel before submitting an application.
      </div>
    </div>
  );
}
