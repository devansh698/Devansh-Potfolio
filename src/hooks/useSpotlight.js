/**
 * useSpotlight
 * Returns an onMouseMove handler that writes the cursor position into
 * --mx/--my CSS vars on the target element — pairs with the `.spotlight`
 * class in global.css to drive a gradient that follows the mouse.
 */
export function useSpotlight() {
  return (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };
}
