import trimCharacter from "/extension/string/trim-character";

describe("String.trimCharacter", () => {
	let subject;

	it('is a function extending the String prototype', () => {
		expect('test'.trimCharacter).toBeFunction();
		expect(trimCharacter).toBeFunction();
	});

	it('removes the specified character from both ends', () => {
		subject = '  test    ';
		expect(subject.trimCharacter(' ')).toBe('test');

		subject = '++test+++';
		expect(subject.trimCharacter('+')).toBe('test');
	});

	it('removes spaces if no other character is specified', () => {
		subject = '  test    ';
		expect(subject.trimCharacter()).toBe('test');
	});
});
