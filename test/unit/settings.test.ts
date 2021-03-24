import Settings from "src/settings";

describe("WebFun.Settings", () => {
	it("is a simple object", () => {
		expect(Settings.constructor).toBe(Object);
	});

	it("holds basic settings that are mostly used for debugging", () => {
		expect(Settings.autostartEngine).toBeBoolean();
	});
});
