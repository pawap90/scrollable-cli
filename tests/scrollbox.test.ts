import { expect } from 'chai';
import { spy } from 'sinon';
import src, { ScrollBox } from '../src/index';

describe('ScrollBox', () => {
    let scrollBox: ScrollBox;

    beforeEach(() => {
        scrollBox = new ScrollBox();
    });

    describe('print', () => {
        it('should print the content to the console', () => {
            scrollBox.setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollBox.print();

            expect(spyConsoleLog.callCount).to.equal(3);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('Lorem ipsum ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('dolor sit   ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('amet        ');
            spyConsoleLog.restore();
        });

        it('should print the content considering newlines', () => {
            scrollBox
                .setContent(
                    'Lorem \nipsum dolor sit\n amet consectetur adipiscing elit sed do eiusmod'
                )
                .setSize({ width: 12, height: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollBox.print();

            expect(spyConsoleLog.callCount).to.equal(3);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('Lorem       ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('ipsum dolor ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('sit         ');
            spyConsoleLog.restore();
        });

        it('should print the content considering ANSI codes', () => {
            scrollBox
                .setContent(
                    //       ┌─────────red────────┐
                    '\x1b[31mLorem ipsum dolor sit\x1b[0m amet consectetur adipiscing elit sed do eiusmod'
                )
                .setSize({ width: 14, height: 4 });

            const spyConsoleLog = spy(console, 'log');

            scrollBox.print();

            expect(spyConsoleLog.callCount).to.equal(4);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('\x1b[31mLorem ipsum\u001b[39m');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('\u001b[31mdolor sit\u001b[0m amet');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('consectetur   ');
            expect(spyConsoleLog.getCall(3).args[0]).to.equal('adipiscing    ');
            spyConsoleLog.restore();
        });
    });

    describe('scroll', () => {
        it('should scroll the content up by the given number of lines', () => {
            scrollBox.setContent(
                'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod'
            );

            scrollBox.scroll(1);
            expect(scrollBox['currentLine']).to.equal(1);

            scrollBox.scroll(-2);
            expect(scrollBox['currentLine']).to.equal(-1);

            scrollBox.scroll(5);
            expect(scrollBox['currentLine']).to.equal(4);
        });

        it('should print the correct lines after scrolling down', () => {
            scrollBox.setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollBox
                .scroll(4)
                .print();

            expect(spyConsoleLog.callCount).to.equal(3);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('adipiscing  ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('elit sed do ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('eiusmod     ');
            spyConsoleLog.restore();
        });

        it('should print the correct lines after scrolling up', () => {
            scrollBox.setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollBox
                .scroll(-2)
                .print();

            expect(spyConsoleLog.callCount).to.equal(3);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('            ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('            ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('Lorem ipsum ');
            spyConsoleLog.restore();
        });

        it('should print the correct lines after scrolling up and down', () => {
            scrollBox.setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollBox
                .scroll(5)
                .print();

            expect(spyConsoleLog.getCall(0).args[0]).to.equal('elit sed do ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('eiusmod     ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('            ');

            scrollBox
                .scroll(-2)
                .print();

            expect(spyConsoleLog.callCount).to.equal(6);
            expect(spyConsoleLog.getCall(3).args[0]).to.equal('consectetur ');
            expect(spyConsoleLog.getCall(4).args[0]).to.equal('adipiscing  ');
            expect(spyConsoleLog.getCall(5).args[0]).to.equal('elit sed do ');
            spyConsoleLog.restore();
        });
    });
});
