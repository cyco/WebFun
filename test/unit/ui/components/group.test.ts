import Group from "src/ui/components/group";
import render from "test/helpers/render";

describeComponent(Group, () => {
	let subject: Group;

	beforeEach(() => (subject = render("<wf-group></wf-group>") as Group));

	it("is a custom element", () => {
		expect(Group).toBeCustomElement();
	});

	it("uses the tag name 'wf-group'", () => {
		expect(Group.tagName).toBe("wf-group");
	});
});
