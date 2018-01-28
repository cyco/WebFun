import Checkbox from "src/ui/components/checkbox";
import simulateEvent from "test-helpers/dom-events";

describeComponent(Checkbox, () => {
	let subject;

	beforeEach(() => (subject = render(Checkbox)));

	it("can have a title", () => {
		let labelNode = subject.querySelector("label");
		subject.title = "test title";
		expect(subject.title).toBe("test title");
		expect(labelNode.textContent.indexOf("test title")).not.toBe(-1);
	});

	it("can be checked", () => {
		expect(subject.checked).toBeFalse();

		subject.checked = true;
		expect(subject.checked).toBeTrue();
		let inputNode = subject.querySelector("input[type=checkbox]");
		expect(inputNode.checked).toBeTrue();

		subject.checked = false;
		expect(subject.checked).toBeFalse();
		expect(inputNode.checked).toBeFalse();
	});

	it("when changed it calls its onclick callback", done => {
		let callback = () => {
			expect(true).toBeTrue();
			done();
		};
		subject.onchange = callback;
		expect(subject.onchange).toBe(callback);

		let inputNode = subject.querySelector("input[type=checkbox]");
		simulateEvent(inputNode, "change");
	});
});
