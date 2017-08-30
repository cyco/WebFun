import Message, { Disable, Enable } from "/util/message";
import { console, global } from "/std";

xdescribe("Message", () => {
	let consoleWarnCalled;
	let originalConsole;
	let messages;

	beforeEach(() => {
		Disable();

		messages = [];
	});

	afterEach(() => {
		Disable();
		global.console = originalConsole;
	});

	it("is a wrapper for console.warn that only prints something if window.logging is true", () => {
		spyOn(console, "warn");
		Disable();

		Message("test");
		expect(console.warn).not.toHaveBeenCalled();

		Enable();
		Message("test");
		expect(console.warn).toHaveBeenCalledWith("test");
	});

	it("converts booleans to '1' and '0'", () => {
		spyOn(console, "warn");

		Message("%d", false);
		Message("%d", true);

		expect(console.warn).toHaveBeenCalledWith("%d", 0);
		expect(console.warn).toHaveBeenCalledWith("%d", 1);
	});

	it("prints -1 as 16-bit decimal", () => {
		spyOn(console, "warn");

		Message("%d", -1);
		expect(console.warn).toHaveBeenCalledWith("%d", "65535");

		Message("%d", "ffffffff");
		expect(console.warn).toHaveBeenCalledWith("%d", "65535");
	});

	it("knows how to print hexadecimals", () => {
		spyOn(console, "warn");

		Message("%x", 11);
		expect(console.warn).toHaveBeenCalledWith("%x", 11);
	});

	it("converts numbers to strings", () => {
		spyOn(console, "warn");

		Message("%d", 11);
		expect(console.warn).toHaveBeenCalledWith("%d", 11);
	});

	it("just prints objects", () => {
		spyOn(console, "warn");

		Message("%a", {
			toString: () => {
				return "5";
			}
		});
		expect(console.warn).toHaveBeenCalledWith("%a", "5");
	});

	it("does not fail if there aren't enough arguments", () => {
		spyOn(console, "warn");

		Message("%d", 1, 2, 3);
		expect(console.warn).toHaveBeenCalledWith("%d", 1, 2, 3);
	});
});
