import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * AI search and assistant crawlers are named explicitly: some default to
 * "disallowed unless invited", and a named group documents the intent to be
 * discoverable in AI answers, not just classic search.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'DuckAssistBot',
  'Meta-ExternalAgent',
  'MistralAI-User',
  'cohere-ai',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
