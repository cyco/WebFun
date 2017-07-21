import times from "/extension/number/times";

describe('Number.times', () => {
	it('is an extension of the number prototype that executes a callback n-times', () => {
		expect(typeof times).toBe('function');
		expect(typeof Number.prototype.times).toBe('function');
		expect(typeof 5..times).toBe('function');

		let callCounts = 0;
		3..times(() => {
			callCounts++;
		});
		expect(callCounts).toBe(3);
	});

	it('collects all results and returns them', () => {
		expect(5..times(() => 0)).toEqual([0, 0, 0, 0, 0]);
	});
});
