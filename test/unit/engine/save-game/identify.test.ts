import identify from "src/engine/save-game/identify";
import { Indy, Yoda } from "src/engine/type";
import { InputStream } from "src/util";

describe("WebFun.Engine.SaveGame.identify", () => {
	it("identifies yoda's save games correctly", () => {
		const stream = mockStream("YODASAV44");
		expect(identify(stream)).toBe(Yoda);
	});

	it("identifies indys's save games correctly", () => {
		const stream = mockStream("INDYSAV44");
		expect(identify(stream)).toBe(Indy);
	});

	it("returns null if the save game can not be identified", () => {
		const stream = mockStream("UNKNOWN44");
		expect(identify(stream)).toBeNull();
	});

	function mockStream(characters: string): InputStream {
		return { getCharacters: () => characters } as any;
	}
});
