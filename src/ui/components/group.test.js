import Group from '/ui/components/group';

xdescribe("group", () => {
	it('is a custom element', () => {
		expect(Group).toBeCustomElement();
	});

	it('uses the tag name \'wf-group\'', () => {
		expect(Group.TagName).toBe('wf-group');
	});
});
