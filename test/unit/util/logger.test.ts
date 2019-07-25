import Logger from "src/util/logger";
import LogLevel from "src/util/log-level";

describe("WebFun.Util.Logger", () => {
	let subject: Logger;

	beforeEach(() => {
		spyOn(console, "log");
		spyOn(console, "warn");
		spyOn(console, "error");

		subject = new Logger();
	});

	it("logs things to the console", () => {
		subject.warn("A message");
		expect(console.warn).toHaveBeenCalledWith("A message");
	});

	it("does not log if the level is below the currently set log level", () => {
		subject.debug("A message");
		expect(console.log).not.toHaveBeenCalled();
	});

	it("the level can be changed at any time", () => {
		subject.info("A message");
		expect(console.log).not.toHaveBeenCalled();

		subject.level = LogLevel.Debug;

		subject.info("A message");
		expect(console.log).toHaveBeenCalled();
	});

	it("the highest level is `Error`", () => {
		subject.error("A message");
		expect(console.error).toHaveBeenCalled();
	});

	it("Logging can be disabled entirely by setting the `LogLevel.Off` level", () => {
		subject.level = LogLevel.Off;
		subject.error("A message");
		expect(console.log).not.toHaveBeenCalled();
	});

	it("Can prepend a prefix to differentiate parts of the application", () => {
		subject.prefix = "ENGINE";
		subject.error("A message");
		expect(console.error).toHaveBeenCalledWith("ENGINE", "A message");
	});

	it("Passes the severity on to the conosle if appropriate", () => {
		subject.warn("A message");
		expect(console.warn).toHaveBeenCalledWith("A message");
	});

	it("For consistency there's a message to not log something", () => {
		subject.level = LogLevel.Off;
		subject.off("A message");
		expect(console.log).not.toHaveBeenCalled();
	});
});
