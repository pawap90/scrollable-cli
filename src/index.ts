import { type ScrollableOptions, Scrollable } from './scrollable';

/**
 * Return a new Scrollable instance.
 */
export default (options?: Partial<ScrollableOptions>) => new Scrollable(options);
export { Scrollable, ScrollableOptions };