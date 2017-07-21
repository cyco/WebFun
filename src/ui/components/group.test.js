import render from "test-helpers/render";
import Group from "./group";

describe("group", () => {
	let subject;

	beforeAll(() => customElements.define(Group.TagName, Group, Group.Options));
	beforeEach(() => subject = render('<wf-group></wf-group>'));

	it('is a custom element', () => {
		expect(Group).toBeCustomElement();
	});

	it('uses the tag name \'wf-group\'', () => {
		expect(Group.TagName).toBe('wf-group');
	});
});
