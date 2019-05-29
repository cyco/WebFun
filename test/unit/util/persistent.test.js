import persistent from "src/util/persistent";

describe("WebFun.Util.persistent", () => {
	let store;
	beforeEach(() => (store = mockStorage()));

	it("wraps an object and passes value changes to a store ", () => {
		const object = { a: 5 };
		const wrappedObject = persistent(object, null, store);
		expect(wrappedObject.a).toBe(5);
		wrappedObject.a = 10;
		expect(store.load("a")).toBe(10);
		expect(wrappedObject.a).toBe(10);
	});

	it("can add a prefix to all keys before hitting storage", () => {
		const object = { a: 5 };
		const wrappedObject = persistent(object, "my-prefix", store);
		wrappedObject.a = 7;
		expect(store.load("my-prefix.a")).toBe(7);
	});

	it("prefers values from the store", () => {
		const object = { a: 5 };
		store.store("a", 7);
		const wrappedObject = persistent(object, null, store);
		expect(wrappedObject.a).toBe(7);
	});

	it("defaults to using local storage", () => {
		const object = { unitTest: 5 };
		const wrappedObject = persistent(object);
		expect(wrappedObject.unitTest).toBe(5);
		wrappedObject.unitTest = 7;
		expect(object.unitTest).toBe(7);
		expect(localStorage.getItem("unitTest")).toBe("7");
		localStorage.removeItem("unitTest");
	});

	function mockStorage() {
		return {
			store(key, value) {
				this[key] = value;
			},
			load(key) {
				return this[key];
			},
			has(key) {
				return this[key] !== undefined;
			}
		};
	}
});
