import { emitKeypressEvents } from 'node:readline';
import { Scrollable } from '../src/index';
import chalk from 'chalk';

console.clear();

const size = { width: 15, height: 6 };

const catBox = new Scrollable({
    content: `
     /\\_/\\
    (${chalk.greenBright(' o') + chalk.red('.') + chalk.greenBright('o ')})
`,
    start: { x: 6, y: 2 },
    size,
    wrapOptions: { trim: false }
})
    .scroll(-1) // Center vertically.
    .print();

const cowBox = new Scrollable({
    content: `
    ${chalk.yellow('((...))')}
    ( O O )
     \\   /
     ${chalk.magenta('(`_`)')}
`,
    start: { x: 30, y: 2 },
    size,
    wrapOptions: { trim: false }
}).print();

const storyBox = new Scrollable({
    content:
        'The cat and the cow where playing hide and seek. The cat was hiding in the barn, but the cow was too big to fit inside. \n' +
        'The cow was hiding in the field, but the cat was too small to see over the grass. \n' +
        'The cat was looking for the cow, and the cow was looking for the cat. \n' +
        'They stumbled upon a ' + chalk.magenta('magical portal') + ' in the middle of the field. ' +
        'Curiosity getting the best of them, they jumped in together. ' +
        'Inside, they found a talking mushroom that offered them three wishes each. ' +
        'The cat wished for a jetpack, the cow wished for wings, and they zoomed off into the sky. ' +
        'Soon, they encountered a UFO piloted by alien chefs who challenged them to a cooking competition. ' +
        'The cat whipped up intergalactic lasagna, and the cow produced flying milkshakes. ' +
        'The judges declared them winners, and they were crowned ' +
        chalk.italic.yellow('rulers of the galaxy.'),
    start: { x: 5, y: 10 },
    size: { width: 40, height: 3 }
}).print();

printBoxBorders(catBox);
printBoxBorders(cowBox);

process.stdout.cursorTo(0, 15);

console.log('Up [↑] and down [↓] arrow keys to scroll. [Q] to quit');

// Handle key press events

emitKeypressEvents(process.stdin);

process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.name == 'up') {
        cowBox.scroll(-1).print();
        catBox.scroll(1).print();
        storyBox.scroll(1).print();
        process.stdout.cursorTo(0, 15);
    }
    if (key.name == 'down') {
        cowBox.scroll(1).print();
        catBox.scroll(-1).print();
        storyBox.scroll(1).print();
        process.stdout.cursorTo(0, 15);
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
