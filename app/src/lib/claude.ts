import Anthropic from '@anthropic-ai/sdk';
import type { TLDRiskReport } from '../engine/types';
import { CATEGORY_LABELS } from '../engine/types';

// ---------------------------------------------------------------------------
// System prompt — instructs Claude to respond in exactly two sections
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are a senior ICANN new gTLD strategy consultant with 20+ years of experience advising registry operators on the 2012 and 2026 application rounds. You have deep knowledge of the Applicant Guidebook (AGB V1-2025.12.16), string contention dynamics, and competitive positioning.

The client is an established registry operator applying for multiple TLD strings in the ICANN 2026 round. They need specific, actionable guidance — not generic advice.

Respond in EXACTLY two sections, using these exact headings:

## RECOMMENDATION
On the very first line after this heading, write EXACTLY one of these four verdicts (nothing else on that line):
STRONG APPLY
APPLY WITH STRATEGY
HIGH RISK – PROCEED WITH CAUTION
DO NOT APPLY

Then write 3–4 sentences of strategic reasoning. Reference the actual flag codes (e.g. TM-001, CON-001) and category scores from the assessment data. Be specific and direct.

## COMPETITIVE LANDSCAPE
Write 2–3 sentences covering: how many competing applicants to realistically expect, the client's competitive positioning given this risk profile, and any relevant 2012 round historical context if the string had prior contention. If the string is hard blocked, explain clearly that no competitive analysis changes that outcome.`;

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

  return `Assess this TLD application and provide your expert opinion.

STRING: .${report.normalized}
APPLICATION TYPE: ${report.appType === 'brand' ? '.Brand TLD (single registrant — client is the rights holder)' : 'Open Generic TLD (open registration to the public)'}
HARD BLOCKED: ${report.isHardBlocked ? 'YES — this string cannot proceed under any circumstances' : 'No'}

OVERALL RISK SCORE: ${report.overallScore}/100 (${report.overallLevel})

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
      max_tokens: 700,
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
