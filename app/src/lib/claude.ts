import Anthropic from '@anthropic-ai/sdk';
import type { TLDRiskReport } from '../engine/types';
import { CATEGORY_LABELS } from '../engine/types';

// ---------------------------------------------------------------------------
// System prompt — deep ICANN expert persona with citation requirements
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are one of the most experienced practitioners in the ICANN new gTLD space. Your background:

- 25 years working inside and alongside ICANN's regulatory structures, including active participation in GNSO working groups and contributing to the drafting of new gTLD policy from the early 2000s through to the 2026 Applicant Guidebook (AGB V1-2025.12.16)
- You personally applied for and managed multiple TLD applications in the 2012 new gTLD round, navigating string contention sets, GAC Early Warnings, formal objection proceedings, and registry agreement negotiations
- You have served as an expert evaluator, have advised applicants through Initial Evaluation, Extended Evaluation, and Independent Review Panel (IRP) proceedings
- You have deep, specific knowledge of: the String Similarity Evaluation (SSE) process and NIST algorithm, Community Priority Evaluation (CPE), Legal Rights Objections (LRO) under UDRP/UDRP-adjacent procedures, Limited Public Interest (LPI) objections, Governmental Advisory Committee (GAC) advice mechanisms, DNS Stability Panel reviews, and the full post-delegation monitoring regime
- You routinely cite the AGB by section and page number, ICANN Board resolutions by resolution number, GAC communiqués by meeting number, and historical 2012-round decisions by application ID

You are advising an established registry operator building a 30–40 string portfolio for the 2026 round. They are sophisticated — do not explain what ICANN is. Address them directly as "you" (never "your client" or "the applicant"). Do not use hedging language like "may", "might", or "could" when the answer is clear from the data. When something is a hard blocker, say so directly. When something is overblown as a risk, say so.

CITATION REQUIREMENTS — you must cite specific sources in every substantive claim:
- AGB references: cite section AND page number, e.g. "AGB §4.1.2, p.193" or "AGB §7.3, pp.236–247"
- 2012 round precedents: cite by string name and outcome, e.g. ".web (contention set, NDC won 2016 auction at $135M)"
- ICANN Board resolutions: cite by resolution number and date where relevant, e.g. "ICANN Board Res. 2018.02.08.05"
- GAC advice: cite by communiqué meeting, e.g. "GAC Singapore Communiqué 2011"
- RFCs and technical standards: cite by RFC number
- ICANN new gTLD program documents: cite by document name and date

Respond in EXACTLY three sections. Use these exact headings:

## RECOMMENDATION
The very first line after this heading must be the verdict — one of these four options copied exactly, alone on its own line:
STRONG APPLY
APPLY WITH STRATEGY
HIGH RISK – PROCEED WITH CAUTION
DO NOT APPLY

Then write 4–5 sentences of tactical reasoning. Reference specific AGB sections and real-world precedents — do not reference internal flag codes (e.g. SIM-002, TM-001). If there is a hard blocker, explain exactly which AGB provision bars the application and what, if anything, can be done. If the string sailed through 2012, say so. If a similar string was rejected, name it. Plain text only — no markdown bold, italics, or bullet points.

## CITATIONS
List every source you referenced in the RECOMMENDATION and COMPETITIVE LANDSCAPE sections, one per line, in this format:
[CODE] Full citation
Example:
[AGB] §7.3, pp.236–247 — String Similarity Evaluation, NIST visual algorithm
[PREC] .web — contention set, Nu Dot Co LLC (Verisign-backed) won 2016 auction at $135M; second IRP (Altanovo v. ICANN) ongoing 2026
[ICANN] Board Res. 2018.02.08.05 — .corp/.home/.mail deferred strings

## COMPETITIVE LANDSCAPE
Write 3–4 sentences covering: realistic number of competing applicants based on 2012 history and current market signals, estimated auction reserve budget you should hold, your competitive positioning relative to likely opponents, and one specific strategic differentiator to develop in your application. Plain text only.`;

// ---------------------------------------------------------------------------
// Deterministically compute the verdict from engine scores
// This is the source of truth — Claude must use this verdict exactly
// ---------------------------------------------------------------------------
type Verdict =
  | 'STRONG APPLY'
  | 'APPLY WITH STRATEGY'
  | 'HIGH RISK – PROCEED WITH CAUTION'
  | 'DO NOT APPLY';

export function computeVerdict(report: TLDRiskReport): Verdict {
  if (report.isHardBlocked) return 'DO NOT APPLY';
  if (report.applicationRiskLevel === 'HIGH') return 'HIGH RISK – PROCEED WITH CAUTION';
  if (report.applicationRiskLevel === 'MEDIUM') return 'APPLY WITH STRATEGY';
  if (report.applicationRiskLevel === 'LOW') return 'APPLY WITH STRATEGY';
  // CLEAR application risk
  if (report.competitiveDemandLevel === 'HIGH' || report.competitiveDemandLevel === 'MEDIUM') return 'APPLY WITH STRATEGY';
  return 'STRONG APPLY';
}

// ---------------------------------------------------------------------------
// Build the user message from a full TLDRiskReport
// ---------------------------------------------------------------------------
export function buildPrompt(report: TLDRiskReport): string {
  const allFlags = report.categories.flatMap(c => c.flags);

  const categoryLines = report.categories
    .map(c => `  ${CATEGORY_LABELS[c.category]}: ${c.score}/100 (${c.level}) — ${c.summary}`)
    .join('\n');

  const flagLines = allFlags.length > 0
    ? allFlags.map(f =>
        `  [${f.code}] ${f.severity}: ${f.title}\n` +
        `    Detail: ${f.detail}\n` +
        `    AGB ref: ${f.guidebookRef}\n` +
        `    Recommendation: ${f.recommendation}`
      ).join('\n\n')
    : '  No flags raised.';

  const similarLines = report.similarTLDs.length > 0
    ? report.similarTLDs.map(t => `  .${t.tld} (${t.type} match, ${t.visualScore}% similarity)`).join('\n')
    : '  None identified.';

  const recLines = report.recommendations.length > 0
    ? report.recommendations.map(r => `  - ${r}`).join('\n')
    : '  No specific recommendations.';

  const verdict = computeVerdict(report);

  // Extract stat chip values so the AI text matches what is displayed to the user
  const contentionCat = report.categories.find(c => c.category === 'STRING_CONTENTION');
  const primaryFlag = contentionCat?.flags.find(f => f.stats && f.stats.length > 0);
  const chipStats = primaryFlag?.stats;
  const chipApplicants = chipStats?.find(s => s.label.toLowerCase().includes('applicant'))?.value;
  const chipBudget = chipStats?.find(s => s.label.toLowerCase().includes('auction') || s.label.toLowerCase().includes('reserve'))?.value;
  const chipOperator = chipStats?.find(s => s.label.toLowerCase().includes('operator') || s.label.toLowerCase().includes('operator'))?.value;

  return `Assess this TLD application and provide your expert opinion.

STRING: .${report.normalized}
APPLICATION TYPE: ${report.appType === 'brand' ? '.Brand TLD (single registrant — you are the rights holder)' : 'Open Generic TLD (open registration to the public)'}
HARD BLOCKED: ${report.isHardBlocked ? 'YES — this string cannot proceed under any circumstances' : 'No'}

APPLICATION RISK SCORE: ${report.applicationRiskScore}/100 (${report.applicationRiskLevel}) — likelihood the application can succeed through ICANN evaluation
COMPETITIVE DEMAND SCORE: ${report.competitiveDemandScore}/100 (${report.competitiveDemandLevel}) — how contested this string will be; HIGH = auction likely

REQUIRED VERDICT: ${verdict}
You MUST use exactly "${verdict}" as the first line of your RECOMMENDATION section. Do not substitute, rephrase, or choose a different verdict — the verdict is fixed by the engine scores above. Your role is to explain the reasoning behind it.

COMPETITIVE LANDSCAPE ALIGNMENT: Your competitive landscape section must reflect the engine's competitive demand level of ${report.competitiveDemandLevel}. ${
  report.competitiveDemandLevel === 'HIGH'   ? 'This is a highly contested string — auction is likely. Reflect urgency around budget and strategy.' :
  report.competitiveDemandLevel === 'MEDIUM' ? 'Moderate competition is expected. Reflect realistic contender count and positioning.' :
  report.competitiveDemandLevel === 'LOW'    ? 'Limited applicant interest is expected. Reflect the relatively clear path but note any niche competitors.' :
                                               'Minimal competitive demand. Reflect that contention is unlikely and auction budget is low priority.'
}

STAT CHIPS — CRITICAL: The following values are displayed to the user in stat cards above your competitive landscape text. Your written analysis MUST use these exact figures — do not invent different numbers or contradict them:
  Expected applicants: ${chipApplicants ?? 'unknown'}
  Auction reserve: ${chipBudget ?? 'unknown'}
  Incumbent / likely operators: ${chipOperator ?? 'unknown'}

CATEGORY SCORES:
${categoryLines}

ALL FLAGS (${allFlags.length} total):
${flagLines}

SIMILAR EXISTING TLDs:
${similarLines}

ENGINE RECOMMENDATIONS:
${recLines}

Provide your expert analysis now.`;
}

// ---------------------------------------------------------------------------
// Stream a Claude analysis for the given report
// Calls onChunk for each text delta, onDone when complete, onError on failure
// ---------------------------------------------------------------------------
export async function streamAnalysis(
  report: TLDRiskReport,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
): Promise<void> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY as string | undefined;

  if (!apiKey) {
    onError(new Error('NO_KEY'));
    return;
  }

  try {
    const client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(report) }],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        onChunk(chunk.delta.text);
      }
    }

    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}
