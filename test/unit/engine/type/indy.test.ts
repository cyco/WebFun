import Indy from "src/engine/type/indy";
import GameType from "src/engine/type/type";

describe("WebFun.Engine.Type.Indy", () => {
	let subject: Indy;
	beforeEach(() => (subject = new Indy()));
	it("is a class representing a variation of the engine", () => {
		expect(subject).toBeInstanceOf(GameType);
	});

	it("is used to identify a save game's format", () => {
		expect(subject.saveGameMagic).toBe("INDYSAV44");
	});

	it("is used to determine which tiles to show in map view", () => {
		expect(subject.locatorTile.here).toEqual(639);
	});
});
