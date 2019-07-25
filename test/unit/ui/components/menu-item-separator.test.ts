import MenuItemSeparator from "src/ui/components/menu-item-separator";

describeComponent(MenuItemSeparator, () => {
	let subject: MenuItemSeparator;
	beforeEach(() => (subject = render(MenuItemSeparator) as MenuItemSeparator));

	it("shows a simple separator for use in menus", () => {
		expect(subject.querySelector("div")).not.toBeNull();
	});
});
