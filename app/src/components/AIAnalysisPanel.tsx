import { useState, useRef, useEffect } from 'react';
import type { TLDRiskReport } from '../engine/types';
import { streamAnalysis, computeVerdict } from '../lib/claude';

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

interface CompetitiveStats {
  applicants: string;
  budget: string;
  operators: string;
}

export type ObjectionSeverity = 'None' | 'Possible' | 'Likely' | 'High risk';

export interface ObjectionSignal {
  severity: ObjectionSeverity;
  reason: string;
}

export interface ObjectionSignals {
  gac: ObjectionSignal;
  lpi: ObjectionSignal;
  community: ObjectionSignal;
  lro: ObjectionSignal;
}

interface ParsedAnalysis {
  verdict: Verdict | null;
  recommendationBody: string;
  competitiveLandscape: string;
  competitiveStats: CompetitiveStats | null;
  objectionSignals: ObjectionSignals | null;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();
}

function parseSignal(line: string | undefined): ObjectionSignal {
  if (!line) return { severity: 'None', reason: '—' };
  const m = line.match(/^(None|Possible|Likely|High risk)\s*[—\-–]\s*(.+)$/i);
  if (m) {
    const sev = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
    return {
      severity: sev as ObjectionSeverity,
      reason: m[2].trim(),
    };
  }
  return { severity: 'None', reason: line };
}

function parseAnalysis(raw: string): ParsedAnalysis {
  const recMatch    = raw.match(/##\s*RECOMMENDATION\s*([\s\S]*?)(?=##\s*COMPETITIVE LANDSCAPE|$)/i);
  const compMatch   = raw.match(/##\s*COMPETITIVE LANDSCAPE\s*([\s\S]*?)(?=##\s*COMPETITIVE STATS|$)/i);
  const statsMatch  = raw.match(/##\s*COMPETITIVE STATS\s*([\s\S]*?)(?=##\s*OBJECTION SIGNALS|$)/i);
  const objMatch    = raw.match(/##\s*OBJECTION SIGNALS\s*([\s\S]*?)$/i);

  const recSection   = recMatch   ? recMatch[1].trim()   : '';
  const compSection  = compMatch  ? compMatch[1].trim()  : '';
  const statsSection = statsMatch ? statsMatch[1].trim() : '';
  const objSection   = objMatch   ? objMatch[1].trim()   : '';

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

  let competitiveStats: CompetitiveStats | null = null;
  if (statsSection) {
    const applicants = statsSection.match(/^APPLICANTS:\s*(.+)$/m)?.[1]?.trim();
    const budget     = statsSection.match(/^BUDGET:\s*(.+)$/m)?.[1]?.trim();
    const operators  = statsSection.match(/^OPERATORS:\s*(.+)$/m)?.[1]?.trim();
    if (applicants || budget || operators) {
      competitiveStats = {
        applicants: applicants ?? '—',
        budget:     budget     ?? '—',
        operators:  operators  ?? '—',
      };
    }
  }

  let objectionSignals: ObjectionSignals | null = null;
  if (objSection) {
    const gacLine  = objSection.match(/^GAC:\s*(.+)$/m)?.[1]?.trim();
    const lpiLine  = objSection.match(/^LPI:\s*(.+)$/m)?.[1]?.trim();
    const comLine  = objSection.match(/^COMMUNITY:\s*(.+)$/m)?.[1]?.trim();
    const lroLine  = objSection.match(/^LRO:\s*(.+)$/m)?.[1]?.trim();
    if (gacLine || lpiLine || comLine || lroLine) {
      objectionSignals = {
        gac:       parseSignal(gacLine),
        lpi:       parseSignal(lpiLine),
        community: parseSignal(comLine),
        lro:       parseSignal(lroLine),
      };
    }
  }

  return {
    verdict,
    recommendationBody: stripMarkdown(bodyLines),
    competitiveLandscape: stripMarkdown(compSection),
    competitiveStats,
    objectionSignals,
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
  onObjectionSignals?: (signals: ObjectionSignals) => void;
}

type GenState = 'generating' | 'done' | 'error';

export function AIAnalysisPanel({ report, cachedText, onCacheUpdate, onObjectionSignals }: Props) {
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

  useEffect(() => {
    if (genState !== 'done' || !onObjectionSignals) return;
    const parsed = parseAnalysis(displayText);
    if (parsed.objectionSignals) onObjectionSignals(parsed.objectionSignals);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genState]);

  if (!hasApiKey) {
    return (
      <div className="border border-dashed border-[#0e2a4a] rounded-lg px-5 py-6 text-center">
        <p className="text-sm font-mono text-[#6a9ec0]">AI analysis not configured</p>
        <p className="text-xs text-[#4a88b8] mt-1">
          Add <code className="font-mono text-[#70b8ff]">VITE_CLAUDE_API_KEY</code> in project settings → redeploy.
        </p>
      </div>
    );
  }

  if (genState === 'error') {
    return (
      <div className="bg-[#071830] border border-[#2e1a1a] rounded-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-mono font-semibold text-[#ff453a] mb-0.5">Analysis failed</p>
            <p className="text-xs text-[#b0c8e0]">{errorMsg}</p>
          </div>
          <button
            onClick={() => { startedRef.current = false; doGenerate(); }}
            className="flex-shrink-0 text-xs font-mono text-[#6a9ec0] hover:text-[#a0c8e8] border border-[#0e2a4a] hover:border-[#1a4a80] px-3 py-1.5 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading state for the entire generation phase — only render structured UI when done
  if (genState === 'generating') {
    return (
      <div className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex gap-1">
            {[0, 150, 300].map(delay => (
              <span key={delay} className="w-1.5 h-1.5 rounded-full bg-[#3a7ab8] animate-bounce" style={{ animationDelay: `${delay}ms` }} />
            ))}
          </span>
          <span className="text-xs font-mono text-[#7ab8e0]">Generating analysis for .{report.normalized}</span>
        </div>
      </div>
    );
  }

  const parsed = parseAnalysis(displayText);
  // Verdict is always derived from the engine — never from Claude's text
  const verdict = computeVerdict(report);
  const verdictStyle = VERDICT_STYLE[verdict];

  return (
    <div className="space-y-3">

      {/* Recommendation */}
      <div className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono font-bold text-[#7ab8e0] tracking-[0.2em] uppercase">AI Recommendation</span>
          <button onClick={() => { startedRef.current = false; doGenerate(); }} className="text-[11px] font-mono text-[#5a98c8] hover:text-[#90c8f0] transition-colors" title="Regenerate">↻ regenerate</button>
        </div>

        <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded border ${verdictStyle.border} mb-4`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${verdictStyle.dot}`} />
          <span className={`text-sm font-mono font-bold tracking-wider ${verdictStyle.text}`}>
            {verdict}
          </span>
        </div>

        {parsed.recommendationBody && (
          <p className="text-sm text-[#d8eeff] leading-relaxed">
            {parsed.recommendationBody}
          </p>
        )}
      </div>

      {/* Competitive Landscape */}
      {parsed.competitiveLandscape && (
        <div className="bg-[#071830] border border-[#0e2a4a] rounded-lg p-5">
          <h3 className="text-[10px] font-mono font-bold text-[#7ab8e0] tracking-[0.2em] uppercase mb-3">Competitive Landscape</h3>

          {/* Stat chips — AI-parsed when available, engine fallback while streaming */}
          {(() => {
            const contention = report.categories.find(c => c.category === 'STRING_CONTENTION');
            const primaryFlag = contention?.flags.find(f => f.stats && f.stats.length > 0);
            const engineScore = contention?.score ?? 0;

            const chips = parsed.competitiveStats
              ? [
                  { emoji: '👥', label: 'Expected applicants', value: parsed.competitiveStats.applicants },
                  { emoji: '💰', label: 'Auction reserve',     value: parsed.competitiveStats.budget },
                  { emoji: '🏢', label: 'Likely operators',    value: parsed.competitiveStats.operators },
                ]
              : primaryFlag?.stats ?? [
                  { emoji: '👥', label: 'Expected applicants', value: engineScore >= 40 ? '2–4 est.' : engineScore >= 15 ? '1–2 est.' : 'Likely uncontested' },
                  { emoji: '💰', label: 'Auction reserve',     value: engineScore >= 40 ? '$500K – $2M est.' : engineScore >= 15 ? '$100K – $500K est.' : 'No auction expected' },
                  { emoji: '🏢', label: 'Operator activity',   value: engineScore >= 40 ? 'Some operator interest' : 'Low operator interest' },
                ];

            return (
              <div className="flex flex-wrap gap-2 mb-4">
                {chips.map(stat => (
                  <div key={stat.label} className="flex-1 min-w-[90px] bg-[#030c18] border border-[#1a4a80] rounded-lg px-3 py-2.5">
                    <div className="text-base leading-none mb-1">{stat.emoji}</div>
                    <div className="text-[9px] font-mono text-[#6898d0] uppercase tracking-widest mb-0.5">{stat.label}</div>
                    <div className="text-xs font-mono font-bold text-[#c8e8f8] leading-snug">{stat.value}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          <p className="text-sm text-[#d8eeff] leading-relaxed">
            {parsed.competitiveLandscape}
          </p>
        </div>
      )}

      <p className="text-[11px] font-mono text-[#2a5880] px-1">
        AI-generated · Not legal advice · Consult qualified ICANN counsel before applying.
      </p>
    </div>
  );
}
