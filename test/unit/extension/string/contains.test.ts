import contains from "src/extension/string/contains";

describe("WebFun.Extension.String.contains", () => {
	it("extends the String prototype", () => {
		const string = "test";
		expect(string.contains).toBeFunction();
	});

	it("returns true if the string contains another string", () => {
		expect("my-string".contains("-")).toBeTrue();
		expect("my-fancy-string".contains("y")).toBeTrue();

		expect(contains.call("another-example", "x")).toBeTrue();
	});

	it("returns false if the string does not container another string", () => {
		expect("my-string".contains(".")).toBeFalse();
		expect("my-fancy-string".contains("z")).toBeFalse();
	});
});
