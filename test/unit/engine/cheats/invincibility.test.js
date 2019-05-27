import Invincibility from "src/engine/cheats/invincibility";

describe("WebFun.Unit.Engine.Cheats.Invincibility", () => {
	let subject;
	beforeEach(() => (subject = new Invincibility()));

	it("is activated by the code `goyoda`", () => {
		expect(subject.code).toEqual("goyoda");
	});

	it("show the message `Invincible!`", () => {
		expect(subject.message).toEqual("Invincible!");
	});

	it("makes the hero invinicible when executed", () => {
		const mockEngine = { hero: {} };
		subject.execute(mockEngine);
		expect(mockEngine.hero.invincible).toBeTrue();
	});
});
