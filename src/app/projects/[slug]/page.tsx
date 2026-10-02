import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import ProjectCover from '@/components/ui/ProjectCover';
import { profile, projects } from '@/lib/data';
import { projectJsonLd } from '@/lib/seo/structured-data';
import { findProject, llmsAlternateTypes, projectDescription, projectPath, site } from '@/lib/site';

// Only the known projects exist; anything else is a real 404, not an on-demand render.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const project = findProject((await params).slug);
  if (!project) return {};

  const title = `${project.title} — ${project.kind}`;
  const description = projectDescription(project);
  const path = projectPath(project);

  return {
    title,
    description,
    keywords: [project.title, project.kind, ...project.stack, profile.name],
    alternates: { canonical: path, types: llmsAlternateTypes },
    openGraph: {
      type: 'article',
      siteName: site.name,
      locale: site.locale,
      url: path,
      title,
      description,
      authors: [profile.name],
      tags: project.stack,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  const project = findProject((await params).slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const sections = [
    { heading: 'The problem', body: project.problem },
    { heading: 'The approach', body: project.think },
    { heading: 'The outcome', body: project.result },
  ];

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />

      <header className="gutter flex items-center justify-between gap-4 border-b border-line py-5">
        <Link href="/" className="label hover:text-accent">
          ← {profile.name}
        </Link>
        <Link href="/#contact" className="label border border-line px-4 py-2 hover:bg-fg hover:text-bg">
          Get in touch
        </Link>
      </header>

      <main className="gutter py-[clamp(3rem,8vw,6rem)]">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="label flex flex-wrap items-center gap-2 text-muted">
            <li>
              <Link href="/" className="hover:text-fg">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#work" className="hover:text-fg">Work</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">{project.title}</li>
          </ol>
        </nav>

        <article className="mx-auto max-w-5xl">
          <header className="mb-12">
            <p className="label mb-5 text-accent">
              {project.code} · {project.kind}
            </p>
            <h1 className="display text-[clamp(3rem,10vw,8rem)]">{project.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted">{project.desc}</p>
          </header>

          <div className="mb-14 aspect-[16/9] overflow-hidden border border-line">
            <ProjectCover project={project} />
          </div>

          <div className="grid gap-12 md:grid-cols-[1fr_16rem]">
            <div className="space-y-10">
              {sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="display mb-4 text-4xl">{s.heading}</h2>
                  <p className="text-lg leading-relaxed">{s.body}</p>
                </section>
              ))}
              <section>
                <h2 className="display mb-4 text-4xl">What was built</h2>
                <ul className="list-inside list-disc space-y-1 text-lg leading-relaxed">
                  {project.build.map((step) => (
                    <li key={step} className="first-letter:uppercase">{step}</li>
                  ))}
                </ul>
              </section>
            </div>

            <aside aria-label="Project facts" className="panel h-fit p-6">
              <dl className="space-y-5">
                <div>
                  <dt className="label text-muted">Timeline</dt>
                  <dd className="mt-1">{project.period}</dd>
                </div>
                <div>
                  <dt className="label text-muted">Category</dt>
                  <dd className="mt-1">{project.category}</dd>
                </div>
                <div>
                  <dt className="label text-muted">Stack</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {project.stack.map((t) => (
                      <span key={t} className="border border-line px-2.5 py-0.5 text-sm">{t}</span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="label text-muted">Source</dt>
                  <dd className="mt-1">
                    {project.repo ? (
                      <a href={project.repo} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-accent">
                        View code on GitHub ↗
                      </a>
                    ) : (
                      <span className="text-muted">Private / in development</span>
                    )}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </article>

        <nav aria-label="More projects" className="mx-auto mt-20 grid max-w-5xl gap-4 border-t border-line pt-8 sm:grid-cols-2">
          <Link href={projectPath(prev)} rel="prev" className="group panel p-5 hover:border-accent">
            <span className="label text-muted">← Previous</span>
            <span className="display mt-2 block text-3xl group-hover:text-accent">{prev.title}</span>
          </Link>
          <Link href={projectPath(next)} rel="next" className="group panel p-5 text-right hover:border-accent">
            <span className="label text-muted">Next →</span>
            <span className="display mt-2 block text-3xl group-hover:text-accent">{next.title}</span>
          </Link>
        </nav>
      </main>

      <footer className="gutter border-t border-line py-6">
        <p className="label text-muted">
          © {new Date().getFullYear()} {profile.name} · {profile.role} · {profile.location}
        </p>
      </footer>
    </>
  );
}
