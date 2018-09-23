import Segment from "src/ui/components/segment";

describeComponent(Segment, () => {
	let subject;
	beforeEach(() => (subject = render(Segment)));

	it("is a cell for a segment control", () => {
		expect(subject.tagName.toLowerCase()).toBe("wf-segment");
	});

	it("can be selected", () => {
		expect(subject.selected).toBeFalse();
		subject.setAttribute("selected", "");
		expect(subject.selected).toBeTrue();
		subject.selected = subject.selected;

		subject.selected = false;
		expect(subject).not.toHaveAttribute("selected");
	});
});
