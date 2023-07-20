import { expect, config } from 'chai';
import Scrollable from '../src/index';
import { Scrollable as ScrollableClass, type ScrollableOptions } from '../src/index';

const defaultOptions: ScrollableOptions = {
    content: undefined,
    start: { x: 0, y: 0 },
    size: { width: process.stdout.columns, height: process.stdout.rows },
    wrapOptions: { hard: false, wordWrap: true, trim: true }
};

config.truncateThreshold = 0;

describe('Scrollable initialization', () => {
    describe('constructor', () => {
        it('should create a new instance of Scrollable with default options', () => {
            const scrollable = new ScrollableClass();
            expect(scrollable).to.be.an.instanceOf(ScrollableClass);
            expect(scrollable.options).to.deep.equal(defaultOptions);
        });

        it('should create a new instance of Scrollable with custom options', () => {
            const options: ScrollableOptions = {
                content: 'Lorem ipsum dolor sit amet',
                start: { x: 2, y: 3 },
                size: { width: 20, height: 10 },
                wrapOptions: { hard: false, wordWrap: false, trim: true }
            };
            const scrollable = new ScrollableClass(options);
            expect(scrollable).to.be.an.instanceOf(ScrollableClass);
            expect(scrollable.options).to.deep.equal(options);
        });

        it('should create a new instance of Scrollable with empty options', () => {
            const scrollable = new ScrollableClass({});
            expect(scrollable).to.be.an.instanceOf(ScrollableClass);
            expect(scrollable.options).to.deep.equal(defaultOptions);
        });
    });

    describe('default entry point', () => {
        it('should create a new instance of Scrollable with default options', () => {
            const scrollable = Scrollable();
            expect(scrollable).to.be.an.instanceOf(ScrollableClass);
            expect(scrollable.options).to.deep.equal(defaultOptions);
        });

        it('should create a new instance of Scrollable with custom options', () => {
            const options: ScrollableOptions = {
                content: 'Lorem ipsum dolor sit amet',
                start: { x: 2, y: 3 },
                size: { width: 20, height: 10 },
                wrapOptions: { hard: false, wordWrap: false, trim: true }
            };
            const scrollable = Scrollable(options);
            expect(scrollable).to.be.an.instanceOf(ScrollableClass);
            expect(scrollable.options).to.deep.equal(options);
        });

        it('should create a new instance of Scrollable with empty options', () => {
            const scrollable = Scrollable({});
            expect(scrollable).to.be.an.instanceOf(ScrollableClass);
            expect(scrollable.options).to.deep.equal(defaultOptions);
        });
    });
});
