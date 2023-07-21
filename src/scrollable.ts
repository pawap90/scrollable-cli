import { type Options as WrapOptions } from 'wrap-ansi';
import wrapAnsi from 'wrap-ansi';

export type ScrollableOptions = {
    content?: string;
    start: { x: number; y: number };
    size: { width: number; height: number };
    wrapOptions: WrapOptions;
};

export class Scrollable {
    private lines: string[] = [];
    private currentLine = 0;
    private _options: ScrollableOptions;
    get options(): ScrollableOptions {
        return this._options;
    }

    constructor(options?: Partial<ScrollableOptions>) {
        this._options = {
            content: options?.content,
            start: {
                x: options?.start?.x ?? 0,
                y: options?.start?.y ?? 0
            },
            size: {
                width: options?.size?.width ?? process.stdout.columns,
                height: options?.size?.height ?? process.stdout.rows
            },
            wrapOptions: {
                hard: options?.wrapOptions?.hard ?? false,
                wordWrap: options?.wrapOptions?.wordWrap ?? true,
                trim: options?.wrapOptions?.trim ?? true
            }
        };
    }

    setContent(content: string): this {
        this._options.content = content;
        this.resetLines();
        return this;
    }

    setStart(start: { x: number; y: number }): this {
        this._options.start = start;
        this.resetLines();
        return this;
    }

    setSize(size: { width: number; height: number }): this {
        this._options.size = size;
        this.resetLines();
        return this;
    }

    setWrapOptions(wrapOptions: WrapOptions): this {
        this._options.wrapOptions = wrapOptions;
        this.resetLines();
        return this;
    }

    print(): this {
        if (this.lines.length == 0) this.splitContentIntoLines();
        const { x, y } = this._options.start;
        const { width, height } = this._options.size;
        const emptyLine = Array(width).fill(' ').join('');

        // Clear the area.
        this.clear();

        process.stdout.cursorTo(x, y);
        for (let i = 0; i < height; i++) {
            const line = this.lines[i + this.currentLine];
            process.stdout.cursorTo(x);
            
            console.log(line ?? emptyLine);
        }

        return this;
    }

    scroll(lines: number): this {
        this.currentLine += lines;
        return this;
    }

    clear(): this {
        const { x, y } = this._options.start;
        const { width, height } = this._options.size;
        const emptyLine = Array(width).fill(' ').join('');
        process.stdout.cursorTo(x, y);

        for (let i = 0; i < height; i++) {
            process.stdout.cursorTo(x);
            console.log(emptyLine);
        }

        return this;
    }

    private resetLines(): void {
        this.lines = [];
        this.currentLine = 0;
    }

    private splitContentIntoLines(): void {
        if (!this._options.content) return;

        const wrapped = wrapAnsi(
            this._options.content,
            this._options.size.width,
            this._options.wrapOptions
        );
        this.lines = wrapped.split('\n');
    }
}
