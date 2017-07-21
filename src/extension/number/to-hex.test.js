import toHex from "/extension/number/to-hex";

describe('Number.toHex', () => {
	it('is an extension of the number prototype', () => {
		expect(typeof Number.prototype.toHex).toBe('function');
		expect(typeof toHex).toBe('function');
	});

	it('formats the number as 0x-prefixed hex string', () => {
		expect(0..toHex()).toBe('0x0');
		expect(10..toHex()).toBe('0xa');
		expect(0xFF.toHex()).toBe('0xff');
	});

	it('takes an optional argument specifiy how many digits a number should use', () => {
		expect(0..toHex(3)).toBe('0x000');
		expect(10..toHex(2)).toBe('0x0a');
		expect(0xFF.toHex(1)).toBe('0xff');
	});
});
