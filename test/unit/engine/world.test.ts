import World from "src/engine/world";
import { Zone } from "src/engine/objects";
import { Point } from "src/util";
import { AssetManager } from "src/engine";

describe("WebFun.Engine.World", () => {
	let subject: World = null;
	let zone: Zone = null;
	let assets: AssetManager = null;

	beforeEach(() => {
		zone = new Zone(
			4,
			{
				planet: Zone.Planet.Hoth.rawValue,
				zoneType: Zone.Type.Trade.rawValue,
				width: 9,
				height: 9,
				unknown: -1,
				hotspots: [],
				monsters: [],
				actions: [],
				goalItemIDs: new Int16Array(),
				npcIDs: new Int16Array(),
				providedItemIDs: new Int16Array(),
				requiredItemIDs: new Int16Array(),
				tileIDs: new Int16Array()
			},
			{} as any
		);
		assets = { get: () => zone } as any;
		subject = new World(assets);
	});

	it("knows the standard size of a world", () => {
		expect(World.Size.height).toBe(10);
		expect(World.Size.width).toBe(10);
	});

	it("has methods to get and set zones at a specific placeZone", () => {
		expect(subject.at(0, 0).zone).toBe(null);
		expect(subject.at(5, 5).zone).toBe(null);
		expect(subject.at(9, 9).zone).toBe(null);
		expect(subject.at(new Point(0, 0)).zone).toBe(null);

		subject.at(5, 5).zone = zone;
		expect(subject.at(5, 5).zone).toBe(zone);
	});

	it("returns null if asked for a zone outside the world's bounds", () => {
		expect(subject.at(-1, -1)).toBe(null);
		expect(subject.at(10, 10)).toBe(null);
	});

	describe("findLocationOfZone", () => {
		it("it returns a point specify where the zone is", () => {
			const mockZone: Zone = {} as any;
			subject.at(5, 2).zone = mockZone;

			const point = subject.findLocationOfZone(mockZone);
			expect(point.x).toBe(5);
			expect(point.y).toBe(2);
		});

		it("returns null if the world does not contain the zone", () => {
			const point = subject.findLocationOfZone(zone);
			expect(point).toBe(null);
		});
	});

	describe("locationOfSector", () => {
		it("returns the location of the given sector", () => {
			expect(subject.locationOfSector(subject.sectors[12])).toEqual(new Point(2, 1));
		});
	});

	it("has a bounds property to describe its extend", () => {
		expect(subject.bounds.origin.x).toBe(0);
		expect(subject.bounds.origin.y).toBe(0);
		expect(subject.bounds.size.width).toBe(10);
		expect(subject.bounds.size.height).toBe(10);
	});
});
