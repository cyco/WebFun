import Yoda from "src/engine/type/yoda";
import GameType from "src/engine/type/type";

describe("WebFun.Engine.Type.Yoda", () => {
	let subject: Yoda;
	beforeEach(() => (subject = new Yoda()));
	it("is a class representing a variation of the engine", () => {
		expect(subject).toBeInstanceOf(GameType);
	});

	it("is used to identify a save game's format", () => {
		expect(subject.saveGameMagic).toBe("YODASAV44");
	});

	it("is used to determine which tiles to show in map view", () => {
		expect(subject.locatorTile.here).toEqual(0x345);
	});
});
