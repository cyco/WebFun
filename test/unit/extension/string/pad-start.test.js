import padStart from "src/extension/string/pad-start";

describe("String.padStart", () => {
	it("extends the String prototype", () => {
		let string = "test";
		expect(string.padStart).toBeFunction();
	});

	it("add spaces to the front of a string to pad it to the specified length", () => {
		let result = "test".padStart(10);
		expect(result).toBe("      test");

		result = padStart.call("test", 10);
		expect(result).toBe("      test");
	});

	it("the fill character can be specified as the second paramter", () => {
		let result = "test".padStart(10, "•");
		expect(result).toBe("••••••test");

		result = padStart.call("test", 10, "•");
		expect(result).toBe("••••••test");
	});
});
