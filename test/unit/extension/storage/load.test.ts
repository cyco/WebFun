import loadFn from "src/extension/storage/load";
import storeFn from "src/extension/storage/store";

describe("WebFun.Extension.Storage.load", () => {
	let originalGetItem: any, originalConsoleWarn: any;
	let store: Storage, warnings;

	beforeEach(() => {
		originalGetItem = localStorage.getItem;
		originalConsoleWarn = console.warn;

		store = {} as any;
		warnings = [];

		localStorage.getItem = function (key) {
			return store[key];
		};
		console.warn = (...args: any[]) => {
			warnings.push(args);
		};
	});

	afterEach(() => {
		localStorage.getItem = originalGetItem;
		console.warn = originalConsoleWarn;
	});

	it("extends the Storage prototype", () => {
		expect(typeof loadFn).toBe("function");

		if (typeof Storage !== "undefined") {
			expect(typeof localStorage.load).toBe("function");
		}
	});

	it("retrieves objects from the storage", () => {
		store["sample"] = '{ "a": 2 }';

		const result = localStorage.load("sample");
		expect(typeof result).toBe("object");
		expect(result.a).toBe(2);
	});

	it("logs a warning if the object can't be transformed from json", () => {
		store["sample"] = '{ "a": 2 ';
		localStorage.load("sample");
		expect(warnings.length).toBe(1);
	});

	it("returns null if the object does not exist", () => {
		const result = localStorage.load("does not exists");
		expect(result).toBe(null);
	});
});
