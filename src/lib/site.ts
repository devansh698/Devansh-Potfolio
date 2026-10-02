import { profile, projects, type Project } from '@/lib/data';

/**
 * Canonical origin for every absolute URL (canonicals, sitemap, JSON-LD, OG).
 * Preview deployments resolve to the production domain so search engines never
 * index a throwaway preview URL as canonical.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return `https://${vercelProduction}`;
  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();

export function absoluteUrl(path = '/'): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Bump when portfolio content changes; drives sitemap `lastmod` and `dateModified`. */
export const CONTENT_UPDATED_AT = '2026-10-02';

export const site = {
  name: `${profile.name} — Portfolio`,
  shortName: profile.initials,
  title: `${profile.name} — Software Engineer · Generative AI & LLM Apps`,
  titleTemplate: `%s · ${profile.name}`,
  description:
    'Devansh Handa is a software engineer and Claude Certified Developer in Haryana, India, building Generative AI and LLM features into production apps with React, Node.js and Python.',
  ogTagline: 'Software engineer · Generative AI · LLM apps · Claude Certified Developer',
  locale: 'en_IN',
  language: 'en',
  themeColor: '#f3f0e8',
  keywords: [
    'Devansh Handa',
    'Software Engineer',
    'Generative AI Engineer',
    'AI Engineer',
    'LLM Developer',
    'Claude Certified Developer',
    'Prompt Engineering',
    'Full-Stack Developer',
    'React Developer',
    'Node.js',
    'REST API',
    'WebSockets',
    'Haryana',
    'India',
    'Portfolio',
  ],
} as const;

/**
 * Plain-text summaries for LLM crawlers and assistants (https://llmstxt.org).
 * Set as each page's `alternates.types` — Next merges metadata shallowly, so a
 * page-level `alternates.canonical` would otherwise drop these links.
 */
export const llmsAlternateTypes = {
  'text/plain': [
    { url: '/llms.txt', title: `${profile.name} — LLM summary` },
    { url: '/llms-full.txt', title: `${profile.name} — full profile for LLMs` },
  ],
};

export const projectPath = (project: Pick<Project, 'id'>): string => `/projects/${project.id}`;

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.id === slug);
}

/** Search-snippet description for a project page, kept under ~160 characters. */
export function projectDescription(project: Project): string {
  const text = `${project.title} — ${project.kind}. ${project.desc}`;
  return text.length <= 160 ? text : `${text.slice(0, 157).trimEnd()}…`;
}

/** Short, readable form of a live URL for chips and browser frames: host plus first path segment. */
export function liveLabel(url: string): string {
  const { hostname, pathname } = new URL(url);
  const first = pathname.split('/').filter(Boolean)[0];
  return first ? `${hostname}/${first}` : hostname;
}
