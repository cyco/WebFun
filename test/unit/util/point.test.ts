import Point from "src/util/point";
import Size from "src/util/size";

describe("WebFun.Util.Point", () => {
	it("defines a point in space with up to 3 coordinates", () => {
		const point = new Point(1, 2, 3);
		expect(point.x).toBe(1);
		expect(point.y).toBe(2);
		expect(point.z).toBe(3);
	});

	it("points can also be created from any object that has x,y and z properties", () => {
		const object = {
			x: 2,
			y: 3,
			z: 4
		};
		const point = new Point(object);
		expect(point.x).toBe(2);
		expect(point.y).toBe(3);
		expect(point.z).toBe(4);
	});

	it("has a static method to add to points", () => {
		expect(typeof Point.add).toBe("function");

		const firstPoint = new Point(1, 2, 3);
		const secondPoint = new Point(-5, 3, 3);

		const result = Point.add(firstPoint, secondPoint);

		expect(result.x).toBe(-4);
		expect(result.y).toBe(5);
	});

	it("adding two points just uses the z-coordinate of the first point", () => {
		expect(typeof Point.add).toBe("function");

		const firstPoint = new Point(1, 2, 7);
		const secondPoint = new Point(-5, 3, 3);

		const result = Point.add(firstPoint, secondPoint);

		expect(result.z).toBe(7);
	});

	it("has a static method to subtract to points", () => {
		expect(typeof Point.add).toBe("function");

		const firstPoint = new Point(1, 2, 3);
		const secondPoint = new Point(-5, 3, 3);

		const result = Point.subtract(firstPoint, secondPoint);

		expect(result.x).toBe(6);
		expect(result.y).toBe(-1);
	});

	it("subtract two points just uses the z-coordinate of the first point", () => {
		expect(typeof Point.add).toBe("function");

		const firstPoint = new Point(1, 2, 7);
		const secondPoint = new Point(-5, 3, 3);

		const result = Point.subtract(firstPoint, secondPoint);

		expect(result.z).toBe(7);
	});

	describe("clone", () => {
		it("just creates a copy", () => {
			const original = new Point(3, 4);
			const clone = original.clone();
			expect(clone.x).toBe(3);
			expect(clone.y).toBe(4);
		});
	});

	describe("add", () => {
		it("adds one point to another", () => {
			const firstPoint = new Point(1, 2, 3);
			const secondPoint = new Point(-5, 3, 3);

			firstPoint.add(secondPoint);

			expect(firstPoint.x).toBe(-4);
			expect(firstPoint.y).toBe(5);
		});

		it("can also be called with the coordinates to add", () => {
			const firstPoint = new Point(1, 2, 3);

			firstPoint.add(1, 2);

			expect(firstPoint.x).toBe(2);
			expect(firstPoint.y).toBe(4);
		});

		it("doesn't touch the z-coordinate", () => {
			const firstPoint = new Point(1, 2, 3);
			const secondPoint = new Point(-5, 3, 3);
			firstPoint.add(secondPoint);
			expect(firstPoint.z).toBe(3);
		});

		it("has an non-mutating equivalent called byAdding", () => {
			const firstPoint = new Point(1, 2, 3);
			const secondPoint = new Point(-5, 3, 3);

			const result = firstPoint.byAdding(secondPoint);

			expect(result.x).toBe(-4);
			expect(result.y).toBe(5);

			expect(firstPoint.x).toBe(1);
			expect(firstPoint.y).toBe(2);
		});
	});

	describe("subtract", () => {
		it("subtract one point from another", () => {
			const firstPoint = new Point(1, 2, 3);
			const secondPoint = new Point(-5, 3, 3);

			firstPoint.subtract(secondPoint);

			expect(firstPoint.x).toBe(6);
			expect(firstPoint.y).toBe(-1);
		});

		it("can also be called with the coordinates to subtract", () => {
			const firstPoint = new Point(1, 2, 3);

			firstPoint.subtract(1, 2);

			expect(firstPoint.x).toBe(0);
			expect(firstPoint.y).toBe(0);
		});

		it("doesn't touch the z-coordinate", () => {
			const firstPoint = new Point(1, 2, 3);
			const secondPoint = new Point(-5, 3, 3);
			firstPoint.subtract(secondPoint);
			expect(firstPoint.z).toBe(3);
		});

		it("has an non-mutating equivalent called bySubtracting", () => {
			const firstPoint = new Point(1, 2, 3);
			const secondPoint = new Point(-5, 3, 3);

			const result = firstPoint.bySubtracting(secondPoint);

			expect(result.x).toBe(6);
			expect(result.y).toBe(-1);

			expect(firstPoint.x).toBe(1);
			expect(firstPoint.y).toBe(2);
		});
	});

	describe("abs", () => {
		it("negates negative coordinates", () => {
			const point = new Point(-1, -2);
			point.abs();
			expect(point.x).toBe(1);
			expect(point.y).toBe(2);
		});

		it("doesn't touch positive coordinates", () => {
			const point = new Point(1, 2);
			point.abs();
			expect(point.x).toBe(1);
			expect(point.y).toBe(2);
		});

		it("never touches the z coordinate", () => {
			const point = new Point(1, 2, -5);
			point.abs();
			expect(point.z).toBe(-5);
		});

		it("has an non-mutating equivalent called byAbsing", () => {
			const input = new Point(-5, -3, 3);
			const result = input.byAbsing();

			expect(result.x).toBe(5);
			expect(result.y).toBe(3);

			expect(input.x).toBe(-5);
			expect(input.y).toBe(-3);
		});
	});

	it("has a method to floor all coordinates", () => {
		const point = new Point(1.2, 3.2, 7.9);
		point.floor();
		expect(point.x).toBe(1);
		expect(point.y).toBe(3);
		expect(point.z).toBe(7);
	});

	it("has an non-mutating method to floor components", () => {
		const point = new Point(1.2, 3.2, 7.9);
		const result = point.byFlooring();
		expect(result.x).toBe(1);
		expect(result.y).toBe(3);
		expect(result.z).toBe(7);

		expect(point.x).toBe(1.2);
		expect(point.y).toBe(3.2);
		expect(point.z).toBe(7.9);
	});

	it("has a method to ceil all coordinates", () => {
		const point = new Point(1.2, 3.2, 7.9);
		point.ceil();
		expect(point.x).toBe(2);
		expect(point.y).toBe(4);
		expect(point.z).toBe(8);
	});

	it("has an non-mutating method to ceil components", () => {
		const point = new Point(1.2, 3.2, 7.9);
		const result = point.byCeiling();
		expect(result.x).toBe(2);
		expect(result.y).toBe(4);
		expect(result.z).toBe(8);

		expect(point.x).toBe(1.2);
		expect(point.y).toBe(3.2);
		expect(point.z).toBe(7.9);
	});

	it("has a method to scale x,y coordinates", () => {
		const point = new Point(1, 3, 7);
		point.scaleBy(3);
		expect(point.x).toBe(3);
		expect(point.y).toBe(9);
		expect(point.z).toBe(7);
	});

	it("has an non-mutating method to scale components", () => {
		const point = new Point(1, 3, 7);
		const result = point.byScalingBy(3);

		expect(result.x).toBe(3);
		expect(result.y).toBe(9);
		expect(result.z).toBe(7);

		expect(point.x).toBe(1);
		expect(point.y).toBe(3);
		expect(point.z).toBe(7);
	});

	it("has an non-mutating method to create a point by dividing components by a size", () => {
		const point = new Point(6, 8, 7);
		const result = point.dividedBy(new Size(3, 2));

		expect(result.x).toBe(2);
		expect(result.y).toBe(4);
		expect(result.z).toBe(7);

		expect(point.x).toBe(6);
		expect(point.y).toBe(8);
		expect(point.z).toBe(7);
	});

	describe("isUnidirectional", () => {
		it("it determines if only either the x or y-coordinate is set", () => {
			let point;

			point = new Point(0, 2, -5);
			expect(point.isUnidirectional()).toBeTrue();

			point = new Point(2, 0, -5);
			expect(point.isUnidirectional()).toBeTrue();

			point = new Point(2, 2, -5);
			expect(point.isUnidirectional()).toBeFalse();
		});

		it("A zero point is considered to be unidirectional", () => {
			const point = new Point(0, 0);
			expect(point.isUnidirectional()).toBeTrue();
		});
	});

	it("isInBounds is true if coordinates are positive and less than the specified size", () => {
		const size = {
			width: 10,
			height: 5
		};
		let point;

		point = new Point(2, 3);
		expect(point.isInBounds(size)).toBeTrue();

		point = new Point(0, 0);
		expect(point.isInBounds(size)).toBeTrue();

		point = new Point(-1, 3);
		expect(point.isInBounds(size)).toBeFalse();

		point = new Point(0, -3);
		expect(point.isInBounds(size)).toBeFalse();

		point = new Point(11, 0);
		expect(point.isInBounds(size)).toBeFalse();

		point = new Point(0, 6);
		expect(point.isInBounds(size)).toBeFalse();

		point = new Point(10, 5);
		expect(point.isInBounds(size)).toBeFalse();
	});

	it("isZeroPoint determines if all coordinates are zero", () => {
		let point;

		point = new Point(0, 0);
		expect(point.isZeroPoint()).toBeTrue();

		point = new Point(0, 1);
		expect(point.isZeroPoint()).toBeFalse();

		point = new Point(1, 0);
		expect(point.isZeroPoint()).toBeFalse();

		point = new Point(1, 1);
		expect(point.isZeroPoint()).toBeFalse();
	});

	it("properly converts to a human-readable string", () => {
		const point = new Point(2, 3);
		expect(point.toString()).toBe("Point {2x3}");
		expect("" + point).toBe("Point {2x3}");
	});

	it("isEqualTo can be used to check two points for equality", () => {
		const pointA = new Point(2, 3, 4);
		const pointB = new Point(2, 3, 4);
		const pointC = new Point(-2, 4, 4);

		expect(pointA.isEqualTo(pointB)).toBeTrue();
		expect(pointB.isEqualTo(pointA)).toBeTrue();

		expect(pointA.isEqualTo(pointC)).toBeFalse();
		expect(pointA.isEqualTo(null)).toBeFalse();
	});

	it("isEqualTo ignores z component if it's missing in either point", () => {
		const pointA = new Point(2, 3, null);
		const pointB = new Point(2, 3, undefined);
		const pointC = new Point(2, 3, 4);

		expect(pointA.isEqualTo(pointA)).toBeTrue();
		expect(pointA.isEqualTo(pointB)).toBeTrue();
		expect(pointA.isEqualTo(pointC)).toBeTrue();

		expect(pointB.isEqualTo(pointA)).toBeTrue();
		expect(pointB.isEqualTo(pointB)).toBeTrue();
		expect(pointB.isEqualTo(pointC)).toBeTrue();

		expect(pointC.isEqualTo(pointA)).toBeTrue();
		expect(pointC.isEqualTo(pointB)).toBeTrue();
		expect(pointC.isEqualTo(pointC)).toBeTrue();
	});

	it("has a method to calculate the distance to another point", () => {
		const p1 = new Point(3, 4, 5);
		const p2 = new Point(4, -2, 2);

		expect(p1.distanceTo(p2)).toBeCloseTo(6, 0.1);
	});

	it("can be compared to other points", () => {
		let p1 = new Point(3, 4);
		let p2 = new Point(3, 4);
		expect(p1.comparedTo(p2)).toEqual(new Point(0, 0));

		p1 = new Point(2, 3);
		p2 = new Point(3, 4);
		expect(p1.comparedTo(p2)).toEqual(new Point(-1, -1));

		p1 = new Point(4, 5);
		p2 = new Point(3, 4);
		expect(p1.comparedTo(p2)).toEqual(new Point(1, 1));

		p1 = new Point(7, 4);
		p2 = new Point(4, 5);
		expect(p1.comparedTo(p2)).toEqual(new Point(1, -1));
	});
});
