import Tile from "src/engine/objects/tile";

describe("Tile", () => {
	it("is a class representing a game tile", () => {
		const tile = new Tile();
		expect(tile instanceof Tile).toBeTrue();
	});
});
