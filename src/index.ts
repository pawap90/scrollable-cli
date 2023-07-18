import { type ScrollBoxOptions, ScrollBox } from './scrollbox';

export default (options?: Partial<ScrollBoxOptions>) => new ScrollBox(options);
export { ScrollBox, ScrollBoxOptions };