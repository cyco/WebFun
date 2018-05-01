import escape from "src/extension/regexp/escape";

describe("WebFun.Extension.RegExp", () => {
	it("adds a method to RegExps ", () => {
		expect(RegExp.escape).toBeFunction();
	});

	it("escapes characters with special meaning in a regular expression", () => {
		expect(RegExp.escape(".]*")).toEqual("\\.\\]\\*");
	});
});
