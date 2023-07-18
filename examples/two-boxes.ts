import { setTimeout } from 'timers/promises';
import { ScrollBox } from '../src/index';

const asciiCat = `
     /\\_/\\
    ( o.o )
`;

const asciiCow = `
    ((...))
    ( O O )
     \\   /
     (\`_\`)
`;

const container = { width: 16, height: 6 };
const catBox = new ScrollBox({
    content: asciiCat,
    start: { x: 2, y: 3 },
    container,
    wrapOptions: { trim: false }
});

const cowBox = new ScrollBox({ content: asciiCow, start: { x: 20, y: 3 }, container, wrapOptions: { trim: false } });

console.clear();

// Print background.
for (let i = 0; i < 10; i++) {
    console.log(Array(40).fill('.').join(''));
}

(async () => {
    await Promise.all([autoscroll('down', catBox), autoscroll('up', cowBox)]);
    await Promise.all([autoscroll('up', catBox), autoscroll('down', cowBox)]);

    process.stdout.cursorTo(0, 10);
})();

async function autoscroll(direction: 'up' | 'down', scrollBox: ScrollBox) {
    for (let i = 0; i < 6; i++) {
        scrollBox.print();
        scrollBox.scroll(direction == 'up' ? -1 : 1);
        await setTimeout(500);
    }
}
