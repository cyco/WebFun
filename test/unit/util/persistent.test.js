import persistent from "src/util/persistent";

describe("WebFun.Util.persistent", () => {
	let storage;
	beforeEach(() => (storage = mockStorage));

	it("wraps an object and passes value changes to a store ", () => {
		const object = { a: 5 };
		const wrappedObject = persistent(object, null, storage);
		expect(wrappedObject.a).toBe(5);
		wrappedObject.a = 10;
		expect(storage.load("a")).toBe(10);
		expect(wrappedObject.a).toBe(10);

		expect(object.a).toBe(5);
	});

	it("can add a prefix to all keys before accessing storage", () => {
		const object = { a: 5 };
		const wrappedObject = persistent(object, "my-prefix", storage);
		object.a = 7;
		expect(storage.load("my-prefix.a")).toBe(5);
	});

	it("can add a prefix to all keys before accessing storage", () => {
		const object = { a: 5 };
		storage.store("a", 7);
		const wrappedObject = persistent(object, "my-prefix", storage);
		expect(wrappedObject.a).toBe(7);
	});

	function mockStorage() {
		return {
			store(key, value) {
				this[key] = value;
			},
			load(key) {
				return this[key];
			}
		};
	}
});
