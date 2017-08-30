import * as Util from "/util";
import ResetCursor from "/ux/reset-cursor";
import { document } from "/std.dom";

describe("ResetCursor", () => {
	it("in Safari it changes the cursor immediately without waiting for mouse movement", () => {
		let callback = null;
		spyOn(Util, "dispatch").and.callFake((cb) => callback = cb);

		expect(ResetCursor).toBeFunction();
		expect(() => {
			ResetCursor();
		}).not.toThrow();

		expect(Util.dispatch).toHaveBeenCalled();
		expect(callback).toBeFunction();

		callback();
		expect(document.body).toHaveClass("cursor-reset");

		callback();
		expect(document.body).not.toHaveClass("cursor-reset");
	});
});
