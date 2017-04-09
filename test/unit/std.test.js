import { Image, global } from '/std';
describe("std", () => {
	it("is used to import classes found in the standard library", () => {
		expect(Image).toBe(global.Image);
	});
});
