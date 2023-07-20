import { emitKeypressEvents } from 'node:readline';
import { Scrollable } from '../src/index';

console.clear();

const size = { width: 15, height: 6 };

const catBox = new Scrollable({
    content: `
     /\\_/\\
    ( o.o )
`,
    start: { x: 4, y: 2 },
    size,
    wrapOptions: { trim: false }
})
    .scroll(-1) // Center vertically.
    .print();

const cowBox = new Scrollable({
    content: `
    ((...))
    ( O O )
     \\   /
     (\`_\`)
`,
    start: { x: 24, y: 2 },
    size,
    wrapOptions: { trim: false }
}).print();

printBoxBorders(catBox);
printBoxBorders(cowBox);

process.stdout.cursorTo(0, 10);

console.log('Up [↑] and down [↓] arrow keys to scroll. [Q] to quit');

// Handle key press events

emitKeypressEvents(process.stdin);

process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.name == 'up') {
        cowBox.scroll(-1).print();
        catBox.scroll(1).print();
        process.stdout.cursorTo(0, 10);
    }
    if (key.name == 'down') {
        cowBox.scroll(1).print();
        catBox.scroll(-1).print();
        process.stdout.cursorTo(0, 10);
    }
    if (key.name == 'q') {
        process.exit();
    }
});

function printBoxBorders(box: Scrollable) {
    const { stdout } = process;
    const { size, start } = box.options;
    
    const height = size.height + 2;
    const width = size.width + 2;
    const x = start.x - 1;
    const y = start.y - 1;

    stdout.cursorTo(x, y);
    console.log(Array(width).fill('─').join(''));
    stdout.cursorTo(x, y + height - 1);
    console.log(Array(width).fill('─').join(''));
    
    for (let i = 0; i < height - 1; i++) {
        stdout.cursorTo(x, y + i);
        console.log('│');
        stdout.cursorTo(x + width - 1, y + i);
        console.log('│');
    }

    stdout.cursorTo(x, y);
    console.log('╭');
    stdout.cursorTo(x + width - 1, y);
    console.log('╮');
    stdout.cursorTo(x, y + height - 1);
    console.log('╰');
    stdout.cursorTo(x + width - 1, y + height - 1);
    console.log('╯');
}