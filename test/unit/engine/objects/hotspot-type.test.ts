import HotspotType from "src/engine/objects/hotspot-type";

describe("WebFun.Engine.Objects.HotspotType", () => {
	it("is an enum for hotspot types", () => {
		expect(HotspotType).toBeClass();
	});

	it("can be created from a number", () => {
		expect(HotspotType.fromNumber(0)).toBe(HotspotType.TriggerLocation);
		expect(() => HotspotType.fromNumber(-1)).toThrow();
	});

	it("can be represented as a string", () => {
		expect(HotspotType.TriggerLocation.name).toBe("TriggerLocation");
		expect(HotspotType.SpawnLocation.name).toBe("SpawnLocation");
		expect(HotspotType.WeaponLocation.name).toBe("WeaponLocation");
		expect(HotspotType.VehicleTo.name).toBe("VehicleTo");
		expect(HotspotType.VehicleBack.name).toBe("VehicleBack");
		expect(HotspotType.LocatorLocation.name).toBe("LocatorLocation");
		expect(HotspotType.CrateItem.name).toBe("CrateItem");
		expect(HotspotType.PuzzleNPC.name).toBe("PuzzleNPC");
		expect(HotspotType.CrateWeapon.name).toBe("CrateWeapon");
		expect(HotspotType.DoorIn.name).toBe("DoorIn");
		expect(HotspotType.DoorOut.name).toBe("DoorOut");
		expect(HotspotType.Unused.name).toBe("Unused");
		expect(HotspotType.Lock.name).toBe("Lock");
		expect(HotspotType.Teleporter.name).toBe("Teleporter");
		expect(HotspotType.xWingFromDagobah.name).toBe("xWingFromDagobah");
		expect(HotspotType.xWingToDagobah.name).toBe("xWingToDagobah");

		expect(new HotspotType().name).toBe("unknown");
	});

	it("can be represented as a number", () => {
		expect(HotspotType.TriggerLocation.rawValue).toBe(0);
		expect(HotspotType.SpawnLocation.rawValue).toBe(1);
		expect(HotspotType.WeaponLocation.rawValue).toBe(2);
		expect(HotspotType.VehicleTo.rawValue).toBe(3);
		expect(HotspotType.VehicleBack.rawValue).toBe(4);
		expect(HotspotType.LocatorLocation.rawValue).toBe(5);
		expect(HotspotType.CrateItem.rawValue).toBe(6);
		expect(HotspotType.PuzzleNPC.rawValue).toBe(7);
		expect(HotspotType.CrateWeapon.rawValue).toBe(8);
		expect(HotspotType.DoorIn.rawValue).toBe(9);
		expect(HotspotType.DoorOut.rawValue).toBe(10);
		expect(HotspotType.Unused.rawValue).toBe(11);
		expect(HotspotType.Lock.rawValue).toBe(12);
		expect(HotspotType.Teleporter.rawValue).toBe(13);
		expect(HotspotType.xWingFromDagobah.rawValue).toBe(14);
		expect(HotspotType.xWingToDagobah.rawValue).toBe(15);
	});
});
