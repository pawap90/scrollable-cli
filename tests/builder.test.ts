import { expect } from 'chai';
import { Scrollable } from '../src/index';

describe('Scrollable builder', () => {
    let scrollable: Scrollable;

    beforeEach(() => {
        scrollable = new Scrollable();
    });

    describe('setContent', () => {
        it('should set the content and reset the lines', () => {
            const content = 'Lorem ipsum dolor sit amet';
            scrollable.setContent(content);
            expect(scrollable.options.content).to.equal(content);
            expect(scrollable['lines']).to.deep.equal([]);
        });
    });

    describe('setStart', () => {
        it('should set the start position and reset the lines', () => {
            const start = { x: 2, y: 3 };
            scrollable.setStart(start);
            expect(scrollable.options.start).to.deep.equal(start);
            expect(scrollable['lines']).to.deep.equal([]);
        });
    });

    describe('setSize', () => {
        it('should set the size size and reset the lines', () => {
            const size = { width: 20, height: 10 };
            scrollable.setSize(size);
            expect(scrollable.options.size).to.deep.equal(size);
            expect(scrollable['lines']).to.deep.equal([]);
        });
    });

    describe('setWrapOptions', () => {
        it('should set the wrap options and reset the lines', () => {
            const wrapOptions = { hard: false, wordWrap: false, trim: true };
            scrollable.setWrapOptions(wrapOptions);
            expect(scrollable.options.wrapOptions).to.deep.equal(wrapOptions);
            expect(scrollable['lines']).to.deep.equal([]);
        });
    });
});
