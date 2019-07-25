import ProgressIndicator from "src/ui/components/progress-indicator";

describeComponent(ProgressIndicator, () => {
	let subject: ProgressIndicator;
	beforeEach(() => (subject = render(ProgressIndicator) as ProgressIndicator));

	it("renders an indeterminate progress indicator", () => {
		expect(subject.firstChild.childNodes.length).toEqual(12);
	});
});
