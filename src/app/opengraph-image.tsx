import { profile } from '@/lib/data';
import { site } from '@/lib/site';
import { OG_SIZE, renderOgCard } from '@/lib/seo/og';

export const alt = `${profile.name} — ${profile.role}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgCard({
    eyebrow: `${profile.role} · ${profile.location}`,
    title: profile.name,
    subtitle: site.ogTagline,
    footer: `Software Engineer at ${profile.company}`,
  });
}
