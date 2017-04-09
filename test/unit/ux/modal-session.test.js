import sandboxed from '../../helpers/dom-sandbox';
import ModalSession from '/ux/modal-session';

describe("ModalSession", () => {
	let subject;
	let window;
	beforeEach(() => {
		window = {};
		subject = new ModalSession(window);
	});

	it('is a class', () => {
		expect(ModalSession).toBeClass();
	});
});
