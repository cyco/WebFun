import { setTimeout } from "std";

describe("std", () => {
	it("is used to import classes and functions found in the standard library", () => {
		expect(setTimeout).toBeFunction();
	});
});
