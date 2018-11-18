import Weapon from "src/app/ui/weapon";

describeComponent(Weapon, () => {
	let subject = null,
		mockImageData = new Uint8Array(32 * 32);
	beforeEach(() => (subject = render(Weapon)));

	it("shows which weapon is currently equipped", () => {
		expect(subject).not.toBeNull();
	});

	it("has a setter / getter for the equipped weapon", () => {
		const weapon = {
			frames: [{ extensionRight: { imageData: {} } }]
		};

		expect(() => (subject.weapon = weapon)).not.toThrow();
		expect(subject.weapon).toBe(weapon);
	});

	it("shows a blank image if no weapon is set (aka equipped)", () => {
		subject.weapon = null;

		expect(subject.querySelector("wf-palette-view").image).toEqual(null);
	});

	it("shows the correct image if a weapon is set", () => {
		const weapon = {
			frames: [{ extensionRight: { imageData: mockImageData } }]
		};
		subject.weapon = weapon;

		expect(subject.querySelector("wf-palette-view").image).toBe(mockImageData);
	});

	it("also shows no image if the weapon does not supply one", () => {
		subject.weapon = { frames: [{ extensionRight: null }] };
		expect(subject.querySelector("wf-palette-view").image).toEqual(null);
	});
});
