import contains from '/extension/array/contains';

describe('Array.contains', () =>  {
	it('extends the Array prototype', () =>  {
		expect(typeof Array.prototype.contains).toBe('function');
	});

	it('returns true if the array contains the specified item', () =>  {
		let array = [1, 2, 3];
		expect(array.contains(2)).toBe(true);

		array = ["test", "value", "in", "array"];
		expect(array.contains("test")).toBe(true);
	});

	it('returns false if the array does not contain the specified item', () =>  {
		let array = [1, 2, 3];
		expect(array.contains(6)).toBe(false);

		array = ["test", "value", "in", "array"];
		expect(array.contains("something")).toBe(false);
	});
});
