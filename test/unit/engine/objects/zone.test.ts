import Zone from "src/engine/objects/zone";
import Hotspot from "src/engine/objects/hotspot";
import AssetManager from "src/engine/asset-manager";

describe("Zone", () => {
	let assets: AssetManager;
	let subject: Zone;

	beforeEach(() => {
		assets = new AssetManager();
		subject = new Zone(
			0,
			{
				planet: Zone.Planet.Endor.rawValue,
				zoneType: Zone.Type.Empty.rawValue,
				width: 9,
				height: 9,
				requiredItemIDs: new Int16Array(),
				npcIDs: new Int16Array(),
				goalItemIDs: new Int16Array(),
				providedItemIDs: new Int16Array(),
				tileIDs: new Int16Array(),
				actions: [],
				monsters: [],
				hotspots: [
					{ enabled: true, type: Hotspot.Type.DoorIn.rawValue, argument: -1, x: 0, y: 0 },
					{ enabled: true, type: Hotspot.Type.DoorIn.rawValue, argument: 0x72, x: 0, y: 0 },
					{ enabled: true, type: Hotspot.Type.Teleporter.rawValue, argument: -1, x: 0, y: 0 }
				],
				unknown: 0
			},
			assets
		);
	});

	it("is a class representing an in-game map", () => {
		expect(subject instanceof Zone).toBeTrue();
	});

	it("has a method identifying the loading zone", () => {
		subject.type = Zone.Type.Load;

		expect(subject.isLoadingZone()).toBeTrue();
	});

	describe("hotspots", () => {
		it("mark special places on the map", () => {
			expect(subject.hotspots).toBeArray();
		});

		it("mark doorways to other zones", () => {
			const doors = subject.doors;
			expect(doors.length).toBe(1);
		});

		it("mark teleporters", () => {
			expect(subject.hasTeleporter).toBeTrue();
			subject.hotspots = [];
			expect(subject.hasTeleporter).toBeFalse();
		});
	});
});
