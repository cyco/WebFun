import BaseLocatorTile from "src/engine/types/locator-tile";
import LocatorTile from "src/engine/type/indy/locator-tile";
import { HotspotType, ZoneType } from "src/engine/objects";

describe("WebFun.Engine.Type.Indy.LocatorTile", () => {
	let subject;
	beforeEach(() => (subject = new LocatorTile()));

	it("is a map configuration", () => {
		expect(subject).toBeInstanceOf(BaseLocatorTile);
	});

	it("uses a custom background color", () => {
		expect(subject.backgroundColor).toEqual("rgb(79,79,15)");
	});

	it("properly identifies the tile indicating where the hero is", () => {
		expect(subject.here).toEqual(639);
	});

	it("shows an empty map tile for missing zones", () => {
		expect(subject.forZone(null, false)).toEqual(-1);
	});

	it("shows the correct map tile for zones thats have not been visited", () => {
		expect(subject.forZone({}, false)).toEqual(1138);
		expect(subject.forZone({ type: 0, visited: false })).toEqual(1138);
	});

	it("shows the correct map tile for town zones", () => {
		expect(subject.forZone({ type: ZoneType.Town }, true)).toEqual([375]);
	});

	it("shows the correct map tile for goal zones", () => {
		expect(subject.forZone({ type: ZoneType.Goal }, true)).toEqual([408, 376]);
	});

	it("shows the correct map tile for travel start zones", () => {
		expect(subject.forZone({ type: ZoneType.TravelStart }, true)).toEqual([365, 366]);
	});

	it("shows the correct map tile for travel end zones", () => {
		expect(subject.forZone({ type: ZoneType.TravelEnd }, true)).toEqual([365, 366]);
	});

	it("shows the correct map tile for blockade zones", () => {
		expect(subject.forZone({ type: ZoneType.BlockadeEast }, true)).toEqual([369, 370]);
		expect(subject.forZone({ type: ZoneType.BlockadeWest }, true)).toEqual([373, 374]);
		expect(subject.forZone({ type: ZoneType.BlockadeNorth }, true)).toEqual([367, 368]);
		expect(subject.forZone({ type: ZoneType.BlockadeSouth }, true)).toEqual([371, 372]);
	});

	it("shows the correct map tile for puzzle zones", () => {
		expect(subject.forZone({ type: ZoneType.Trade }, true)).toEqual([363, 364]);
		expect(subject.forZone({ type: ZoneType.Use }, true)).toEqual([363, 364]);
		expect(subject.forZone({ type: ZoneType.FindTheForce }, true)).toEqual([363, 364]);
	});

	it("shows the correct map tile for other zones", () => {
		expect(subject.forZone({ type: 0 }, true)).toEqual(377);
		expect(subject.forZone({ type: 0, visited: true })).toEqual(377);
		expect(subject.forZone({ type: ZoneType.Empty, hotspots: [] }, true)).toEqual(377);
	});

	it("shows the correct map tile for teleporter zones", () => {
		expect(
			subject.forZone({ type: ZoneType.Empty, hotspots: [{ type: HotspotType.Teleporter }] }, true)
		).toEqual([1139, 1131]);
	});
});
