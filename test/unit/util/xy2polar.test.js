import xy2polar from "src/util/xy2polar";

describe("xy2polar", () => {
	it("is a function used to convert x,y-coordinats to radius & distance", () => {
		expect(typeof xy2polar).toBe("function");
	});
});
