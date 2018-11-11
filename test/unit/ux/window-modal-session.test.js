import WindowModalSession from "src/ux/window-modal-session";

describe("WebFun.UX.WindowModalSession", () => {
	let subject;
	let window;
	beforeEach(() => {
		window = {};
		subject = new WindowModalSession(window);
	});

	it("is a class", () => {
		expect(WindowModalSession).toBeClass();
	});
});
