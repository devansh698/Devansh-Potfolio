import { caseFile, courses, education, profile, projects, roles, skillGroups, skills, specializations, type Credential, type Project } from '@/lib/data';
import { CONTENT_UPDATED_AT, absoluteUrl, projectPath, site } from '@/lib/site';

/**
 * Markdown for LLM crawlers and assistants, following https://llmstxt.org.
 * Generated from the same data as the site, so answers about the portfolio
 * can't drift from what visitors see.
 */

const credentialLine = (c: Credential) => `- [${c.title}](${c.url}) — ${c.org}${c.date ? `, ${c.date}` : ''}`;

const projectLink = (p: Project) => `- [${p.title}](${absoluteUrl(projectPath(p))}): ${p.kind} (${p.year}). ${p.desc}`;

function header(): string[] {
  return [
    `# ${profile.name}`,
    '',
    `> ${site.description}`,
    '',
    profile.intro,
    '',
    profile.statement,
    '',
    ...caseFile.map((f) => `- ${f.k}: ${f.v}`),
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.github}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- Website: ${absoluteUrl('/')}`,
    `- Last updated: ${CONTENT_UPDATED_AT}`,
  ];
}

export function buildLlmsTxt(): string {
  return [
    ...header(),
    '',
    '## Projects',
    '',
    ...projects.map(projectLink),
    '',
    '## Experience',
    '',
    ...roles.map((r) => `- ${r.title}, ${r.org} (${r.period}) — ${r.stack.join(', ')}`),
    '',
    '## Pages',
    '',
    `- [Portfolio home](${absoluteUrl('/')}): About, skills, selected work, experience, certifications and contact.`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')}): Every indexable URL.`,
    '',
    '## Optional',
    '',
    `- [Full profile](${absoluteUrl('/llms-full.txt')}): Complete experience, skills, project case studies and certifications in one document.`,
    '',
  ].join('\n');
}

export function buildLlmsFullTxt(): string {
  const projectSections = projects.flatMap((p) => [
    `### ${p.title} — ${p.kind}`,
    '',
    `- URL: ${absoluteUrl(projectPath(p))}`,
    `- Period: ${p.period}`,
    `- Stack: ${p.stack.join(', ')}`,
    `- Source: ${p.repo ?? 'Private / in development'}`,
    '',
    p.desc,
    '',
    `**Problem.** ${p.problem}`,
    '',
    `**Approach.** ${p.think}`,
    '',
    `**Built.** ${p.build.join('; ')}.`,
    '',
    `**Outcome.** ${p.result}`,
    '',
  ]);

  return [
    ...header(),
    '',
    '## Experience',
    '',
    ...roles.flatMap((r) => [`### ${r.title} — ${r.org}`, '', `${r.period} · ${r.stack.join(', ')}`, '', ...r.points.map((pt) => `- ${pt}`), '']),
    '## Education',
    '',
    ...education.map((e) => `- ${e.title}, ${e.org} (${e.period})`),
    '',
    '## Skills',
    '',
    ...skillGroups.map((g) => `- ${g}: ${skills.filter((s) => s.group === g).map((s) => s.name).join(', ')}`),
    '',
    '## Projects',
    '',
    ...projectSections,
    '## Certifications',
    '',
    '### Specializations',
    '',
    ...specializations.map(credentialLine),
    '',
    '### Courses',
    '',
    ...courses.map(credentialLine),
    '',
    '## Contact',
    '',
    `The best way to reach ${profile.firstName} is by email at ${profile.email}, via LinkedIn (${profile.linkedin}), or through the contact form at ${absoluteUrl('/#contact')}.`,
    '',
  ].join('\n');
}
