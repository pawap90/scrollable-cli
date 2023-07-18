import { expect, config } from 'chai';
import ScrollBox from '../src/index';
import { ScrollBox as ScrollBoxClass, ScrollBoxOptions } from '../src/index';

const defaultOptions: ScrollBoxOptions = {
    content: undefined,
    start: { x: 0, y: 0 },
    container: { width: process.stdout.columns, height: process.stdout.rows },
    wrapOptions: { hard: false, wordWrap: true, trim: true }
};

config.truncateThreshold = 0;

describe('ScrollBox initialization', () => {
    describe('constructor', () => {
        it('should create a new instance of ScrollBox with default options', () => {
            const scrollBox = new ScrollBoxClass();
            expect(scrollBox).to.be.an.instanceOf(ScrollBoxClass);
            expect(scrollBox.options).to.deep.equal(defaultOptions);
        });

        it('should create a new instance of ScrollBox with custom options', () => {
            const options: ScrollBoxOptions = {
                content: 'Lorem ipsum dolor sit amet',
                start: { x: 2, y: 3 },
                container: { width: 20, height: 10 },
                wrapOptions: { hard: false, wordWrap: false, trim: true }
            };
            const scrollBox = new ScrollBoxClass(options);
            expect(scrollBox).to.be.an.instanceOf(ScrollBoxClass);
            expect(scrollBox.options).to.deep.equal(options);
        });

        it('should create a new instance of ScrollBox with empty options', () => {
            const scrollBox = new ScrollBoxClass({});
            expect(scrollBox).to.be.an.instanceOf(ScrollBoxClass);
            expect(scrollBox.options).to.deep.equal(defaultOptions);
        });
    });

    describe('default entry point', () => {
        it('should create a new instance of ScrollBox with default options', () => {
            const scrollBox = ScrollBox();
            expect(scrollBox).to.be.an.instanceOf(ScrollBoxClass);
            expect(scrollBox.options).to.deep.equal(defaultOptions);
        });

        it('should create a new instance of ScrollBox with custom options', () => {
            const options: ScrollBoxOptions = {
                content: 'Lorem ipsum dolor sit amet',
                start: { x: 2, y: 3 },
                container: { width: 20, height: 10 },
                wrapOptions: { hard: false, wordWrap: false, trim: true }
            };
            const scrollBox = ScrollBox(options);
            expect(scrollBox).to.be.an.instanceOf(ScrollBoxClass);
            expect(scrollBox.options).to.deep.equal(options);
        });

        it('should create a new instance of ScrollBox with empty options', () => {
            const scrollBox = ScrollBox({});
            expect(scrollBox).to.be.an.instanceOf(ScrollBoxClass);
            expect(scrollBox.options).to.deep.equal(defaultOptions);
        });
    });
});
