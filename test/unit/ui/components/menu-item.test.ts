import MenuItemComponent from "src/ui/components/menu-item";
import MenuItem from "src/ui/menu-item";

describeComponent(MenuItemComponent, () => {
	let subject: MenuItemComponent;
	beforeEach(() => (subject = render(MenuItemComponent) as MenuItemComponent));

	it("draws a menu item", () => {
		subject.item = new MenuItem({
			title: "My Item",
			mnemonic: 4
		});

		expect(subject.textContent).toEqual("My Item");
	});

	it("adds a badge to designate beta features", () => {
		subject.item = new MenuItem({
			title: "My Item",
			mnemonic: 4,
			beta: true
		});

		expect(subject.textContent).toContain("Beta");
	});
});
