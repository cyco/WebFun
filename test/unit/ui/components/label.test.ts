import Label from "src/ui/components/label";

describeComponent(Label, () => {
	let subject: Label;
	beforeEach(() => (subject = render("<wf-label>Text</wf-label>") as Label));

	it("a component that shows a text that can be edited by double-clicking the element", () => {
		expect(subject.innerText).toBe("Text");

		subject.handleEvent((new CustomEvent("click") as any) as MouseEvent);
		subject.dispatchEvent(new CustomEvent("dblclick"));
		subject.dispatchEvent(new CustomEvent("dblclick"));
		subject.addEventListener("change", () => {
			expect(subject.innerText).toBe("New Text");
		});

		expect(subject).toHaveAttribute("contenteditable");
		subject.textContent = "New Text";
		const event = new CustomEvent("keydown") as any;
		event.code = "Enter";
		subject.dispatchEvent(event);

		expect(subject.textContent).toBe("New Text");
	});
});
