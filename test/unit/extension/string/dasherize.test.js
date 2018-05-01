import dasherize from "src/extension/string/dasherize";

describe("WebFun.Extension.String.dasherize", () => {
	it("extends the sting prototype to convert strings from camel case to dash-case", () => {
		expect("".dasherize).toBeFunction();
	});

	it("converts strings corretly", () => {
		expect("MyTestString".dasherize()).toEqual("my-test-string");
	});
});
