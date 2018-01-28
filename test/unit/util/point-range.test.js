import Point from "src/util/point";
import PointRange from "src/util/point-range";

describe("PointRange", () => {
	it("describes a of points", () => {
		let range = new PointRange(new Point(3, 6), new Point(4, 7));
		expect(range.from.x).toBe(3);
		expect(range.from.y).toBe(6);
		expect(range.to.x).toBe(4);
		expect(range.to.y).toBe(7);
	});

	it("can be initiated with a bunch of coordinates", () => {
		let range = new PointRange(3, 6, 4, 7);
		expect(range.from.x).toBe(3);
		expect(range.from.y).toBe(6);
		expect(range.to.x).toBe(4);
		expect(range.to.y).toBe(7);
	});

	it("has a function to iterate through all points in the range", () => {
		let visited = {};
		let range = new PointRange(new Point(3, 6), new Point(4, 7));

		range.iterate(function(point) {
			visited[point.x + "x" + point.y] = true;
		}, new Point(0, 1));

		expect(visited).toEqual({
			"3x6": true,
			"3x7": true
		});

		visited = {};

		range.iterate(function(point) {
			visited[point.x + "x" + point.y] = true;
		}, new Point(1, 0));

		expect(visited).toEqual({
			"3x6": true,
			"4x6": true
		});
	});

	it("iterations can be stopped by setting a paramter in the second arguments", () => {
		let visited = {};
		let range = new PointRange(new Point(3, 6), new Point(4, 7));

		range.iterate(function(point, control) {
			visited[point.x + "x" + point.y] = true;
			control.stop = true;
		}, new Point(0, 1));

		expect(Object.keys(visited).length).toBe(1);
	});
});
