import identify from "src/engine/save-game/identify";
import { Yoda, Indy } from "src/engine/type";

describe("WebFun.Engine.SaveGame.identify", () => {
	it("identifies yoda's save games correctly", () => {
		let stream = mockStream("YODASAV44");
		expect(identify(stream)).toBe(Yoda);
	});

	it("identifies indys's save games correctly", () => {
		let stream = mockStream("INDYSAV44");
		expect(identify(stream)).toBe(Indy);
	});

	it("throws an exception if the save game can not be identified", () => {
		let stream = mockStream("UNKNOWN44");
		expect(() => identify(stream)).toThrow();
	});

	function mockStream(characters) {
		return { getCharacters: () => characters };
	}
});
