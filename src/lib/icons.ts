// Heroicons imported as raw SVG strings (Vite ?raw).
// All Heroicons 24/solid SVGs use viewBox 0 0 24 24 and fill="currentColor"
// so they inherit text color and we size them via CSS classes on a wrapper.

import moon from "heroicons/24/solid/moon.svg?raw";
import sun from "heroicons/24/solid/sun.svg?raw";
import star from "heroicons/24/solid/star.svg?raw";
import sparkles from "heroicons/24/solid/sparkles.svg?raw";
import trash from "heroicons/24/solid/trash.svg?raw";
import stop from "heroicons/24/solid/stop.svg?raw";
import play from "heroicons/24/solid/play.svg?raw";
import clock from "heroicons/24/solid/clock.svg?raw";
import arrowRight from "heroicons/24/solid/arrow-right.svg?raw";
import chevronLeft from "heroicons/20/solid/chevron-left.svg?raw";
import chevronRight from "heroicons/20/solid/chevron-right.svg?raw";
import xMark from "heroicons/20/solid/x-mark.svg?raw";

export const icons = {
  moon,
  sun,
  star,
  sparkles,
  trash,
  stop,
  play,
  clock,
  arrowRight,
  chevronLeft,
  chevronRight,
  xMark,
};

export type IconName = keyof typeof icons;

// Inject className into the root <svg ...> element so we can size & color
// each icon at the call site with Tailwind utilities.
export function icon(name: IconName, className: string = "w-5 h-5"): string {
  return icons[name].replace(/^<svg\s/, `<svg class="${className}" `);
}
