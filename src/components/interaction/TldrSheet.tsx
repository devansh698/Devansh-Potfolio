'use client';

import { useCompanion } from '@/components/providers/CompanionProvider';
import Modal, { CloseButton } from '@/components/ui/Modal';
import { profile, projects, roles, skills } from '@/lib/data';

/** "Quick portfolio" — the whole story on one card for visitors in a hurry. */
export default function TldrSheet() {
  const { isTldrOpen, setTldrOpen, setStoryProject } = useCompanion();
  const now = roles[0];
  const top = projects.filter((p) => p.repo).slice(0, 3);

  return (
    <Modal isOpen={isTldrOpen} onClose={() => setTldrOpen(false)} label="Quick portfolio summary" className="max-w-xl p-6 sm:p-8">
      <header className="flex items-center justify-between">
        <span className="label bg-accent px-3 py-1 text-on-accent">TL;DR</span>
        <CloseButton onClick={() => setTldrOpen(false)} label="Close summary" />
      </header>
      <h3 className="display mt-6 text-4xl leading-none">{profile.name}</h3>
      <p className="mt-2 text-muted">
        {now.title} @ {now.org} · {now.period.split(' — ')[0]} → now
      </p>

      <dl className="mt-8 space-y-6">
        <div>
          <dt className="label text-muted">Stack</dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {skills.slice(0, 7).map((s) => (
              <span key={s.name} className="border border-line px-2.5 py-1 text-sm">
                {s.name}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="label text-muted">Proof</dt>
          <dd className="mt-2 divide-y divide-line">
            {top.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setTldrOpen(false);
                  setStoryProject(p);
                }}
                className="flex w-full items-baseline justify-between gap-4 py-2.5 text-left hover:text-accent"
              >
                <span>
                  <span className="label mr-2 text-muted">{p.code}</span>
                  {p.title}
                </span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </dd>
        </div>
        <div>
          <dt className="label text-muted">Fact</dt>
          <dd className="mt-2 text-lg">Intern → full-time engineer inside a year, shipping production CRMs.</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href={`mailto:${profile.email}`} className="bg-accent px-5 py-2.5 font-semibold text-on-accent">
          Email me
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="border border-line px-5 py-2.5 hover:bg-fg hover:text-bg">
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="border border-line px-5 py-2.5 hover:bg-fg hover:text-bg">
          LinkedIn
        </a>
      </div>
    </Modal>
  );
}
