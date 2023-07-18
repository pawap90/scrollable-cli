import { setTimeout } from 'timers/promises';
import { ScrollBox } from '../src/scrollbox';

const content =
    'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';
const start = { x: 10, y: 3 };
const container = { width: 20, height: 5 };
const scrollBox = new ScrollBox({ content, start, container });

console.clear();

// Print background.
for (let i = 0; i < 10; i++) {
    console.log(Array(40).fill('.').join(''));
}

(async () => {
    await autoscroll('down');
    await autoscroll('up');

    process.stdout.cursorTo(0, 10);
})();

async function autoscroll(direction: 'up' | 'down') {
    for (let i = 0; i < 8; i++) {
        scrollBox.print();
        scrollBox.scroll(direction == 'up' ? -1 : 1);
        await setTimeout(1000);
    }
}