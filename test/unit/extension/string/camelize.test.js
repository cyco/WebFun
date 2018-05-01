import camelize from "src/extension/string/camelize";

describe("WebFun.Extension.String.camelize", () => {
	it("extends the sting prototype to convert strings to camel case", () => {
		expect("".camelize).toBeFunction();
	});

	it("converts strings corretly", () => {
		expect("my-test-string".camelize()).toEqual("MyTestString");
		expect("".camelize()).toEqual("");
	});
});
