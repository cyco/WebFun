import UnlimitedAmmo from "src/engine/cheats/unlimited-ammo";

describe("WebFun.Unit.Engine.Cheats.UnlimitedAmmo", () => {
	let subject;
	beforeEach(() => (subject = new UnlimitedAmmo()));

	it("is activated by the code `gohan`", () => {
		expect(subject.code).toEqual("gohan");
	});

	it("show the message `Super Smuggler!`", () => {
		expect(subject.message).toEqual("Super Smuggler!");
	});

	it("grants unlimited ammo when executed", () => {
		const mockEngine = { hero: {} };
		subject.execute(mockEngine);
		expect(mockEngine.hero.unlimitedAmmo).toBeTrue();
	});
});
