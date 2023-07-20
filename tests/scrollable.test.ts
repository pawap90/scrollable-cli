import { expect } from 'chai';
import { spy } from 'sinon';
import { Scrollable } from '../src/index';

describe('Scrollable', () => {
    let scrollable: Scrollable;

    beforeEach(() => {
        scrollable = new Scrollable();
    });

    describe('print', () => {
        it('should print the content to the console', () => {
            scrollable
                .setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollable.print();

            expect(spyConsoleLog.callCount).to.equal(3);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('Lorem ipsum ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('dolor sit   ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('amet        ');
            spyConsoleLog.restore();
        });

        it('should print the content considering newlines', () => {
            scrollable
                .setContent(
                    'Lorem \nipsum dolor sit\n amet consectetur adipiscing elit sed do eiusmod'
                )
                .setSize({ width: 12, height: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollable.print();

            expect(spyConsoleLog.callCount).to.equal(3);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('Lorem       ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('ipsum dolor ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('sit         ');
            spyConsoleLog.restore();
        });

        it('should print the content considering ANSI codes', () => {
            scrollable
                .setContent(
                    //       ┌─────────red────────┐
                    '\x1b[31mLorem ipsum dolor sit\x1b[0m amet consectetur adipiscing elit sed do eiusmod'
                )
                .setSize({ width: 14, height: 4 });

            const spyConsoleLog = spy(console, 'log');

            scrollable.print();

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
            scrollable.setContent(
                'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod'
            );

            scrollable.scroll(1);
            expect(scrollable['currentLine']).to.equal(1);

            scrollable.scroll(-2);
            expect(scrollable['currentLine']).to.equal(-1);

            scrollable.scroll(5);
            expect(scrollable['currentLine']).to.equal(4);
        });

        it('should print the correct lines after scrolling down', () => {
            scrollable
                .setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollable.scroll(4).print();

            expect(spyConsoleLog.callCount).to.equal(3);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('adipiscing  ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('elit sed do ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('eiusmod     ');
            spyConsoleLog.restore();
        });

        it('should print the correct lines after scrolling up', () => {
            scrollable
                .setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollable.scroll(-2).print();

            expect(spyConsoleLog.callCount).to.equal(3);
            expect(spyConsoleLog.getCall(0).args[0]).to.equal('            ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('            ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('Lorem ipsum ');
            spyConsoleLog.restore();
        });

        it('should print the correct lines after scrolling up and down', () => {
            scrollable
                .setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const spyConsoleLog = spy(console, 'log');

            scrollable.scroll(5).print();

            expect(spyConsoleLog.getCall(0).args[0]).to.equal('elit sed do ');
            expect(spyConsoleLog.getCall(1).args[0]).to.equal('eiusmod     ');
            expect(spyConsoleLog.getCall(2).args[0]).to.equal('            ');

            scrollable.scroll(-2).print();

            expect(spyConsoleLog.callCount).to.equal(6);
            expect(spyConsoleLog.getCall(3).args[0]).to.equal('consectetur ');
            expect(spyConsoleLog.getCall(4).args[0]).to.equal('adipiscing  ');
            expect(spyConsoleLog.getCall(5).args[0]).to.equal('elit sed do ');
            spyConsoleLog.restore();
        });
    });
});
