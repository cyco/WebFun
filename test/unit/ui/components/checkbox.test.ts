import Checkbox from "src/ui/components/checkbox";
import simulateEvent from "test/helpers/dom-events";

describeComponent(Checkbox, () => {
	let subject: Checkbox;

	beforeEach(() => (subject = render(Checkbox) as Checkbox));

	it("can have a title", () => {
		const labelNode = subject.querySelector("label");
		subject.title = "test title";
		expect(subject.title).toBe("test title");
		expect(labelNode.textContent.indexOf("test title")).not.toBe(-1);
	});

	it("can be checked", () => {
		expect(subject.checked).toBeFalse();

		subject.checked = true;
		expect(subject.checked).toBeTrue();
		const inputNode = subject.querySelector("input[type=checkbox]") as HTMLInputElement;
		expect(inputNode.checked).toBeTrue();

		subject.checked = false;
		expect(subject.checked).toBeFalse();
		expect(inputNode.checked).toBeFalse();
	});

	it("when changed it calls its onclick callback", done => {
		const callback = () => {
			expect(true).toBeTrue();
			done();
		};
		subject.onchange = callback;
		expect(subject.onchange).toBe(callback);

		const inputNode = subject.querySelector("input[type=checkbox]");
		simulateEvent(inputNode, "change");
	});
});
