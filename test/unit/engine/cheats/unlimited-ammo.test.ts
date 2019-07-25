import UnlimitedAmmo from "src/engine/cheats/unlimited-ammo";
import { Engine } from "src/engine";

describe("WebFun.Engine.Cheats.UnlimitedAmmo", () => {
	let subject: UnlimitedAmmo;
	beforeEach(() => (subject = new UnlimitedAmmo()));

	it("is activated by the code `gohan`", () => {
		expect(subject.code).toEqual("gohan");
	});

	it("show the message `Super Smuggler!`", () => {
		expect(subject.message).toEqual("Super Smuggler!");
	});

	it("grants unlimited ammo when executed", () => {
		const mockEngine: Engine = { hero: {} } as any;
		subject.execute(mockEngine);
		expect(mockEngine.hero.unlimitedAmmo).toBeTrue();
	});
});
