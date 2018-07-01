import BaseLocatorTile from "src/engine/types/locator-tile";
import LocatorTile from "src/engine/type/yoda/locator-tile";

describe("WebFun.Engine.Type.Yoda.LocatorTile", () => {
	let subject;
	beforeEach(() => (subject = new LocatorTile()));

	it("is a map configuration", () => {
		expect(subject).toBeInstanceOf(BaseLocatorTile);
	});

	it("uses a black background", () => {
		expect(subject.backgroundColor).toEqual("rgb(0,0,0)");
	});

	it("properly identifies the tile indicating where the hero is", () => {
		expect(subject.here).toEqual(0x345);
	});

	it("shows an empty map tile for missing zones", () => {
		expect(subject.forZone(null, false)).toEqual(0x344);
	});

	it("shows the correct map tile for zones thats have not been visited", () => {
		expect(subject.forZone({}, false)).toEqual(0x343);
	});
});
