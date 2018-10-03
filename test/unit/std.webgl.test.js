import { WebGLTexture } from "std/webgl";

describe("std", () => {
	it("is used to import classes and functions found in the webgl part of the standard library", () => {
		expect(WebGLTexture).toBeFunction();
	});
});
