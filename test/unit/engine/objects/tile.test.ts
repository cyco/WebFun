import Tile from "src/engine/objects/tile";

describe("Tile", () => {
	it("is a class representing a game tile", () => {
		const tile = new Tile(0, { attributes: 0, pixels: new Uint8Array() });
		expect(tile instanceof Tile).toBeTrue();
	});
});
