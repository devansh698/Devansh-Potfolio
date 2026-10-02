import LivePreview from '@/components/ui/LivePreview';
import type { Project } from '@/lib/data';
import { liveLabel } from '@/lib/site';

interface ProjectCoverProps {
  project: Project;
  /** Set for above-the-fold covers so the screenshot isn't lazy-loaded. */
  isPriority?: boolean;
  sizes?: string;
  /** Drop the title/folio footer where the surrounding card already names the project. */
  isCompact?: boolean;
  /** Load the live site into the frame when it scrolls into view. */
  isLiveEnabled?: boolean;
}

/**
 * Printed plate for a project. With a live site it frames the real thing (or its
 * screenshot) in a browser window; without one it draws an abstract interface instead.
 */
export default function ProjectCover({ project, isPriority = false, sizes = '(min-width: 1024px) 33vw, 90vw', isCompact = false, isLiveEnabled = true }: ProjectCoverProps) {
  const folio = project.code.slice(-2);
  return (
    <div className="relative flex h-full w-full flex-col justify-between gap-3 overflow-hidden bg-surface-2 p-4 text-fg">
      <div aria-hidden="true" className="halftone absolute inset-0 opacity-[0.14]" style={{ backgroundSize: '7px 7px' }} />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ background: project.tone }} />

      {/* Opaque chips: covers overlap in the 3D ring, so labels carry their own backdrop. */}
      <div className="relative flex items-start justify-between gap-2">
        <span className="label bg-surface-2 text-muted">{project.code}</span>
        <span className="label bg-surface-2 text-muted">{project.live ? '● Live' : project.year}</span>
      </div>

      {project.image ? (
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden border border-line bg-bg shadow-[0_18px_40px_-24px_rgb(0_0_0/0.55)]">
          <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5 border-b border-line px-2.5 py-1.5">
            <span className="size-1.5 rounded-full bg-line" />
            <span className="size-1.5 rounded-full bg-line" />
            <span className="size-1.5 rounded-full bg-line" />
            <span className="ml-2 truncate font-mono text-[0.6rem] text-muted">{project.live ? liveLabel(project.live) : project.title}</span>
          </div>
          <div className="relative min-h-0 flex-1">
            <LivePreview project={project} isEmbedEnabled={isLiveEnabled} isPriority={isPriority} sizes={sizes} />
          </div>
        </div>
      ) : (
        <div aria-hidden="true" className="relative mx-auto flex w-full max-w-[85%] flex-1 items-center justify-center">
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
      )}

      <div className={`relative flex items-end justify-between gap-3 ${isCompact ? 'hidden' : ''}`}>
        <p className="display max-w-[70%] text-[clamp(1.3rem,3.6vw,2rem)] leading-[0.95]">{project.title}</p>
        <span className="display text-[3.5rem] leading-[0.7] opacity-90" style={{ color: project.tone }}>
          {folio}
        </span>
      </div>
    </div>
  );
}
