import Weapon from './weapon';

describeComponent(Weapon, () => {
	let subject = null;
	beforeEach(() => subject = render(Weapon));

	it('shows which weapon is currently equipped', () => {
		expect(subject).not.toBeNull();
	});

	it('has a setter / getter for the equipped weapon', () => {
		const weapon = {};

		expect(() => subject.weapon = weapon).not.toThrow();
		expect(subject.weapon).toBe(weapon);
	});

	it('shows a blank image if no weapon is set (aka equipped)', () => {
		subject.weapon = null;

		expect(subject.querySelector('img').src).toEqual(Image.blankImage);
	});

	it('shows the correct image if a weapon is set', () => {
		const weapon = { frames: [{ extensionRight: 3 }] };
		subject.data = { tiles: [, , , { image: { dataURL: 'image-data-url' } }, ] };

		subject.weapon = weapon;

		expect(subject.querySelector('img').src).toEndWith('image-data-url');
	});

	it('also shows no image if the weapon does not supply one', () => {
		subject.weapon = { frames: [{ extensionRight: 0xFFFF }] };
		expect(subject.querySelector('img').src).toEqual(Image.blankImage);
	});
});
