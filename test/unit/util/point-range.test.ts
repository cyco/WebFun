import Point from "src/util/point";
import PointRange from "src/util/point-range";

describe("WebFun.Util.PointRange", () => {
	it("describes a of points", () => {
		const range = new PointRange(new Point(3, 6), new Point(4, 7));
		expect(range.from.x).toBe(3);
		expect(range.from.y).toBe(6);
		expect(range.to.x).toBe(4);
		expect(range.to.y).toBe(7);
	});

	it("can be initiated with a bunch of coordinates", () => {
		const range = new PointRange(3, 6, 4, 7);
		expect(range.from.x).toBe(3);
		expect(range.from.y).toBe(6);
		expect(range.to.x).toBe(4);
		expect(range.to.y).toBe(7);
	});

	it("has a function to iterate through all points in the range", () => {
		let visited: { [_: string]: boolean } = {};
		const range = new PointRange(new Point(3, 6), new Point(4, 7));

		range.iterate(point => (visited[point.x + "x" + point.y] = true), new Point(0, 1));

		expect(visited).toEqual({
			"3x6": true,
			"3x7": true
		});

		visited = {};

		range.iterate(point => (visited[point.x + "x" + point.y] = true), new Point(1, 0));

		expect(visited).toEqual({
			"3x6": true,
			"4x6": true
		});
	});

	it("iterations can be stopped by setting a paramter in the second arguments", () => {
		const visited: { [_: string]: boolean } = {};
		const range = new PointRange(new Point(3, 6), new Point(4, 7));

		range.iterate((point, control) => {
			visited[point.x + "x" + point.y] = true;
			control.stop = true;
		}, new Point(0, 1));

		expect(Object.keys(visited).length).toBe(1);
	});

	it("by default it iterates diagonally", () => {
		const visited: { [_: string]: boolean } = {};
		const range = new PointRange(new Point(3, 6), new Point(5, 7));

		range.iterate(point => (visited[point.x + "x" + point.y] = true));
		expect(Object.keys(visited).length).toBe(2);
	});

	it("can start iterating at the end", () => {
		const visited: { [_: string]: boolean } = {};
		const range = new PointRange(new Point(5, 7), new Point(3, 6));

		range.iterate(
			(point, ctrl) => ((visited[point.x + "x" + point.y] = true), (ctrl.stop = true)),
			new Point(-1, -1)
		);
		expect(visited["5x7"]).toBe(true);
	});

	it("searches diagonally by default", () => {
		const range = new PointRange(new Point(3, 5), new Point(10, 10));
		const result = range.find(point => point.x % 2 === 0 && point.y % 2 === 0);
		expect(result.x).toBe(4);
		expect(result.y).toBe(6);
	});

	it("can search backwards", () => {
		const range = new PointRange(new Point(9, 9), new Point(3, 5));
		const result = range.find(point => point.x % 2 === 0 && point.y % 2 === 0, new Point(-1, -1));
		expect(result.x).toBe(8);
		expect(result.y).toBe(8);
	});
});
