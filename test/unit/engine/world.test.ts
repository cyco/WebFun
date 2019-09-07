import World from "src/engine/world";
import { Zone } from "src/engine/objects";
import { Point } from "src/util";

describe("WebFun.Engine.Generation.World", () => {
	let subject: World = null;
	let zone: Zone = null;
	beforeEach(() => {
		subject = new World();
		zone = new Zone();
		subject.zones = [zone];
	});

	it("knows the standard size of a world", () => {
		expect(World.HEIGHT).toBe(10);
		expect(World.WIDTH).toBe(10);
	});

	it("has methods to get and set zones at a specific placeZone", () => {
		expect(subject.getZone(0, 0)).toBe(null);
		expect(subject.getZone(5, 5)).toBe(null);
		expect(subject.getZone(9, 9)).toBe(null);
		expect(subject.getZone(new Point(0, 0))).toBe(null);

		subject.setZone(5, 5, zone);
		expect(subject.getZone(5, 5)).toBe(zone);
	});

	it("returns null if asked for a zone outside the world's bounds", () => {
		expect(subject.getZone(-1, -1)).toBe(null);
		expect(subject.getZone(10, 10)).toBe(null);
	});

	describe("locationOfZone", () => {
		it("it returns a point specify where the zone is", () => {
			const mockZone: Zone = {} as any;
			subject.setZone(5, 2, mockZone);

			const point = subject.locationOfZone(mockZone);
			expect(point.x).toBe(5);
			expect(point.y).toBe(2);
		});

		it("returns null if the world does not contain the zone", () => {
			const point = subject.locationOfZone(zone);
			expect(point).toBe(null);
		});
	});
});
