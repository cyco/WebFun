import BaseLocatorTile from "src/engine/types/locator-tile";
import LocatorTile from "src/engine/type/yoda/locator-tile";
import { HotspotType, ZoneType } from "src/engine/objects";

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

	it("shows the correct map tile for zones thats have not been visited", () => {
		expect(subject.forZone({}, false)).toEqual(0x343);
		expect(subject.forZone({ type: 0, visited: false })).toEqual(0x343);
	});

	it("shows the correct map tile for town zones", () => {
		expect(subject.forZone({ type: ZoneType.Town }, true)).toEqual([0x33d]);
	});

	it("shows the correct map tile for goal zones", () => {
		expect(subject.forZone({ type: ZoneType.Goal }, true)).toEqual([0x33f, 0x33e]);
	});

	it("shows the correct map tile for travel start zones", () => {
		expect(subject.forZone({ type: ZoneType.TravelStart }, true)).toEqual([0x333, 0x334]);
	});

	it("shows the correct map tile for travel end zones", () => {
		expect(subject.forZone({ type: ZoneType.TravelEnd }, true)).toEqual([0x333, 0x334]);
	});

	it("shows the correct map tile for blockade zones", () => {
		expect(subject.forZone({ type: ZoneType.BlockadeEast }, true)).toEqual([0x337, 0x338]);
		expect(subject.forZone({ type: ZoneType.BlockadeWest }, true)).toEqual([0x33b, 0x33c]);
		expect(subject.forZone({ type: ZoneType.BlockadeNorth }, true)).toEqual([0x335, 0x336]);
		expect(subject.forZone({ type: ZoneType.BlockadeSouth }, true)).toEqual([0x339, 0x33a]);
	});

	it("shows the correct map tile for puzzle zones", () => {
		expect(subject.forZone({ type: ZoneType.Trade }, true)).toEqual([0x331, 0x332]);
		expect(subject.forZone({ type: ZoneType.Use }, true)).toEqual([0x331, 0x332]);
		expect(subject.forZone({ type: ZoneType.FindTheForce }, true)).toEqual([0x331, 0x332]);
	});

	it("shows the correct map tile for other zones", () => {
		expect(subject.forZone({ type: 0 }, true)).toEqual(0x340);
		expect(subject.forZone({ type: 0, visited: true })).toEqual(0x340);
		expect(subject.forZone({ type: ZoneType.Empty, hotspots: [] }, true)).toEqual(0x340);
	});

	it("shows the correct map tile for teleporter zones", () => {
		expect(
			subject.forZone({ type: ZoneType.Empty, hotspots: [{ type: HotspotType.Teleporter }] }, true)
		).toEqual([0x341, 0x342]);
	});
});
