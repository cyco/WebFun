import RadioButton from "src/ui/components/radio-button";

describeComponent(RadioButton, () => {
	let subject: RadioButton;
	beforeEach(() => (subject = render(RadioButton) as RadioButton));
	afterEach(() => subject.remove());

	it("manages a radio input element", () => {
		expect(subject.querySelector("input[type=radio]")).toBeTruthy();
	});

	it("the title can be changed", () => {
		const newTitle = "new button title";

		subject.title = newTitle;
		expect(subject.title).toBe(newTitle);
		expect(subject.textContent).toContain(newTitle);
	});

	it("can be checked", () => {
		expect(subject.checked).toBeFalse();
		expect(subject.querySelector("input[checked]")).toBeFalsy();

		subject.checked = true;
		expect(subject.checked).toBeTrue();
		expect(subject.querySelector("input[checked]")).toBeTruthy();

		subject.checked = false;
		expect(subject.checked).toBeFalse();
		expect(subject.querySelector("input[checked]")).toBeFalsy();
	});

	it("can be assigned to a group", () => {
		const groupID = "someid";

		subject.groupID = groupID;
		expect(subject.groupID).toBe(groupID);
		expect(subject.querySelector("input[name=" + groupID + "]")).toBeTruthy();
	});

	it("triggers an on change event when the button's state changes", done => {
		subject.onchange = done;

		expect(subject.onchange).toBe(done);
		(subject.querySelector("input[type=radio]") as HTMLButtonElement).click();
	});
});
