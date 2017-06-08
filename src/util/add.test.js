import add from './add'

describe('add', () => {
	it('is a function', () => {
		expect(add).toBeFunction();
	});

	it('is usually used in a reduce call', () => {
		const sum = [1, 2, 3].reduce(add, 0);
		expect(sum).toBe(6);
	});
});
