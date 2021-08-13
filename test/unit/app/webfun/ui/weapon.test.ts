import Weapon from "src/app/webfun/ui/weapon";
import { Character } from "src/engine/objects";
import { PaletteView } from "src/app/webfun/ui";

describeComponent(Weapon, () => {
	let subject: Weapon = null;
	const mockImageData = new Uint8Array(32 * 32);
	beforeEach(() => (subject = render(Weapon) as any));

	it("shows which weapon is currently equipped", () => {
		expect(subject).not.toBeNull();
	});

	it("has a setter / getter for the equipped weapon", () => {
		const weapon: Character = {
			frames: [{ extensionRight: { imageData: {} } }]
		} as any;

		expect(() => (subject.weapon = weapon)).not.toThrow();
		expect(subject.weapon).toBe(weapon);
	});

	it("shows a blank image if no weapon is set (aka equipped)", () => {
		subject.weapon = null;

		expect((subject.querySelector(PaletteView.tagName) as any).image).toEqual(null);
	});

	it("shows the correct image if a weapon is set", () => {
		const weapon: Character = {
			frames: [{ extensionRight: { imageData: mockImageData } }]
		} as any;
		subject.weapon = weapon;

		expect((subject.querySelector(PaletteView.tagName) as any).image).toBe(mockImageData);
	});

	it("also shows no image if the weapon does not supply one", () => {
		subject.weapon = { frames: [{ extensionRight: null }] } as any as Character;
		expect((subject.querySelector(PaletteView.tagName) as any).image).toEqual(null);
	});
});
