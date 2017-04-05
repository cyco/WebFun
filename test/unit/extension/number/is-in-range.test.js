import isInRange from '/extension/number/is-in-range';

describe('Number.isInRange', () => {
	it('is an extension of the number prototype that executes a callback n-times', () => {
		expect(typeof isInRange).toBe('function');
		expect(typeof Number.prototype.isInRange).toBe('function');

		expect(5..isInRange(0, 7)).toBe(true);
		expect(5..isInRange(5, 7)).toBe(true);
		expect(7..isInRange(5, 7)).toBe(true);
		expect(5..isInRange(0, 1)).toBe(false);
		expect(5..isInRange(6, 7)).toBe(false);
	});
});
