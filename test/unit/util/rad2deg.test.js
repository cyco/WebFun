import rad2deg from "src/util/rad2deg";

describe("rad2deg", () => {
	it("is a function that converts radians to degrees", () => {
		expect(typeof rad2deg).toBe("function");
	});
});
