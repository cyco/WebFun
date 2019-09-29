import HotspotType from "src/engine/objects/hotspot-type";

describe("WebFun.Engine.Objects.HotspotType", () => {
	it("is an enum for hotspot types", () => {
		expect(HotspotType).toBeClass();
	});

	it("can be created from a number", () => {
		expect(HotspotType.fromNumber(0)).toBe(HotspotType.DropQuestItem);
		expect(() => HotspotType.fromNumber(-1)).toThrow();
	});

	it("can be represented as a string", () => {
		expect(HotspotType.DropQuestItem.name).toBe("DropQuestItem");
		expect(HotspotType.SpawnLocation.name).toBe("SpawnLocation");
		expect(HotspotType.DropUniqueWeapon.name).toBe("DropUniqueWeapon");
		expect(HotspotType.VehicleTo.name).toBe("VehicleTo");
		expect(HotspotType.VehicleBack.name).toBe("VehicleBack");
		expect(HotspotType.DropMap.name).toBe("DropMap");
		expect(HotspotType.DropItem.name).toBe("DropItem");
		expect(HotspotType.NPC.name).toBe("NPC");
		expect(HotspotType.DropWeapon.name).toBe("DropWeapon");
		expect(HotspotType.DoorIn.name).toBe("DoorIn");
		expect(HotspotType.DoorOut.name).toBe("DoorOut");
		expect(HotspotType.Unused.name).toBe("Unused");
		expect(HotspotType.Lock.name).toBe("Lock");
		expect(HotspotType.Teleporter.name).toBe("Teleporter");
		expect(HotspotType.ShipToPlanet.name).toBe("ShipToPlanet");
		expect(HotspotType.ShipFromPlanet.name).toBe("ShipFromPlanet");

		expect(new HotspotType().name).toBe("unknown");
	});

	it("can be represented as a number", () => {
		expect(HotspotType.DropQuestItem.rawValue).toBe(0);
		expect(HotspotType.SpawnLocation.rawValue).toBe(1);
		expect(HotspotType.DropUniqueWeapon.rawValue).toBe(2);
		expect(HotspotType.VehicleTo.rawValue).toBe(3);
		expect(HotspotType.VehicleBack.rawValue).toBe(4);
		expect(HotspotType.DropMap.rawValue).toBe(5);
		expect(HotspotType.DropItem.rawValue).toBe(6);
		expect(HotspotType.NPC.rawValue).toBe(7);
		expect(HotspotType.DropWeapon.rawValue).toBe(8);
		expect(HotspotType.DoorIn.rawValue).toBe(9);
		expect(HotspotType.DoorOut.rawValue).toBe(10);
		expect(HotspotType.Unused.rawValue).toBe(11);
		expect(HotspotType.Lock.rawValue).toBe(12);
		expect(HotspotType.Teleporter.rawValue).toBe(13);
		expect(HotspotType.ShipToPlanet.rawValue).toBe(14);
		expect(HotspotType.ShipFromPlanet.rawValue).toBe(15);
	});
});
