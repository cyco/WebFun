import VerticalPointRange from "src/util/vertical-point-range";

describe("WebFun.Util.VerticalPointRange", () => {
	it("is a range of points that only extends in y-dimension", () => {
		const range = new VerticalPointRange(3, 8, 4);
		expect(range.from.y).toBe(3);
		expect(range.from.x).toBe(4);
		expect(range.to.y).toBe(8);
		expect(range.to.x).toBe(4);
	});

	it("has a method to iterate through all points", () => {
		const visited: { [_: string]: boolean } = {};
		const range = new VerticalPointRange(3, 8, 4);

		range.iterate(function(point) {
			visited[point.x + "x" + point.y] = true;
		});

		expect(visited).toEqual({
			"4x3": true,
			"4x4": true,
			"4x5": true,
			"4x6": true,
			"4x7": true,
			"4x8": true
		});
	});

	it("has a method to find a specific point in the range", () => {
		let result;
		const range = new VerticalPointRange(3, 8, 4);

		result = range.find(point => point.x === point.y);
		expect(result.x).toBe(result.y);

		result = range.find(() => false);
		expect(result).toBe(null);
	});
});
