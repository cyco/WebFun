import Zone from "src/engine/objects/zone";
import Hotspot from "src/engine/objects/hotspot";

describe("Zone", () => {
	it("is a class representing an in-game map", () => {
		const zone = new Zone();
		expect(zone instanceof Zone).toBeTrue();
	});

	it("has a method identifying the loading zone", () => {
		const zone = new Zone();
		(zone as any)._type = Zone.Type.Load;

		expect(zone.isLoadingZone()).toBeTrue();
	});

	describe("hotspots", () => {
		let subject: Zone;
		beforeEach(() => {
			subject = new Zone();
			(subject as any)._type = Zone.Type.Empty;
			(subject as any)._hotspots = [
				{ type: Hotspot.Type.DoorIn, arg: -1 },
				{ type: Hotspot.Type.DoorIn, arg: 0x72 },
				{},
				{ type: Hotspot.Type.Teleporter, arg: -1 }
			];
		});

		it("mark special places on the map", () => {
			expect(subject.hotspots).toBeArray();
		});

		it("mark doorways to other zones", () => {
			const doors = subject.doors;
			expect(doors.length).toBe(1);
		});

		it("mark teleporters", () => {
			expect(subject.hasTeleporter).toBeTrue();
			(subject as any)._hotspots = [];
			expect(subject.hasTeleporter).toBeFalse();
		});
	});
});
