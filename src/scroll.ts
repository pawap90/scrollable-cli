import wrapAnsi, { type Options as WrapOptions } from 'wrap-ansi';

type ScrollOptions = {
    content?: string;
    start: { x: number; y: number };
    container: { width: number; height: number };
    wrapOptions: WrapOptions;
};

export class Scroll {
    private lines: string[] = [];
    private currentLine = 0;
    private options: ScrollOptions;

    constructor(options: Partial<ScrollOptions>) {
        this.options = {
            content: options.content,
            start: {
                x: options.start?.x ?? 0,
                y: options.start?.y ?? 0
            },
            container: {
                width: options.container?.width ?? process.stdout.columns,
                height: options.container?.height ?? process.stdout.rows
            },
            wrapOptions: {
                hard: options.wrapOptions?.hard ?? true,
                wordWrap: options.wrapOptions?.wordWrap ?? true,
                trim: options.wrapOptions?.trim ?? false
            }
        };
    }

    setContent(content: string): this {
        this.options.content = content;
        this.resetLines();
        return this;
    }

    setStart(start: { x: number; y: number }): this {
        this.options.start = start;
        this.resetLines();
        return this;
    }

    setContainer(container: { width: number; height: number }): this {
        this.options.container = container;
        this.resetLines();
        return this;
    }

    setWrapOptions(wrapOptions: WrapOptions): this {
        this.options.wrapOptions = wrapOptions;
        this.resetLines();
        return this;
    }

    print(): this {
        if (this.lines.length == 0) this.splitContentIntoLines();
        const { x, y } = this.options.start;
        const { height } = this.options.container;

        process.stdout.cursorTo(0, y);
        for (let i = 0; i < height - 1; i++) {
            const line = this.lines[i + this.currentLine];
            process.stdout.clearLine(0);
            if (i < this.lines.length && line != undefined) console.log(line);
            else process.stdout.cursorTo(x, y + i);
        }

        return this;
    }

    scroll(lines: number): this {
        if (this.currentLine + lines < 0) this.currentLine = 0;
        else if (this.currentLine + lines > this.lines.length - 1)
            this.currentLine = this.lines.length - 1;

        this.currentLine += lines;
        return this;
    }

    private resetLines(): void {
        this.lines = [];
        this.currentLine = 0;
    }

    private splitContentIntoLines(): void {
        if (!this.options.content) return;

        const wrapped = wrapAnsi(
            this.options.content,
            this.options.container.width,
            this.options.wrapOptions
        );
        this.lines = wrapped.split('\n');
    }
}