import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import ProjectCover from '@/components/ui/ProjectCover';
import LivePreview from '@/components/ui/LivePreview';
import { profile, projects, type ProjectFeature } from '@/lib/data';
import { projectJsonLd } from '@/lib/seo/structured-data';
import { CONTENT_UPDATED_AT, findProject, liveLabel, llmsAlternateTypes, projectDescription, projectPath, site } from '@/lib/site';

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

  const { feature } = project;
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
        <Link href="/#contact" className="btn btn-ghost h-10 text-sm">
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
            {feature && <p className="display mt-6 max-w-3xl text-[clamp(1.6rem,3.4vw,2.6rem)] italic leading-[1.05] text-accent">{feature.tagline}</p>}
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted">{project.desc}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                  Visit live site
                  <span className="btn-arrow" aria-hidden="true"><span>→</span></span>
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Source on GitHub ↗
                </a>
              )}
            </div>
            {feature && (
              <p className="label mt-6 inline-flex items-start gap-2 border border-line px-3 py-2 text-muted">
                <span aria-hidden="true" className="mt-[0.3em] size-1.5 shrink-0 bg-accent-2" />
                {feature.note}
              </p>
            )}
          </header>

          {project.image ? (
            <figure className="mb-14">
              <div className="overflow-hidden border border-line bg-surface shadow-[0_40px_90px_-50px_rgb(0_0_0/0.6)]">
                <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                  <span aria-hidden="true" className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-line" />
                    <span className="size-2.5 rounded-full bg-line" />
                    <span className="size-2.5 rounded-full bg-line" />
                  </span>
                  <span className="ml-3 truncate font-mono text-xs text-muted">{project.live ? liveLabel(project.live) : project.title}</span>
                </div>
                <div className="relative aspect-[16/10]">
                  <LivePreview project={project} isInteractive isPriority sizes="(min-width: 1024px) 64rem, 100vw" />
                </div>
              </div>
              <figcaption className="label mt-3 flex flex-wrap justify-between gap-2 text-muted">
                <span>{project.isFrameable ? 'Live site — scroll and click inside the window' : `Homepage · captured ${CONTENT_UPDATED_AT}`}</span>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                    Open full site ↗
                  </a>
                )}
              </figcaption>
            </figure>
          ) : (
            <div className="mb-14 aspect-[16/9] overflow-hidden border border-line">
              <ProjectCover project={project} isPriority sizes="(min-width: 1024px) 64rem, 100vw" />
            </div>
          )}

          <div className="grid gap-12 md:grid-cols-[1fr_16rem]">
            <div className="space-y-10">
              {sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="display mb-4 text-4xl">{s.heading}</h2>
                  <p className="text-lg leading-relaxed">{s.body}</p>
                </section>
              ))}
              {feature ? (
                <>
                  <EntryList heading="Key features" items={feature.features} />
                  <EntryList heading="Engineering highlights" items={feature.highlights} />
                  <section>
                    <h2 className="display mb-6 text-4xl">Tech stack</h2>
                    <dl className="border-t border-line">
                      {feature.stackTable.map((row) => (
                        <div key={row.layer} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                          <dt className="label pt-1 text-muted">{row.layer}</dt>
                          <dd className="leading-relaxed">{row.tech}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                </>
              ) : (
                <section>
                  <h2 className="display mb-4 text-4xl">What was built</h2>
                  <ul className="list-inside list-disc space-y-1 text-lg leading-relaxed">
                    {project.build.map((step) => (
                      <li key={step} className="first-letter:uppercase">{step}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside aria-label="Project facts" className="panel h-fit p-6 md:sticky md:top-8">
              <dl className="space-y-5">
                {feature && (
                  <div>
                    <dt className="label text-muted">Role</dt>
                    <dd className="mt-1">{feature.role}</dd>
                  </div>
                )}
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
                {project.live && (
                  <div>
                    <dt className="label text-muted">Live</dt>
                    <dd className="mt-1">
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="break-all underline decoration-line underline-offset-4 hover:text-accent">
                        {liveLabel(project.live)} ↗
                      </a>
                    </dd>
                  </div>
                )}
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
                {feature && (
                  <div>
                    <dt className="label text-muted">Scale</dt>
                    <dd className="mt-2 grid grid-cols-2 gap-3">
                      {feature.scale.map((m) => (
                        <span key={m.label} className="flex flex-col border-l border-line pl-3">
                          <span className="display text-3xl tabular-nums">{m.value}</span>
                          <span className="label text-muted">{m.label}</span>
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
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

/** Numbered editorial list: one hairline row per entry. */
function EntryList({ heading, items }: { heading: string; items: ProjectFeature['features'] }) {
  return (
    <section>
      <h2 className="display mb-6 text-4xl">{heading}</h2>
      <ol className="border-t border-line">
        {items.map((item, i) => (
          <li key={item.title} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[3rem_12rem_1fr] sm:gap-6">
            <span className="label pt-1 text-accent">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
