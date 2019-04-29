import padEnd from "src/extension/string/pad-end";

describe("WebFun.Extension.String.padEnd", () => {
	it("extends the String prototype", () => {
		const string = "test";
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
