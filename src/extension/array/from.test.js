import From from '/extension/array/from';

describe('Array.from', () =>  {
	it('is a static function on Array, polyfilled if necessary', () => {
		expect(typeof From).toBe('function');
		expect(typeof Array.from).toBe('function');
	});
	
	it('creates an array from an array-like object (like a node list)', () => {
		const arrayLike = { 0: "test", 1: "values", length: 2};
		const array = From(arrayLike);
		
		expect(array instanceof Array).toBeTrue();
		expect(typeof array.map).toBe('function');
	});
});