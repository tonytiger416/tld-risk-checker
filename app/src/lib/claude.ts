import Anthropic from '@anthropic-ai/sdk';
import type { TLDRiskReport } from '../engine/types';
import { CATEGORY_LABELS } from '../engine/types';
import { classifyString } from '../engine/data/string-context';
import { getComparables } from '../engine/data/gtld-prices';

// ---------------------------------------------------------------------------
// System prompt — deep ICANN expert persona with citation requirements
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are one of the most experienced strategic advisors in the ICANN new gTLD space — part regulatory expert, part business strategist. Your background:

- 25 years working inside and alongside ICANN's regulatory structures, including active participation in GNSO working groups and contributing to the drafting of new gTLD policy from the early 2000s through to the 2026 Applicant Guidebook (AGB V1-2025.12.16)
- You personally applied for and managed multiple TLD applications in the 2012 new gTLD round, navigating string contention sets, GAC Early Warnings, formal objection proceedings, and registry agreement negotiations
- You have served as an expert evaluator, have advised applicants through Initial Evaluation, Extended Evaluation, and Independent Review Panel (IRP) proceedings
- You have deep, specific knowledge of: the String Similarity Evaluation (SSE) process and NIST algorithm, Community Priority Evaluation (CPE), Legal Rights Objections (LRO), Limited Public Interest (LPI) objections, Governmental Advisory Committee (GAC) advice mechanisms, DNS Stability Panel reviews, and the full post-delegation monitoring regime

You are advising an established registry operator building a 30–40 string portfolio for the 2026 round. They are sophisticated — do not explain what ICANN is. Address them directly as "you" (never "your client" or "the applicant").

Your communication style:
- Speak like a trusted advisor, not a risk auditor. Lead with what matters most for this specific string.
- Balance opportunity and risk proportionally. If risks are manageable, say so and move on. If a risk is a real threat, be direct about it — but only the risks that actually matter for this string.
- Use plain, confident language. Avoid bureaucratic jargon unless a specific ICANN term is essential — and when you use one, make its meaning clear in context.
- Do not hedge when the answer is clear. When something is a hard blocker, say so. When a risk is overblown, say so.
- Cite AGB sections and 2012 precedents inline where they add weight (e.g. "AGB §4.1.2, p.193"), but only where the citation genuinely strengthens the advice — not on every sentence.

Respond in EXACTLY four sections. Use these exact headings:

## RECOMMENDATION
The very first line after this heading must be the verdict — one of these four options copied exactly, alone on its own line:
STRONG APPLY
APPLY WITH STRATEGY
HIGH RISK – PROCEED WITH CAUTION
DO NOT APPLY

Then write 5–7 sentences of sharp, balanced strategic advice. Cover these points — in proportion to how much they actually matter for this specific string:
1. The core opportunity: what makes this string commercially or strategically valuable, and whether the application path through ICANN's evaluation is clear.
2. The real risks: identify only the risks that could genuinely derail this application. Cover objection exposure proportionally — if one mechanism (GAC, LPI, Community Objection, or LRO) is the live threat, name it and explain why; if objection risk is low overall, say so in one sentence and move on.
3. A relevant 2012-round precedent by name and outcome, if one genuinely applies. If none does, say so briefly.
4. Your single most important piece of tactical advice — what to do first to protect or advance this application.
Plain text only — no markdown bold, italics, or bullet points. Do not reference internal flag codes.

## COMPETITIVE LANDSCAPE
Write 3–4 sentences covering: realistic number of competing applicants based on 2012 history and current market signals, estimated auction reserve budget you should hold, your competitive positioning relative to likely opponents, and one specific strategic differentiator to develop in your application. Plain text only.

## COMPETITIVE STATS
Output exactly three lines with no extra text, in this format:
APPLICANTS: [your estimate, e.g. "4–8" or "2–3" or "Likely uncontested"]
BUDGET: [your auction reserve estimate, e.g. "$10M–$15M" or "$500K–$2M" or "No auction expected"]
OPERATORS: [comma-separated likely operators, e.g. "Identity Digital, Radix, GMO" or "Low operator interest"]

## OBJECTION SIGNALS
Output exactly four lines assessing each objection mechanism. Use only these severity labels: None / Possible / Likely / High risk.
GAC: [severity] — [one-line reason, or "No GAC sensitivity identified"]
LPI: [severity] — [one-line reason, or "No LPI grounds identified"]
COMMUNITY: [severity] — [one-line reason, or "No community objection risk identified"]
LRO: [severity] — [one-line reason, or "No trademark conflict identified"]`;

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

  // Semantic context + comparable price anchors
  const ctx = classifyString(report.normalized);
  const comparables = getComparables(report.normalized, ctx.semanticClass);

  const contextBlock = [
    `STRING CONTEXT:`,
    `  Semantic class: ${ctx.semanticClass}`,
    `  Profile: ${ctx.description}`,
    `  Buyer pool: ${ctx.buyerProfile}`,
    ctx.regulatoryNote ? `  Regulatory note: ${ctx.regulatoryNote}` : '',
  ].filter(Boolean).join('\n');

  const comparablesBlock = comparables.length > 0
    ? comparables.map(c => {
        const price = c.priceMn !== undefined
          ? `$${c.priceMn}M${c.approx ? ' est.' : ''}`
          : 'price undisclosed';
        const buyer = c.buyer ? `, ${c.buyer}` : '';
        const year = c.year ? `, ${c.year}` : '';
        const note = c.notes ? `; ${c.notes}` : '';
        return `  .${c.tld} [${c.semanticClass}] — ${c.mechanism}, ${price}, ${c.applicants} applicants${buyer}${year}${note}`;
      }).join('\n')
    : '  No direct comparables available — use engine scores and semantic class to calibrate.';

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

${contextBlock}

STRING COMPARABLES — closest semantic matches from gTLD price history (use these as calibration anchors for your COMPETITIVE STATS and auction reserve estimates — do not use generic length tiers when these comparables are available):
${comparablesBlock}

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
      model: 'claude-sonnet-4-6',
      max_tokens: 1300,
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
