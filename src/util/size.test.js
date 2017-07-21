import Size from "/util/size";

describe('Size', () => {
	it('is a simple that represents a size', () => {
		expect(typeof Size).toBe('function');

		let aSize = new Size(10, 3);
		expect(aSize.width).toBe(10);
		expect(aSize.height).toBe(3);
	});

	it('properly converts to a human-readable string', () => {
		let size = new Size(2, 3);
		expect(size.toString()).toBe('Size {2x3}');
		expect("" + size).toBe('Size {2x3}');
	});
});
