import Anthropic from '@anthropic-ai/sdk';
import { assess } from '../app/src/engine/assess';
import { SYSTEM_PROMPT, buildPrompt } from '../app/src/lib/claude';

// ---------------------------------------------------------------------------
// Server-side Claude call — the API key never reaches the browser.
// The client sends only the TLD string; the prompt is rebuilt here, so this
// endpoint can't be used as a general-purpose Claude proxy.
// ---------------------------------------------------------------------------
const TLD_PATTERN = /^[a-z0-9-]{1,63}$/;

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return new Response('NO_KEY', { status: 503 });

  let body: { tld?: unknown; appType?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const tld = typeof body.tld === 'string' ? body.tld.trim().toLowerCase().replace(/^\.+/, '') : '';
  const appType = body.appType === 'brand' ? 'brand' : 'open';
  if (!TLD_PATTERN.test(tld)) return new Response('Bad request', { status: 400 });

  const client = new Anthropic({ apiKey });
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1300,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(assess(tld, appType)) }],
  });

  const encoder = new TextEncoder();
  const textStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(textStream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
