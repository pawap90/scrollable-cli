import { setTimeout } from 'timers/promises';
import Scrollable from '../src/index';

const box = Scrollable()
    .setContent(
        'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
    )
    .setStart({ x: 10, y: 3 })
    .setSize({ width: 20, height: 5 });

console.clear();

// Print background.
for (let i = 0; i < 10; i++) {
    console.log(Array(40).fill('.').join(''));
}

(async () => {
    await autoscroll('down');
    await autoscroll('up');

    process.stdout.cursorTo(0, 11);
})();

async function autoscroll(direction: 'up' | 'down') {
    for (let i = 0; i < 8; i++) {
        box.print().scroll(direction == 'up' ? -1 : 1);
        await setTimeout(1000);
    }
}
