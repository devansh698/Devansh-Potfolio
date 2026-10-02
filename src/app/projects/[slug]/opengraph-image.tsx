import { profile, projects } from '@/lib/data';
import { findProject } from '@/lib/site';
import { OG_SIZE, renderOgCard } from '@/lib/seo/og';

export const alt = `Project case study by ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = findProject((await params).slug) ?? projects[0];
  return renderOgCard({
    eyebrow: `${project.code} · ${project.kind}`,
    title: project.title,
    subtitle: project.desc,
    footer: `${profile.name} · ${project.stack.join(' · ')}`,
    tone: project.tone,
  });
}
