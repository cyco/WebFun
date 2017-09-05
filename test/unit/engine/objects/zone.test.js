import Zone, { Type } from "src/engine/objects/zone";

describe("Zone", () => {
	it("is a class representing an in-game map", () => {
		let zone = new Zone();
		expect(zone instanceof Zone).toBeTrue();
	});

	it("has a method identifying the loading zone", () => {
		let zone = new Zone();
		zone._type = Type.Load;

		expect(zone.isLoadingZone()).toBeTrue();
	});
});
