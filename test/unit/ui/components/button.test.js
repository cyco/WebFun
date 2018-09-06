import Button from "src/ui/components/button";

describeComponent(Button, () => {
	let subject;
	beforeEach(() => (subject = render(Button, { label: "initial label" })));

	it("displays a button that can be clicked", () => {
		expect(subject.tagName.toLowerCase()).toBe("wf-button");
	});

	it("'s label can be set using the label attribute and property", () => {
		expect(subject.label).toBe("initial label");

		subject.label = "my new label";
		expect(subject.getAttribute("label")).toBe("my new label");
	});
});
