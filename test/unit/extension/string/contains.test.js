import contains from "/extension/string/contains";

describe("String.contains", () => {
	it("extends the String prototype", () => {
		let string = "test";
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
