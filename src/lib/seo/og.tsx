import { ImageResponse } from 'next/og';
import { profile } from '@/lib/data';

export const OG_SIZE = { width: 1200, height: 630 };

/* Mirrors the "press" theme tokens in globals.css — Satori can't read CSS variables. */
const INK = { bg: '#f2eee3', surface: '#eae5d7', fg: '#15120e', muted: '#5d5749', line: 'rgba(21,18,14,0.22)', accent: '#2b44e0' };

interface OgCardProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
  tone?: string;
}

/** Shared social card: a printed plate with a colour bar, matching the site's editorial art direction. */
export function renderOgCard({ eyebrow, title, subtitle, footer, tone = INK.accent }: OgCardProps): ImageResponse {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: INK.bg, color: INK.fg, padding: 48 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `2px solid ${INK.line}`,
            background: INK.surface,
            padding: '44px 56px',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: tone, display: 'flex' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, letterSpacing: 4, color: INK.muted, textTransform: 'uppercase' }}>
            <span>{eyebrow}</span>
            <span>{profile.initials}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: title.length > 22 ? 84 : 112, lineHeight: 0.95, letterSpacing: -3, fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: 34, color: INK.muted, maxWidth: 940, lineHeight: 1.3 }}>{subtitle}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, color: INK.muted }}>
            <span>{footer}</span>
            <span style={{ display: 'flex', width: 28, height: 28, background: tone }} />
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/** Monogram used for favicon-style icons. */
export function renderMonogram(size: number): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: INK.fg,
          color: INK.bg,
          fontSize: size * 0.46,
          fontWeight: 700,
          letterSpacing: -size * 0.02,
          borderBottom: `${Math.round(size * 0.07)}px solid ${INK.accent}`,
        }}
      >
        {profile.initials}
      </div>
    ),
    { width: size, height: size },
  );
}
