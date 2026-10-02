'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Project } from '@/lib/data';

/** Width the live site is rendered at before being scaled into its frame. */
const SITE_WIDTH = 1440;
// Live frames are full page loads, so small or touch screens keep the screenshot.
const CAN_EMBED = '(min-width: 1024px) and (hover: hover)';

interface LivePreviewProps {
  project: Project;
  /** Interactive frames take pointer and keyboard input; card thumbnails stay inert. */
  isInteractive?: boolean;
  /** Off where the frame is tiny or transient (cursor-follow previews): screenshot only. */
  isEmbedEnabled?: boolean;
  isPriority?: boolean;
  sizes?: string;
}

/**
 * The project's real site in a scaled iframe, mounted only once it scrolls near
 * view. The screenshot sits underneath as poster and as the fallback for sites
 * that refuse framing, small screens, and visitors without the live frame.
 */
export default function LivePreview({ project, isInteractive = false, isEmbedEnabled = true, isPriority = false, sizes = '(min-width: 1024px) 33vw, 90vw' }: LivePreviewProps) {
  const root = useRef<HTMLDivElement>(null);
  const isNear = useInView(root, { once: true, margin: '200px' });
  const canEmbed = useMediaQuery(CAN_EMBED);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ width: entry.contentRect.width, height: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = box.width / SITE_WIDTH;
  const shouldEmbed = Boolean(isEmbedEnabled && project.live && project.isFrameable && canEmbed && isNear && scale > 0);

  return (
    <div ref={root} className="relative h-full w-full overflow-hidden bg-bg">
      {project.image && (
        <Image src={project.image} alt={`${project.title} — homepage of the live site`} fill sizes={sizes} priority={isPriority} className="object-cover object-top" />
      )}
      {shouldEmbed && (
        <iframe
          src={project.live!}
          title={`${project.title} — live site`}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          tabIndex={isInteractive ? 0 : -1}
          aria-hidden={isInteractive ? undefined : true}
          onLoad={() => setIsLoaded(true)}
          className={`absolute left-0 top-0 origin-top-left border-0 bg-bg transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isInteractive ? '' : 'pointer-events-none'}`}
          style={{ width: SITE_WIDTH, height: box.height / scale, transform: `scale(${scale})` }}
        />
      )}
      {isLoaded && (
        <span className="label pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-fg/80 px-2.5 py-1 !text-[0.58rem] text-bg backdrop-blur">
          <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-[#3ddc84]" />
          Live
        </span>
      )}
    </div>
  );
}
