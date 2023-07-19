import { expect } from 'chai';
import { ScrollBox, type ScrollBoxOptions } from '../src/index';

describe('ScrollBox builder', () => {
    let scrollBox: ScrollBox;

    beforeEach(() => {
        scrollBox = new ScrollBox();
    });

    describe('setContent', () => {
        it('should set the content and reset the lines', () => {
            const content = 'Lorem ipsum dolor sit amet';
            scrollBox.setContent(content);
            expect(scrollBox.options.content).to.equal(content);
            expect(scrollBox['lines']).to.deep.equal([]);
        });
    });

    describe('setStart', () => {
        it('should set the start position and reset the lines', () => {
            const start = { x: 2, y: 3 };
            scrollBox.setStart(start);
            expect(scrollBox.options.start).to.deep.equal(start);
            expect(scrollBox['lines']).to.deep.equal([]);
        });
    });

    describe('setSize', () => {
        it('should set the size size and reset the lines', () => {
            const size = { width: 20, height: 10 };
            scrollBox.setSize(size);
            expect(scrollBox.options.size).to.deep.equal(size);
            expect(scrollBox['lines']).to.deep.equal([]);
        });
    });

    describe('setWrapOptions', () => {
        it('should set the wrap options and reset the lines', () => {
            const wrapOptions = { hard: false, wordWrap: false, trim: true };
            scrollBox.setWrapOptions(wrapOptions);
            expect(scrollBox.options.wrapOptions).to.deep.equal(wrapOptions);
            expect(scrollBox['lines']).to.deep.equal([]);
        });
    });
});
