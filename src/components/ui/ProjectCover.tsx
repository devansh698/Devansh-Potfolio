import type { Project } from '@/lib/data';

/**
 * Printed plate for a project: halftone field, registration marks and a big
 * serif folio number. Theme inks keep it coherent with the rest of the issue.
 */
export default function ProjectCover({ project }: { project: Project }) {
  const folio = project.code.slice(-2);
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-surface-2 p-4 text-fg">
      <div aria-hidden="true" className="halftone absolute inset-0 opacity-[0.18]" style={{ backgroundSize: '7px 7px' }} />
      <div aria-hidden="true" className="absolute inset-3 border border-line" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ background: project.tone }} />

      <div className="relative flex items-start justify-between gap-2">
        <span className="label text-muted">{project.code}</span>
        <span className="label text-muted">{project.year}</span>
      </div>

      <div aria-hidden="true" className="relative mx-auto my-3 flex w-full max-w-[85%] flex-1 items-center justify-center">
        {/* Abstract plate: stacked rules and blocks standing in for an interface. */}
        <div className="w-full space-y-2">
          <div className="h-16 w-full border border-line bg-bg/60" />
          <div className="flex gap-2">
            <div className="h-3 w-1/2" style={{ background: project.tone }} />
            <div className="h-3 flex-1 bg-line" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-1/3 border border-line" />
            <div className="h-8 flex-1 border border-line" style={{ background: `${project.tone}1a` }} />
          </div>
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-3">
        <p className="display max-w-[70%] text-[clamp(1.3rem,3.6vw,2rem)] leading-[0.95]">
          {project.title}
        </p>
        <span className="display text-[3.5rem] leading-[0.7] opacity-90" style={{ color: project.tone }}>{folio}</span>
      </div>
    </div>
  );
}
