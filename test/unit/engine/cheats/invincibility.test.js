import InvincibilityCheat from '/engine/cheats/invincibility';

describe('InvincibilityCheat', () => {
	let subject;
	beforeEach(() => subject = new InvincibilityCheat());

	it('is activated by the code `goyoda`', () => {
		expect(subject.code).toEqual('goyoda');
	});

	it('show the message `Super Smuggler!`', () => {
		expect(subject.message).toEqual('Invincible!');
	});

	it('makes the hero invinicible when executed', () => {
		const mockEngine = { hero: {} };
		subject.execute(mockEngine);
		expect(mockEngine.hero.invincible).toBeTrue();
	});
});
