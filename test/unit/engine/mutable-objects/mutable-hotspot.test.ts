import Hotspot from "src/engine/mutable-objects/mutable-hotspot";
import { Point } from "src/util";

describe("WebFun.Engine.MutableObjecs.MutableHotspot", () => {
	it("has a setter for the hotpots's location", () => {
		const htsp = new Hotspot();
		htsp.location = new Point(4, 3);
		expect(htsp.x).toBe(4);
		expect(htsp.y).toBe(3);

		expect(htsp.location.x).toBe(4);
		expect(htsp.location.y).toBe(3);
	});
});
