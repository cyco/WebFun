import uuid from "src/extension/string/uuid";

describe("WebFun.Extension.String.UUID", () => {
	it("defines a static function on String that generates new UUIDs", () => {
		expect(typeof uuid).toBe("function");
		expect(typeof String.UUID).toBe("function");
	});

	it("returns a uuid with components separated by strings", () => {
		const uuid = String.UUID();
		expect(uuid.split("-").length).toBe(5);
	});

	it("generates a new UUID every time", () => {
		const uuid1 = String.UUID();
		const uuid2 = String.UUID();

		expect(uuid1).not.toBe(uuid2);
	});
});
