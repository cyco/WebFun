import OnscreenPad from "src/app/webfun/ui/onscreen-pad";

describeComponent(OnscreenPad, () => {
	let subject: OnscreenPad;

	beforeEach(() => (subject = render(OnscreenPad) as any));
	afterEach(() => subject.remove());

	it("uses SVG to render a virtual control pad", () => {
		expect(subject.querySelector("svg")).not.toBeFalsy();
	});
});
