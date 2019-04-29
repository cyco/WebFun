import identify from "src/engine/save-game/identify";
import { Indy, Yoda } from "src/engine/type";

describe("WebFun.Engine.SaveGame.identify", () => {
	it("identifies yoda's save games correctly", () => {
		const stream = mockStream("YODASAV44");
		expect(identify(stream)).toBe(Yoda);
	});

	it("identifies indys's save games correctly", () => {
		const stream = mockStream("INDYSAV44");
		expect(identify(stream)).toBe(Indy);
	});

	it("throws an exception if the save game can not be identified", () => {
		const stream = mockStream("UNKNOWN44");
		expect(() => identify(stream)).toThrow();
	});

	function mockStream(characters) {
		return { getCharacters: () => characters };
	}
});
