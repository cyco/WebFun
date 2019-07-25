import HorizontalPointRange from "src/util/horizontal-point-range";

describe("WebFun.Util.HorizontalPointRange", () => {
	it("is a range of points that only extends in y-dimension", () => {
		const range = new HorizontalPointRange(3, 8, 4);
		expect(range.from.x).toBe(3);
		expect(range.from.y).toBe(4);
		expect(range.to.x).toBe(8);
		expect(range.to.y).toBe(4);
	});

	it("has a method to iterate through all points", () => {
		const visited: { [_: string]: boolean } = {};
		const range = new HorizontalPointRange(3, 8, 4);

		range.iterate(function(point) {
			visited[point.x + "x" + point.y] = true;
		});

		expect(visited).toEqual({
			"3x4": true,
			"4x4": true,
			"5x4": true,
			"6x4": true,
			"7x4": true,
			"8x4": true
		});
	});

	it("can iterate backwards", () => {
		const visited: { [_: string]: boolean } = {};
		const range = new HorizontalPointRange(2, 0, 4);

		range.iterate(function(point) {
			visited[point.x + "x" + point.y] = true;
		}, -1);

		expect(visited).toEqual({
			"2x4": true,
			"1x4": true,
			"0x4": true
		});
	});

	it("has a method to find a specific point in the range", () => {
		let result;
		const range = new HorizontalPointRange(0, 6, 4);

		result = range.find(point => point.x < point.y);
		expect(result.x).toBeLessThan(result.y);

		result = range.find(() => false);
		expect(result).toBe(null);
	});
});
