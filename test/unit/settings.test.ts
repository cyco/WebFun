import Settings from "src/settings";

describe("WebFun.Settings", () => {
	it("is a simple obejct", () => {
		expect(Settings.constructor).toBe(Object);
	});

	it("holds basic settings that are mostly used for debugging", () => {
		expect(Settings.autostartEngine).toBeBoolean();
	});

	it("also provides access to urls for yoda's game data", () => {
		expect(Settings.url.yoda.data).toContain("yoda.data");
		expect(Settings.url.yoda.palette).toContain("yoda.pal");

		expect(Settings.url.yoda.sfx).toContain("sfx-yoda");
	});

	it("also provides access to urls for indy's game data", () => {
		expect(Settings.url.indy.data).toContain("indy.data");
		expect(Settings.url.indy.palette).toContain("indy.pal");

		expect(Settings.url.indy.sfx).toContain("sfx-indy");
	});
});
