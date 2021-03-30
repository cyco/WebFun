import { defaultSettings } from "src/settings";

describe("WebFun.Settings", () => {
	it("holds basic settings that are mostly used for debugging", () => {
		expect(defaultSettings.autostartEngine).toBeBoolean();
	});
});
