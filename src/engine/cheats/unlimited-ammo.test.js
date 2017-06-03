import UnlimitedAmmoCheat from '/engine/cheats/unlimited-ammo';

describe('UnlimitedAmmoCheat', () => {
	let subject;
	beforeEach(() => subject = new UnlimitedAmmoCheat());

	it('is activated by the code `gohan`', () => {
		expect(subject.code).toEqual('gohan');
	});

	it('show the message `Super Smuggler!`', () => {
		expect(subject.message).toEqual('Super Smuggler!');
	});

	it('grants unlimited ammo when executed', () => {
		const mockEngine = { hero: {} };
		subject.execute(mockEngine);
		expect(mockEngine.hero.unlimitedAmmo).toBeTrue();
	});
});
