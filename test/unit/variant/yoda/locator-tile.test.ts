import BaseLocatorTile from "src/engine/locator-tile";
import LocatorTile from "src/variant/yoda/locator-tile";
import { Hotspot, Zone } from "src/engine/objects";

describe("WebFun.Variant.Yoda.LocatorTile", () => {
	let subject: LocatorTile;
	beforeEach(() => (subject = new LocatorTile()));

	it("is a map configuration", () => {
		expect(subject).toBeInstanceOf(BaseLocatorTile);
	});

	it("uses a black background", () => {
		expect(subject.backgroundColor).toEqual("rgb(0,0,0)");
	});

	it("properly identifies the tile indicating where the hero is", () => {
		expect(subject.here).toEqual(837);
	});

	it("shows an empty map tile for missing zones", () => {
		expect(subject.forZone(null, false)).toEqual(836);
	});

	it("shows the correct map tile for zones that have not been visited", () => {
		expect(subject.forZone({} as any, false)).toEqual(835);
		expect(subject.forZone({ type: 0, visited: false } as any)).toEqual(835);
	});

	it("shows the correct map tile for town zones", () => {
		expect(subject.forZone({ type: Zone.Type.Town } as any, true)).toEqual([829]);
	});

	it("shows the correct map tile for goal zones", () => {
		expect(subject.forZone({ type: Zone.Type.Goal } as any, true)).toEqual([831, 830]);
	});

	it("shows the correct map tile for travel start zones", () => {
		expect(subject.forZone({ type: Zone.Type.TravelStart } as any, true)).toEqual([819, 820]);
	});

	it("shows the correct map tile for travel end zones", () => {
		expect(subject.forZone({ type: Zone.Type.TravelEnd } as any, true)).toEqual([819, 820]);
	});

	it("shows the correct map tile for blockade zones", () => {
		expect(subject.forZone({ type: Zone.Type.BlockadeEast } as any, true)).toEqual([823, 824]);
		expect(subject.forZone({ type: Zone.Type.BlockadeWest } as any, true)).toEqual([827, 828]);
		expect(subject.forZone({ type: Zone.Type.BlockadeNorth } as any, true)).toEqual([821, 822]);
		expect(subject.forZone({ type: Zone.Type.BlockadeSouth } as any, true)).toEqual([825, 826]);
	});

	it("shows the correct map tile for puzzle zones", () => {
		expect(subject.forZone({ type: Zone.Type.Use } as any, true)).toEqual([817, 818]);
		expect(subject.forZone({ type: Zone.Type.Trade } as any, true)).toEqual([817, 818]);
		expect(subject.forZone({ type: Zone.Type.FindUniqueWeapon } as any, true)).toEqual([817, 818]);
	});

	it("shows the correct map tile for other zones", () => {
		expect(subject.forZone({ type: 0 } as any, true)).toEqual(832);
		expect(subject.forZone({ type: 0, visited: true } as any)).toEqual(832);
		expect(subject.forZone({ type: Zone.Type.Empty, hotspots: [] } as any, true)).toEqual(832);
	});

	it("shows the correct map tile for teleporter zones", () => {
		expect(
			subject.forZone(
				{ type: Zone.Type.Empty, hotspots: [{ type: Hotspot.Type.Teleporter }] } as any,
				true
			)
		).toEqual([833, 834]);
	});
});
