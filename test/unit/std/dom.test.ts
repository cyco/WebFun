import { Element } from "src/std/dom";

describe("std/dom", () => {
	it("is used to import classes and functions found in the standard library", () => {
		expect(Element).toBeFunction();
	});
});
