import iterate from "src/util/iterate";

describe("iterate", () => {
	it("is an iterator for standard objects", () => {
		const object = {
			a: 1,
			b: 2,
			d: 4
		};

		const keys = [];
		const values = [];
		for (const [key, value] of iterate(object)) {
			keys.push(key);
			values.push(value);
		}

		expect(keys).toEqual(["a", "b", "d"]);
		expect(values).toEqual([1, 2, 4]);
	});
});
