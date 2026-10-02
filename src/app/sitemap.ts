import type { MetadataRoute } from 'next';
import { projects } from '@/lib/data';
import { CONTENT_UPDATED_AT, absoluteUrl, projectPath } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl('/'),
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 1,
      images: [absoluteUrl('/opengraph-image')],
    },
    ...projects.map((project) => ({
      url: absoluteUrl(projectPath(project)),
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
      images: [absoluteUrl(`${projectPath(project)}/opengraph-image`)],
    })),
  ];
}
