import WindowModalSession from "/ux/window-modal-session";

describe("WindowModalSession", () => {
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
