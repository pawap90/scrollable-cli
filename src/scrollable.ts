import { type Options as WrapOptions } from 'wrap-ansi';
import wrapAnsi from 'wrap-ansi';

/**
 * Options for the Scrollable class.
 */
export type ScrollableOptions = {
    /**
     * The content to display in the scrollable area.
     * @default undefined
     */
    content?: string;

    /**
     * The starting position of the scrollable area.
     * @default { x: 0, y: 0 }
     */
    start: { x: number; y: number };

    /**
     * The size of the scrollable area.
     * @default { width: process.stdout.columns, height: process.stdout.rows }
     */
    size: { width: number; height: number };

    /**
     * Options for wrapping the content in the scrollable area.
     * @default { hard: false, wordWrap: true, trim: true }
     */
    wrapOptions: WrapOptions;

    /**
     * The stream to write to.
     * @default process.stdout
     */
    stdout: NodeJS.WriteStream;
};

/**
 * A scrollable area that can be printed to the console.
 */
export class Scrollable {
    private _lines: string[] = [];
    private _position = 0;
    private _options: ScrollableOptions;

    /**
     * The options for the Scrollable instance.
     */
    get options(): ScrollableOptions {
        return this._options;
    }

    /**
     * The lines of content in the scrollable area 
     * wrapped according to the specified {@link ScrollableOptions} and split into an array of lines.
     */
    get lines(): string[] {
        return this._lines;
    }

    /**
     * The position of the first line to display in the scrollable area.
     */
    get position(): number {
        return this._position;
    }

    /**
     * Creates a new Scrollable instance.
     * @param options - The options for the Scrollable instance.
     */
    constructor(options?: Partial<ScrollableOptions>) {
        this._options = {
            content: options?.content,
            start: {
                x: options?.start?.x ?? 0,
                y: options?.start?.y ?? 0
            },
            stdout: options?.stdout ?? process.stdout,
            size: {
                width:
                    options?.size?.width ??
                    options?.stdout?.columns ??
                    process.stdout.columns,
                height:
                    options?.size?.height ??
                    options?.stdout?.rows ??
                    process.stdout.rows
            },
            wrapOptions: {
                hard: options?.wrapOptions?.hard ?? false,
                wordWrap: options?.wrapOptions?.wordWrap ?? true,
                trim: options?.wrapOptions?.trim ?? true
            }
        };
    }

    /**
     * Sets the content to display in the scrollable area.
     * @param content - The content to display.
     * @returns The Scrollable instance.
     */
    setContent(content: string): this {
        this._options.content = content;
        this.resetLines();
        return this;
    }

    /**
     * Sets the starting position of the scrollable area.
     * @param start - The starting position.
     * @returns The Scrollable instance.
     */
    setStart(start: { x: number; y: number }): this {
        this._options.start = start;
        this.resetLines();
        return this;
    }

    /**
     * Sets the size of the scrollable area.
     * @param size - The size.
     * @returns The Scrollable instance.
     */
    setSize(size: { width: number; height: number }): this {
        this._options.size = size;
        this.resetLines();
        return this;
    }

    /**
     * Sets the options for wrapping the content in the scrollable area.
     * @param wrapOptions - The options for wrapping the content.
     * @returns The Scrollable instance.
     */
    setWrapOptions(wrapOptions: WrapOptions): this {
        this._options.wrapOptions = wrapOptions;
        this.resetLines();
        return this;
    }

    /**
     * Prints the scrollable area to the console.
     * @returns The Scrollable instance.
     */
    print(): this {
        if (this._lines.length == 0) this.splitContentIntoLines();
        const { x, y } = this._options.start;
        const { width, height } = this._options.size;
        const emptyLine = Array(width).fill(' ').join('');
        const { stdout } = this._options;

        // Clear the area.
        this.clear();

        stdout.cursorTo(x, y);
        for (let i = 0; i < height; i++) {
            const line = this._lines[i + this._position];
            stdout.cursorTo(x);

            stdout.write((line ?? emptyLine) + '\n');
        }

        return this;
    }

    /**
     * Scrolls by the specified number of lines.
     * @param lines - The number of lines to scroll.
     * @returns The Scrollable instance.
     */
    scroll(lines: number): this {
        this._position += lines;
        return this;
    }

    /**
     * Clears the scrollable area.
     * @returns The Scrollable instance.
     */
    clear(): this {
        const { x, y } = this._options.start;
        const { width, height } = this._options.size;
        const emptyLine = Array(width).fill(' ').join('');
        const { stdout } = this._options;
        stdout.cursorTo(x, y);

        for (let i = 0; i < height; i++) {
            stdout.cursorTo(x);
            stdout.write(emptyLine + '\n');
        }

        return this;
    }

    private resetLines(): void {
        this._lines = [];
        this._position = 0;
    }

    private splitContentIntoLines(): void {
        if (!this._options.content) return;

        const wrapped = wrapAnsi(
            this._options.content,
            this._options.size.width,
            this._options.wrapOptions
        );
        this._lines = wrapped.split('\n');
    }
}
