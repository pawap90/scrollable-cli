import { type Options as WrapOptions } from 'wrap-ansi';
import wrapAnsi from 'wrap-ansi';

export type ScrollBoxOptions = {
    content?: string;
    start: { x: number; y: number };
    container: { width: number; height: number };
    wrapOptions: WrapOptions;
};

export class ScrollBox {
    private lines: string[] = [];
    private currentLine = 0;
    private _options: ScrollBoxOptions;
    get options(): ScrollBoxOptions {
        return this._options;
    }

    constructor(options?: Partial<ScrollBoxOptions>) {
        this._options = {
            content: options?.content,
            start: {
                x: options?.start?.x ?? 0,
                y: options?.start?.y ?? 0
            },
            container: {
                width: options?.container?.width ?? process.stdout.columns,
                height: options?.container?.height ?? process.stdout.rows
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

    setContainer(container: { width: number; height: number }): this {
        this._options.container = container;
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
        const { height } = this._options.container;

        process.stdout.cursorTo(x, y);
        for (let i = 0; i < height - 1; i++) {
            const line = this.lines[i + this.currentLine];
            process.stdout.cursorTo(x);
            this.printLine(line);
        }

        return this;
    }

    scroll(lines: number): this {
        this.currentLine += lines;

        if (this.currentLine < 0) {
            this.currentLine = 0;
        } else if (this.currentLine > this.lines.length - 1) {
            this.currentLine = this.lines.length - 1;
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
            this._options.container.width,
            this._options.wrapOptions
        );
        this.lines = wrapped.split('\n');
    }

    private printLine(line?: string): void {
        if (line == undefined) console.log(Array(this._options.container.width).fill(' ').join(''));
        else console.log(line.padEnd(this._options.container.width, ' '));
    }
}
