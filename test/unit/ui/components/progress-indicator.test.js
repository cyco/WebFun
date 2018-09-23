import ProgressIndicator from "src/ui/components/progress-indicator";

describeComponent(ProgressIndicator, () => {
	let subject;
	beforeEach(() => (subject = render(ProgressIndicator)));

	it("renders an indeterminate progress indicator", () => {
		expect(subject.firstChild.childNodes.length).toEqual(12);
	});
});
