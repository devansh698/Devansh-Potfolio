import type { CSSProperties } from 'react';
import type { Mood } from '@/components/providers/CompanionProvider';

interface BotFaceProps {
  mood?: Mood;
  size?: number;
  isBlinking?: boolean;
  isAsleep?: boolean;
}

/** One-eyed helper. Pupil follows --look-x / --look-y set on any ancestor; mood drives colour and shape. */
export default function BotFace({ mood = 'idle', size = 56, isBlinking = false, isAsleep = false }: BotFaceProps) {
  return (
    <span
      aria-hidden="true"
      className={`bot mood-${mood} ${isBlinking ? 'is-blink' : ''} ${isAsleep ? 'bot-sleep' : ''}`}
      style={{ '--size': `${size}px` } as CSSProperties}
    >
      <span className="bot-antenna" />
      <span className="bot-head">
        <span className="bot-eye">
          <span className="bot-pupil" />
          <span className="bot-lid" />
        </span>
        <span className="bot-mouth" />
      </span>
    </span>
  );
}
