import padEnd from "/extension/string/pad-end";

describe("String.padEnd", () => {
	it("extends the String prototype", () => {
		let string = "test";
		expect(string.padEnd).toBeFunction();
	});

	it("add spaces to the back of a string to pad it to the specified length", () => {
		let result = "test".padEnd(10);
		expect(result).toBe("test      ");

		result = padEnd.call("test", 10);
		expect(result).toBe("test      ");
	});

	it("the fill character can be specified as the second paramter", () => {
		let result = "test".padEnd(10, "•");
		expect(result).toBe("test••••••");

		result = padEnd.call("test", 10, "•");
		expect(result).toBe("test••••••");
	});
});
