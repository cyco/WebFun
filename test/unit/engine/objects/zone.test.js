import Zone, { Type } from "src/engine/objects/zone";
import { Type as HotspotType } from "src/engine/objects/hotspot";

describe("Zone", () => {
	it("is a class representing an in-game map", () => {
		let zone = new Zone();
		expect(zone instanceof Zone).toBeTrue();
	});

	it("has a method identifying the loading zone", () => {
		let zone = new Zone();
		zone._type = Type.Load;

		expect(zone.isLoadingZone()).toBeTrue();
	});

	describe("hotspots", () => {
		let subject;
		beforeEach(() => {
			subject = new Zone();
			subject._type = Type.Empty;
			subject._hotspots = [
				{ type: HotspotType.DoorIn, arg: -1 },
				{ type: HotspotType.DoorIn, arg: 0x72 },
				{},
				{ type: HotspotType.Teleporter, arg: -1 }
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
			subject._hotspots = [];
			expect(subject.hasTeleporter).toBeFalse();
		});
	});
});
