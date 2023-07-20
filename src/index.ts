import { type ScrollableOptions, Scrollable } from './scrollable';

export default (options?: Partial<ScrollableOptions>) => new Scrollable(options);
export { Scrollable, ScrollableOptions };