import './BotFace.css';

/**
 * The companion's visual: a flat, graphic little machine in the site's
 * neo-brutalist language — bordered head, one big tracking eye, antenna.
 * Pupil position is driven by --look-x / --look-y set on any ancestor.
 * Mood is expressed through accent color, eye shape and antenna motion.
 */
export default function BotFace({ mood = 'idle', size = 58 }) {
  return (
    <span className={`botface mood-${mood}`} style={{ '--bot-size': `${size}px` }} aria-hidden="true">
      <span className="bot-antenna"><span className="bot-antenna-tip" /></span>
      <span className="bot-head">
        <span className="bot-eye">
          <span className="bot-pupil" />
          <span className="bot-lid" />
        </span>
        <span className="bot-mouth" />
      </span>
      <span className="bot-burst" />
    </span>
  );
}
