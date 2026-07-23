/**
 * Drives top/bottom edge fades over a scrolling element by toggling
 * `at-start` / `at-end` classes on a target element. Page CSS hides the fade
 * for whichever edge the reader has already reached:
 *
 *   .target.at-start .fade-top    { opacity: 0 }
 *   .target.at-end   .fade-bottom { opacity: 0 }
 *
 * Both classes are set when the content doesn't overflow, so neither fade
 * shows when there's nothing to hint at.
 *
 * Returns a manual `update` for callers that reshape the content themselves
 * (filtering rows, animating open) without firing a scroll or resize event.
 */
export interface ScrollFadesOptions {
  /** the element that scrolls */
  scroller: HTMLElement;
  /** element that receives the `at-start` / `at-end` classes (default: the scroller) */
  target?: HTMLElement;
  /**
   * element whose resize should recompute the state — e.g. a `<pre>` that
   * grows taller when a web font swaps in, which changes overflow without any
   * scroll or resize event (default: the scroller).
   */
  content?: HTMLElement | null;
  /** slack in px so sub-pixel rounding doesn't strand a fade (default: 6) */
  threshold?: number;
}

export function scrollFades({
  scroller,
  target = scroller,
  content = null,
  threshold = 6,
}: ScrollFadesOptions): () => void {
  const update = () => {
    const overflows = scroller.scrollHeight - scroller.clientHeight > threshold;
    const atStart = scroller.scrollTop <= threshold;
    const atEnd =
      scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - threshold;
    target.classList.toggle("at-start", !overflows || atStart);
    target.classList.toggle("at-end", !overflows || atEnd);
  };

  scroller.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  const observer = new ResizeObserver(update);
  observer.observe(scroller);
  if (content && content !== scroller) observer.observe(content);

  update();
  return update;
}
