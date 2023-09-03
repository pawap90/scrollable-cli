import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { Scrollable } from '../src/index';

describe('Scrollable', () => {
    let scrollable: Scrollable;

    beforeEach(() => {
        scrollable = new Scrollable({ stdout: createFakeStdout() });
    });

    describe('print', () => {
        let spyWrite: SinonSpy;

        beforeEach(() => {
            spyWrite = spy(scrollable.options.stdout, 'write');
        });

        afterEach(() => {
            spyWrite.restore();
        });

        it('should print the content to the console', () => {
            scrollable
                .setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const emptyLine = '            \n';

            scrollable.print();

            expect(spyWrite.callCount).to.equal(6);
            expect(spyWrite.getCall(0).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(1).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(2).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(3).args[0]).to.equal('Lorem ipsum\n');
            expect(spyWrite.getCall(4).args[0]).to.equal('dolor sit\n');
            expect(spyWrite.getCall(5).args[0]).to.equal('amet\n');
        });

        it('should print the content considering newlines', () => {
            scrollable
                .setContent(
                    'Lorem \nipsum dolor sit\n amet consectetur adipiscing elit sed do eiusmod'
                )
                .setSize({ width: 12, height: 3 });

            const emptyLine = '            \n';

            scrollable.print();

            expect(spyWrite.callCount).to.equal(6);
            
            expect(spyWrite.getCall(0).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(1).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(2).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(3).args[0]).to.equal('Lorem\n');
            expect(spyWrite.getCall(4).args[0]).to.equal('ipsum dolor\n');
            expect(spyWrite.getCall(5).args[0]).to.equal('sit\n');
        });

        it('should print the content considering ANSI codes', () => {
            scrollable
                .setContent(
                    //       ┌─────────red────────┐
                    '\x1b[31mLorem ipsum dolor sit\x1b[0m amet consectetur adipiscing elit sed do eiusmod'
                )
                .setSize({ width: 14, height: 4 });

            const emptyLine = '              \n';
            scrollable.print();

            expect(spyWrite.callCount).to.equal(8);
            expect(spyWrite.getCall(0).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(1).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(2).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(3).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(4).args[0]).to.equal('\x1b[31mLorem ipsum\u001b[39m\n');
            expect(spyWrite.getCall(5).args[0]).to.equal('\u001b[31mdolor sit\u001b[0m amet\n');
            expect(spyWrite.getCall(6).args[0]).to.equal('consectetur\n');
            expect(spyWrite.getCall(7).args[0]).to.equal('adipiscing\n');
        });
    });

    describe('scroll', () => {
        let spyWrite: SinonSpy;

        beforeEach(() => {
            spyWrite = spy(scrollable.options.stdout, 'write');
        });

        afterEach(() => {
            spyWrite.restore();
        });

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

            const emptyLine = '            \n';
            scrollable.scroll(4).print();

            expect(spyWrite.callCount).to.equal(6);
            expect(spyWrite.getCall(0).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(1).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(2).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(3).args[0]).to.equal('adipiscing\n');
            expect(spyWrite.getCall(4).args[0]).to.equal('elit sed do\n');
            expect(spyWrite.getCall(5).args[0]).to.equal('eiusmod\n');
        });

        it('should print the correct lines after scrolling up', () => {
            scrollable
                .setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const emptyLine = '            \n';
            scrollable.scroll(-2).print();

            expect(spyWrite.callCount).to.equal(6);
            expect(spyWrite.getCall(0).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(1).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(2).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(3).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(4).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(5).args[0]).to.equal('Lorem ipsum\n');
        });

        it('should print the correct lines after scrolling up and down', () => {
            scrollable
                .setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const emptyLine = '            \n';
            scrollable.scroll(5).print();

            expect(spyWrite.getCall(0).args[0]).to.equal(emptyLine);       //
            expect(spyWrite.getCall(1).args[0]).to.equal(emptyLine);       // Clear the area.
            expect(spyWrite.getCall(2).args[0]).to.equal(emptyLine);       //

            expect(spyWrite.getCall(3).args[0]).to.equal('elit sed do\n');   //
            expect(spyWrite.getCall(4).args[0]).to.equal('eiusmod\n');       // Print the content.
            expect(spyWrite.getCall(5).args[0]).to.equal(emptyLine);       //

            scrollable.scroll(-2).print();

            expect(spyWrite.callCount).to.equal(12);
            expect(spyWrite.getCall(6).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(7).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(8).args[0]).to.equal(emptyLine);

            expect(spyWrite.getCall(9).args[0]).to.equal('consectetur\n');
            expect(spyWrite.getCall(10).args[0]).to.equal('adipiscing\n');
            expect(spyWrite.getCall(11).args[0]).to.equal('elit sed do\n');
        });
    });

    describe('clear', () => {
        let spyWrite: SinonSpy;

        beforeEach(() => {
            spyWrite = spy(scrollable.options.stdout, 'write');
        });

        afterEach(() => {
            spyWrite.restore();
        });

        it('should clear the area', () => {
            scrollable
                .setContent('Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod')
                .setSize({ width: 12, height: 3 })
                .setStart({ x: 2, y: 3 });

            const emptyLine = '            \n';
            scrollable.print();

            expect(spyWrite.callCount).to.equal(6);
            expect(spyWrite.getCall(0).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(1).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(2).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(3).args[0]).to.equal('Lorem ipsum\n');
            expect(spyWrite.getCall(4).args[0]).to.equal('dolor sit\n');
            expect(spyWrite.getCall(5).args[0]).to.equal('amet\n');

            scrollable.clear();

            expect(spyWrite.callCount).to.equal(9);
            expect(spyWrite.getCall(6).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(7).args[0]).to.equal(emptyLine);
            expect(spyWrite.getCall(8).args[0]).to.equal(emptyLine);
        });
    });
});

function createFakeStdout(): NodeJS.WriteStream {
    return {
        rows: 20,
        columns: 40,
        cursorTo: (x: number, y: number) => {
            return true;
        },
        write: (str: string) => {
            return true;
        }
    } as unknown as NodeJS.WriteStream;
}
