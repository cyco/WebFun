import Size from "src/util/size";

describe("WebFun.Util.Size", () => {
	it("is a simple that represents a size", () => {
		expect(typeof Size).toBe("function");

		const aSize = new Size(10, 3);
		expect(aSize.width).toBe(10);
		expect(aSize.height).toBe(3);
	});

	it("properly converts to a human-readable string", () => {
		const size = new Size(2, 3);
		expect(size.toString()).toBe("Size {2x3}");
		expect("" + size).toBe("Size {2x3}");
	});

	it("can be scaled, leaving the original object untouched", () => {
		const size = new Size(2, 3);
		const scaledSize = size.scaleBy(3);

		expect(scaledSize.width).toEqual(6);
		expect(scaledSize.height).toEqual(9);

		expect(size.width).toEqual(2);
		expect(size.height).toEqual(3);
	});
});
