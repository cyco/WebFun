import Button from "src/ui/components/button";

describeComponent(Button, () => {
	let subject;
	beforeEach(() => subject = render(Button));

	it("displays a button that can be clicked", () => {
		expect(subject.tagName.toLowerCase()).toBe("wf-button");
	});
});
