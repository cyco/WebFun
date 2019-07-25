import ModalSession from "src/ux/modal-session";

describe("WebFun.UX.ModalSession", () => {
	let subject: ModalSession;

	beforeEach(() => {
		subject = new ModalSession();
	});

	it("is a class", () => {
		expect(ModalSession).toBeClass();
	});
});
