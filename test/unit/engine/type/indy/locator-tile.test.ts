import BaseLocatorTile from "src/engine/type/locator-tile";
import LocatorTile from "src/engine/type/indy/locator-tile";
import { Hotspot, Zone } from "src/engine/objects";

describe("WebFun.Engine.Type.Indy.LocatorTile", () => {
	let subject: LocatorTile;
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

	it("shows the correct map tile for zones that have not been visited", () => {
		expect(subject.forZone({} as any, false)).toEqual(1138);
		expect(subject.forZone({ type: 0, visited: false } as any)).toEqual(1138);
	});

	it("shows the correct map tile for town zones", () => {
		expect(subject.forZone({ type: Zone.Type.Town } as any, true)).toEqual([375]);
	});

	it("shows the correct map tile for goal zones", () => {
		expect(subject.forZone({ type: Zone.Type.Goal } as any, true)).toEqual([408, 376]);
	});

	it("shows the correct map tile for travel start zones", () => {
		expect(subject.forZone({ type: Zone.Type.TravelStart } as any, true)).toEqual([365, 366]);
	});

	it("shows the correct map tile for travel end zones", () => {
		expect(subject.forZone({ type: Zone.Type.TravelEnd } as any, true)).toEqual([365, 366]);
	});

	it("shows the correct map tile for blockade zones", () => {
		expect(subject.forZone({ type: Zone.Type.BlockadeEast } as any, true)).toEqual([369, 370]);
		expect(subject.forZone({ type: Zone.Type.BlockadeWest } as any, true)).toEqual([373, 374]);
		expect(subject.forZone({ type: Zone.Type.BlockadeNorth } as any, true)).toEqual([367, 368]);
		expect(subject.forZone({ type: Zone.Type.BlockadeSouth } as any, true)).toEqual([371, 372]);
	});

	it("shows the correct map tile for puzzle zones", () => {
		expect(subject.forZone({ type: Zone.Type.Trade } as any, true)).toEqual([363, 364]);
		expect(subject.forZone({ type: Zone.Type.Use } as any, true)).toEqual([363, 364]);
		expect(subject.forZone({ type: Zone.Type.FindUniqueWeapon } as any, true)).toEqual([363, 364]);
	});

	it("shows the correct map tile for other zones", () => {
		expect(subject.forZone({ type: 0 } as any, true)).toEqual(377);
		expect(subject.forZone({ type: 0, visited: true } as any)).toEqual(377);
		expect(subject.forZone({ type: Zone.Type.Empty, hotspots: [] } as any, true)).toEqual(377);
	});

	it("shows the correct map tile for teleporter zones", () => {
		expect(
			subject.forZone(
				{ type: Zone.Type.Empty, hotspots: [{ type: Hotspot.Type.Teleporter }] } as any,
				true
			)
		).toEqual([1139, 1131]);
	});
});
