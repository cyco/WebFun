import { srand } from '/util';
import shuffle from '/extension/array/shuffle';

describe('Array.shuffle', () =>  {
	it('extends the Array prototype', () =>  {
		let array = [];
		expect(typeof array.shuffle).toBe('function');
	});

	it('wildly shuffles the elements of an array around using our custom prng', () =>  {
		let array;

		srand(0);
		array = ['a', 'b', 'c'];
		array.shuffle();
		expect(array).toEqual(['b', 'c', 'a']);

		srand(0x1234);
		array = ['a', 'b', 'c'];
		array.shuffle();
		expect(array).toEqual(['c', 'a', 'b']);

		srand(0);
		array = ['a', 'b', 'c'];
		array.shuffle();
		expect(array).toEqual(['b', 'c', 'a']);
	});

	it('doesn\'t do anything on empty arrays', () =>  {
		let array = [];
		array.shuffle();

		expect(array.length).toBe(0);
	});
});