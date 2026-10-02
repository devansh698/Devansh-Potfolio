import { buildLlmsFullTxt } from '@/lib/seo/llms';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' },
  });
}
