import LogLevel from "src/util/log-level";

describe("WebFun.Util.LogLevel", () => {
	it("defines the basic log levels used across the app", () => {
		expect(LogLevel.Off).toBeDefined();
		expect(LogLevel.Debug).toBeDefined();
		expect(LogLevel.Info).toBeDefined();
		expect(LogLevel.Warning).toBeDefined();
		expect(LogLevel.Error).toBeDefined();
	});
});
