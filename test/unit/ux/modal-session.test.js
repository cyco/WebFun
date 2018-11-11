import ModalSession from "src/ux/modal-session";

describe("WebFun.UX.ModalSession", () => {
	let subject;
	let window;
	beforeEach(() => {
		window = {};
		subject = new ModalSession(window);
	});

	it("is a class", () => {
		expect(ModalSession).toBeClass();
	});
});
