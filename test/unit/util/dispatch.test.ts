import dispatch from "src/util/dispatch";

describe("WebFun.Util.dispatch", () => {
	it("dispatch is an alias for setTimeout", done => {
		dispatch(() => {
			expect(true).toBeTrue();
			done();
		});
	});

	it("can take an optional delay", done => {
		dispatch(() => {
			expect(true).toBeTrue();
			done();
		}, 0);
	});

	it("timeout can be awaited", async () => {
		try {
			await dispatch(() => {
				throw false;
			}, 0);
		} catch (e) {
			expect(e).toBeFalse();
		}
	});
});
