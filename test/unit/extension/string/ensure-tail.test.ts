import ensureTail from "src/extension/string/ensure-tail";

describe("WebFun.Extension.String.ensureTail", () => {
	it("appned the given string to the end of a string if it's not already present", () => {
		expect("path/to/directory".ensureTail("/")).toEqual("path/to/directory/");
		expect("path/to/directory/".ensureTail("/")).toEqual("path/to/directory/");

		expect("value-with-long-string".ensureTail("string")).toEqual("value-with-long-string");

		expect(ensureTail.call("test", "ta")).toEqual("testta");
	});
});
