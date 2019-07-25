import WindowModalSession from "src/ux/window-modal-session";
import { Window } from "src/ui/components";

describe("WebFun.UX.WindowModalSession", () => {
	let subject: WindowModalSession;
	let window: Window;
	beforeEach(() => {
		window = {} as any;
		subject = new WindowModalSession(window);
	});

	it("is a class", () => {
		expect(WindowModalSession).toBeClass();
	});
});
