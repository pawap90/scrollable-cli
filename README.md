Create independent scrollable areas with ANSI support in the terminal.

![3 scrollable areas controller by the arrow keys](https://github.com/pawap90/scrollable-cli/assets/2507959/c9f34db9-65b0-4629-8ebc-cd840f729c21)


## Install

```sh
npm install scrollable-cli
```

## Usage

Create a scrollable area with content and print it:

```ts
import Scrollable from 'scrollable-cli';

const box = Scrollable({
    content:
        "Lorem ipsum is boring but I couldn't think " +
        "of anything else, so here's a yellow cat:" +
        chalk.yellow(`
        |\\---/|
        | o_o |
        `),
    start: { x: 10, y: 3 },
    size: { width: 22, height: 4 },
    wrapOptions: { trim: false, hard: false, wordWrap: true }
})
.print();
```

Or use the fluent API:

```ts
const box = Scrollable()
    .setContent("...")
    .setStart({ x: 10, y: 3 })
    .setSize({ width: 22, height: 4 })
    .setWrapOptions({ trim: false, hard: false, wordWrap: true })
    .print();
```

Scroll the content up and down:

```ts
box.scroll(1).print(); // Down

box.scroll(-1).print(); //Up
```

### Key press events
This package doesn't handle keypress events to make it easier for you to integrate it with your own keypress event handler: 

```ts
const box = Scrollable(/* ... */);

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    switch (key.name) {
    case 'up':
        box.scroll(-1).print();
        break;
    case 'down':
        box.scroll(1).print();
        break;
    }
});
```

![a single scrollable area with text and ansi codes](https://github.com/pawap90/scrollable-cli/assets/2507959/db063b13-0777-428d-831c-73be5ba55fd0)

## Examples

```sh
npm run example --file=<example-file-name>

## Or for windows:
npm run example:win --file=<example-file-name>

## E.g:
npm run example --file=1-simple-box

npm run example:win --file=1-simple-box
```

| Example file | Description |
| -------- | -------- |
| [1-simple-box](/examples/1-simple-box.ts) | Prints a simple "lorem ipsum" box that scrolls automatically up and down. |
| [2-keypress-events](/examples/2-keypress-events.ts) | Prints 3 independent boxes that can be scrolled up and down with the arrow keys. |

## Test

```sh
npm test
```


