import ZoneLayer from "src/engine/objects/zone-layer";

describe("WebFun.Engine.Objects.ZoneLayer", () => {
	it("defines simple constants", () => {
		expect(ZoneLayer.Floor).toBe(0);
		expect(ZoneLayer.Object).toBe(1);
		expect(ZoneLayer.Roof).toBe(2);
	});

	it("defines names for each constant", () => {
		expect(ZoneLayer[ZoneLayer.Floor]).toBe("Floor");
		expect(ZoneLayer[ZoneLayer.Object]).toBe("Object");
		expect(ZoneLayer[ZoneLayer.Roof]).toBe("Roof");
	});
});
