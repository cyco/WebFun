import MenuItemSeparator from "src/ui/components/menu-item-separator";

describeComponent(MenuItemSeparator, () => {
	let subject;
	beforeEach(() => (subject = render(MenuItemSeparator)));

	it("shows a simple separator for use in menus", () => {
		expect(subject.querySelector("div")).not.toBeNull();
	});
});
