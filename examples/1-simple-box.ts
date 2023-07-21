import { setTimeout } from 'timers/promises';
import chalk from 'chalk';
import Scrollable from '../src/index';

console.clear();

// Print background.
for (let i = 0; i < 10; i++) {
    console.log(Array(42).fill('.').join(''));
}

const box = Scrollable()
    .setContent(
        "Lorem ipsum is boring but I couldn't think of anything else, so here's a yellow cat:" +
        chalk.yellow(`
        |\\---/|
        | o_o |
        `)
    )
    .setStart({ x: 12, y: 3 })
    .setSize({ width: 22, height: 4 })
    .setWrapOptions({ trim: false, hard: false, wordWrap: true })
    .print();

(async () => {
    await autoscroll('down');
    await autoscroll('up');

    process.stdout.cursorTo(0, 11);
})();

async function autoscroll(direction: 'up' | 'down') {
    await setTimeout(500);
    for (let i = 0; i < 6; i++) {
        box.scroll(direction == 'up' ? -1 : 1).print();
        await setTimeout(500);
    }
}
