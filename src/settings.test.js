import Settings from "/settings";

describe("Settings", () => {
	it("is a simple obejct", () => {
		expect(Settings.constructor).toBe(Object);
	});

	it("holds basic settings that are mostly used for debugging", () => {
		expect(Settings.autostartEngine).toBeBoolean();
	});

	it("also provides access to urls for game data", () => {
		expect(Settings.url.data).toContain("yoda.data");
		expect(Settings.url.palette).toContain("yoda.pal");

		expect(Settings.url.sfx("youwin.wav")).toContain("youwin");
		expect(Settings.url.sfx("youwin.wav")).toContain("game-data");
	});
});
