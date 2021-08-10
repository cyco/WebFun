import Hotspot from "src/engine/objects/hotspot";
import HotspotType from "src/engine/objects/hotspot-type";
import { Point } from "src/util";

describe("WebFun.Engine.Objects.Hotspot", () => {
	let subject: Hotspot;
	beforeEach(() => {
		subject = new Hotspot(3, {
			enabled: false,
			type: Hotspot.Type.DropMap.rawValue,
			x: 2,
			y: 3,
			argument: -1
		});
	});

	it("marks a point of interest on a zone", () => {
		expect(subject.location).toBeInstanceOf(Point);
	});

	it("defines all possible types", () => {
		expect(Hotspot.Type).toBe(HotspotType);
	});

	it("can be disabled (and is by default)", () => {
		expect(subject.enabled).toBeFalse();
	});

	it("holds one argument (16-bit signed, not enforced)", () => {
		expect(subject.arg).toBe(-1);
		expect(() => (subject.arg = 0x10000)).not.toThrow();
	});
});
