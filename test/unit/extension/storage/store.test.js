import loadFn from "src/extension/storage/load";
import storeFn from "src/extension/storage/store";

describe("WebFun.Extension.Storage.store", () => {
	let originalSetItem, originalConsoleWarn;
	let store, warnings;

	beforeEach(() => {
		originalSetItem = localStorage.setItem;
		originalConsoleWarn = console.warn;

		store = {};
		warnings = [];

		localStorage.setItem = function(key, data) {
			store[key] = data;
		};

		console.warn = (...args) => {
			warnings.push(args);
		};
	});

	afterEach(() => {
		localStorage.setItem = originalSetItem;
		console.warn = originalConsoleWarn;
	});

	it("extends the Storage prototype", () => {
		expect(typeof storeFn).toBe("function");

		if (typeof Storage !== "undefined") {
			expect(typeof localStorage.store).toBe("function");
		}
	});

	it("stores objects in stores", () => {
		let object = {
			a: 5
		};

		localStorage.store("sample", object);
		expect(store["sample"]).toBe('{"a":5}');
	});

	it("will log a warning if the object can' be stringified", () => {
		let circularObject = {};
		circularObject.root = circularObject;

		localStorage.store("sample", circularObject);
		expect(warnings.length).toBe(1);
	});

	it("uses toString for unknown obejcts if defined", () => {
		let object = { toString: () => 5 };
		localStorage.store("sample", object);
		expect(store["sample"]).toBe("5");
	});
});
