import Label from "src/ui/components/label";
import { KeyEvent } from "src/util";

describeComponent(Label, () => {
	let subject: Label;
	beforeEach(() => (subject = render("<wf-label>Text</wf-label>") as Label));

	it("a component that shows a text that can be edited by double-clicking the element", done => {
		expect(subject.innerText).toBe("Text");

		subject.handleEvent((new CustomEvent("click") as any) as MouseEvent);
		subject.dispatchEvent(new CustomEvent("dblclick"));
		subject.dispatchEvent(new CustomEvent("dblclick"));
		subject.addEventListener("change", () => {
			expect(subject.innerText).toBe("New Text");
			done();
		});

		expect(subject).toHaveAttribute("contenteditable");
		subject.textContent = "New Text";
		const event = new CustomEvent("keydown") as any;
		event.which = KeyEvent.DOM_VK_ENTER;
		subject.dispatchEvent(event);
	});

	it("can be made to enter edit mode programmatically (and is protected against multiple calls)", () => {
		subject.beginEditing();
		expect(subject).toHaveAttribute("contenteditable");
		expect(() => subject.beginEditing()).not.toThrow();

		subject.endEditing();
		expect(() => subject.endEditing()).not.toThrow();
		expect(subject).not.toHaveAttribute("contenteditable");
	});
});
