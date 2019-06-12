import Group from "src/ui/components/group";
import render from "test/helpers/render";

describe("group", () => {
	let subject;

	beforeAll(() => customElements.define(Group.tagName, Group, Group.Options));
	beforeEach(() => (subject = render("<wf-group></wf-group>")));

	it("is a custom element", () => {
		expect(Group).toBeCustomElement();
	});

	it("uses the tag name 'wf-group'", () => {
		expect(Group.tagName).toBe("wf-group");
	});
});
