import Direction from "src/util/direction";

describe("Direction", () => {
	it("is a static class that can't be initlaized", () => {
		expect(() => {
			let x = new Direction();
			x = x;
		}).toThrow();
	});

	it("normalizes a direction, making sure it's between 0 and 360 degrees", () => {
		expect(Direction.Normalize(0)).toBe(0);
		expect(Direction.Normalize(90)).toBe(90);
		expect(Direction.Normalize(180)).toBe(180);
		expect(Direction.Normalize(270)).toBe(270);
		expect(Direction.Normalize(360)).toBe(0);

		expect(Direction.Normalize(-90)).toBe(270);
		expect(Direction.Normalize(450)).toBe(90);
	});

	it("can map the input to a 45° angle", () => {
		expect(Direction.Confine(1)).toBe(0);
		expect(Direction.Confine(44)).toBe(45);
		expect(Direction.Confine(46)).toBe(45);
		expect(Direction.Confine(270)).toBe(270);
		expect(Direction.Confine(265)).toBe(270);
		expect(Direction.Confine(350)).toBe(0);
	});

	it("calculates the angle from the origin point to a gien point", () => {
		expect(Direction.CalculateAngleFromRelativePoint({ x: 1, y: 0 })).toBe(0);
		expect(Direction.CalculateAngleFromRelativePoint({ x: -1, y: 0 })).toBe(180);

	});

	it("given an angle and a distance it calculates a point", () => {
		let point;

		point = Direction.CalculateRelativeCoordinates(123, 0);
		expect(point.x).toBe(0);
		expect(point.y).toBe(0);

		point = Direction.CalculateRelativeCoordinates(0, 5);
		expect(point.x).toBe(5);
		expect(point.y).toBe(0);

		point = Direction.CalculateRelativeCoordinates(180, 5);
		expect(point.x).toBe(-5);
		expect(point.y).toBe(0);

		point = Direction.CalculateRelativeCoordinates(90, 5);
		expect(point.x).toBe(0);
		expect(point.y).toBe(5);

		point = Direction.CalculateRelativeCoordinates(270, 5);
		expect(point.x).toBe(0);
		expect(point.y).toBe(-5);
	});

	it("rounds the results to have nice value that can be used in-game", () => {
		let point;

		point = Direction.CalculateRelativeCoordinates(45, 1);
		expect(point.x).toBe(1);
		expect(point.y).toBe(1);

		point = Direction.CalculateRelativeCoordinates(45, 2);
		expect(point.x).toBe(2);
		expect(point.y).toBe(2);

		point = Direction.CalculateRelativeCoordinates(45, 10);
		expect(point.x).toBe(10);
		expect(point.y).toBe(10);
	});
});
