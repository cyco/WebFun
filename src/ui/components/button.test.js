import Button from "./button";

describeComponent(Button, () => {
	let subject;
	beforeEach(() => subject = render(Button));

	it('displays a button that can be clicked', () => {
		expect(subject.tagName.toLowerCase()).toBe('wf-button');
	});
});
