import * as stdlib from "src/std";
import sleep from "src/util/sleep";
declare let jasmine: any;

describe("WebFun.Util.sleep", () => {
	it("is an asynchronous function that resolves after a given time", () => {
		spyOn(stdlib, "setTimeout");

		sleep(10);
		expect(stdlib.setTimeout).toHaveBeenCalledWith(jasmine.anything(), 10);
		stdlib.setTimeout.calls.mostRecent().args[0]();
	});
});
