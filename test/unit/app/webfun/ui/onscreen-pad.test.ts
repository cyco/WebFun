import OnscreenPad from "src/app/webfun/ui/onscreen-pad";
import { Settings } from "src";

describeComponent(OnscreenPad, () => {
	let subject: OnscreenPad;

	beforeAll(() => (Settings.debug = true));
	beforeEach(() => (subject = render(OnscreenPad) as any));
	afterEach(() => subject.remove());
	afterAll(() => (Settings.debug = false));

	it("uses SVG to render a virtual control pad", () => {
		expect(subject.querySelector("svg")).not.toBeFalsy();
	});
});
