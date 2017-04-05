import Char from '/engine/objects/char';

describe('Char', () => {
	it('is a class representing character specification', () => {
		let char = new Char();
		expect(char instanceof Char).toBe(true);
	});
});
