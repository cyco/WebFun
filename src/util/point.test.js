import Point from "/util/point";

describe("Point", () => {
	it("defines a point in space with up to 3 coordinates", () => {
		let point = new Point(1, 2, 3);
		expect(point.x).toBe(1);
		expect(point.y).toBe(2);
		expect(point.z).toBe(3);
	});

	it("points can also be created from any object that has x,y and z properties", () => {
		let object = {
			x: 2,
			y: 3,
			z: 4
		};
		let point = new Point(object);
		expect(point.x).toBe(2);
		expect(point.y).toBe(3);
		expect(point.z).toBe(4);
	});

	it("has a static method to add to points", () => {
		expect(typeof Point.add).toBe("function");

		let firstPoint = new Point(1, 2, 3);
		let secondPoint = new Point(-5, 3, 3);

		let result = Point.add(firstPoint, secondPoint);

		expect(result.x).toBe(-4);
		expect(result.y).toBe(5);
	});

	it("adding two points just uses the z-coordinate of the first point", () => {
		expect(typeof Point.add).toBe("function");

		let firstPoint = new Point(1, 2, 7);
		let secondPoint = new Point(-5, 3, 3);

		let result = Point.add(firstPoint, secondPoint);

		expect(result.z).toBe(7);
	});

	it("has a static method to subtract to points", () => {
		expect(typeof Point.add).toBe("function");

		let firstPoint = new Point(1, 2, 3);
		let secondPoint = new Point(-5, 3, 3);

		let result = Point.subtract(firstPoint, secondPoint);

		expect(result.x).toBe(6);
		expect(result.y).toBe(-1);
	});

	it("subtract two points just uses the z-coordinate of the first point", () => {
		expect(typeof Point.add).toBe("function");

		let firstPoint = new Point(1, 2, 7);
		let secondPoint = new Point(-5, 3, 3);

		let result = Point.subtract(firstPoint, secondPoint);

		expect(result.z).toBe(7);
	});

	describe("add", () => {
		it("adds one point to another", () => {

			let firstPoint = new Point(1, 2, 3);
			let secondPoint = new Point(-5, 3, 3);

			firstPoint.add(secondPoint);

			expect(firstPoint.x).toBe(-4);
			expect(firstPoint.y).toBe(5);
		});

		it("can also be called with the coordinates to add", () => {
			let firstPoint = new Point(1, 2, 3);

			firstPoint.add(1, 2, 3);

			expect(firstPoint.x).toBe(2);
			expect(firstPoint.y).toBe(4);
		});

		it("doesn't touch the z-coordinate", () => {
			let firstPoint = new Point(1, 2, 3);
			let secondPoint = new Point(-5, 3, 3);
			firstPoint.add(secondPoint);
			expect(firstPoint.z).toBe(3);
		});
	});


	describe("subtract", () => {
		it("subtract one point from another", () => {

			let firstPoint = new Point(1, 2, 3);
			let secondPoint = new Point(-5, 3, 3);

			firstPoint.subtract(secondPoint);

			expect(firstPoint.x).toBe(6);
			expect(firstPoint.y).toBe(-1);
		});

		it("can also be called with the coordinates to subtract", () => {
			let firstPoint = new Point(1, 2, 3);

			firstPoint.subtract(1, 2, 3);

			expect(firstPoint.x).toBe(0);
			expect(firstPoint.y).toBe(0);
		});

		it("doesn't touch the z-coordinate", () => {
			let firstPoint = new Point(1, 2, 3);
			let secondPoint = new Point(-5, 3, 3);
			firstPoint.subtract(secondPoint);
			expect(firstPoint.z).toBe(3);
		});
	});

	describe("abs", () => {
		it("negates negative coordinates", () => {
			let point = new Point(-1, -2);
			point.abs();
			expect(point.x).toBe(1);
			expect(point.y).toBe(2);
		});

		it("doesn't touch positive coordinates", () => {
			let point = new Point(1, 2);
			point.abs();
			expect(point.x).toBe(1);
			expect(point.y).toBe(2);
		});

		it("never touches the z coordinate", () => {
			let point = new Point(1, 2, -5);
			point.abs();
			expect(point.z).toBe(-5);
		});
	});

	it("has a method to floor all coordinates", () => {
		let point = new Point(1.2, 3.2, 7.9);
		point.floor();
		expect(point.x).toBe(1);
		expect(point.y).toBe(3);
		expect(point.z).toBe(7);
	});

	it("has a method to ceil all coordinates", () => {
		let point = new Point(1.2, 3.2, 7.9);
		point.ceil();
		expect(point.x).toBe(2);
		expect(point.y).toBe(4);
		expect(point.z).toBe(8);
	});

	it("has a method to scale x,y coordinates", () => {
		let point = new Point(1, 3, 7);
		point.scaleBy(3);
		expect(point.x).toBe(3);
		expect(point.y).toBe(9);
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
			let point = new Point(0, 0);
			expect(point.isUnidirectional()).toBeTrue();
		});
	});

	it("isInBounds is true if coordinates are positive and less than the specified size", () => {
		let size = {
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
		let point = new Point(2, 3);
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
});
