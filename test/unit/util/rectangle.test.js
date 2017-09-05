import Point from "src/util/point";
import Size from "src/util/size";
import Rectangle from "src/util/rectangle";

describe("Rectangle", () => {
	it("is a class", () => {
		expect(Rectangle).toBeClass();
	});

	describe("properties", () => {
		const subject = new Rectangle(new Point(-1, 2), new Size(5, 4));

		it("minX", () => {
			expect(subject.minX).toBe(-1);
		});

		it("minY", () => {
			expect(subject.minY).toBe(2);
		});

		it("maxX", () => {
			expect(subject.maxX).toBe(4);
		});

		it("maxY", () => {
			expect(subject.maxY).toBe(6);
		});

		it("area", () => {
			expect(subject.area).toBe(20);
		});
	});

	it("contains", () => {
		const subject = new Rectangle(new Point(1, 1), new Size(2, 2));
		expect(subject.contains(new Point(0, 0))).toBeFalse();
		expect(subject.contains(new Point(1, 2))).toBeTrue();
	});
});
