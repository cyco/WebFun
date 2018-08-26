import parseInt from "src/extension/string/parse-int";

describe("WebFun.Extension.String.parseInt", () => {
	it("extends the string prototype to parse int values based on a prefix ", () => {
		expect("".parseInt).toBeFunction();
		expect(parseInt).toBeFunction();
	});

	it("parses hex values correctly", () => {
		expect("0xAD".parseInt()).toBe(173);
		expect("0X23".parseInt()).toBe(35);
	});

	it("parses binary values correctly", () => {
		expect("0b1".parseInt()).toBe(1);
		expect("0B101010".parseInt()).toBe(42);
	});

	it("parses decimal values correctly", () => {
		expect("42".parseInt()).toBe(42);
		expect("23".parseInt()).toBe(23);
	});

	it("returns NaN if nothing can be parsed", () => {
		expect("abc".parseInt()).toBeNaN();
		expect("a2".parseInt()).toBeNaN();
	});

	it("parses integer up to garbage if possible", () => {
		expect("1a".parseInt()).toBe(1);
	});
});
