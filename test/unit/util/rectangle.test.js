import Point from "src/util/point";
import Rectangle from "src/util/rectangle";
import Size from "src/util/size";

describe("WebFun.Util.Rectangle", () => {
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
		expect(subject.contains(new Point(3, 1))).toBeFalse();
	});

	it("inset", () => {
		const subject = new Rectangle(new Point(1, 1), new Size(2, 2));
		const result = subject.inset(-1, -2);
		expect(result.minX).toBe(0);
		expect(result.minY).toBe(-1);
		expect(result.size.width).toBe(4);
		expect(result.size.height).toBe(6);
	});
});
