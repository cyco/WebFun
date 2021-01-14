import Invincibility from "src/engine/cheats/invincibility";
import { Engine } from "src/engine";

describe("WebFun.Engine.Cheats.Invincibility", () => {
	let subject: Invincibility;

	beforeEach(() => (subject = new Invincibility()));

	it("is activated by the code `goyoda`", () => {
		expect(subject.code).toEqual("goyoda");
	});

	it("show the message `Invincible!`", () => {
		expect(subject.message).toEqual("Invincible!");
	});

	it("makes the hero invincible when executed", () => {
		const mockEngine: Engine = { hero: {} } as any;
		subject.execute(mockEngine);
		expect(mockEngine.hero.invincible).toBeTrue();
	});
});
