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

		expect(object.a).toBe(5);
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
