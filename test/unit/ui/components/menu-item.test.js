import MenuItemComponent from "src/ui/components/menu-item";
import MenuItem from "src/ui/menu-item";

describeComponent(MenuItemComponent, () => {
	let subject;
	beforeEach(() => (subject = render(MenuItemComponent)));

	it("draws a menu item", () => {
		subject.item = new MenuItem({
			title: "My Item",
			mnemonic: 4
		});

		expect(subject.textContent).toEqual("My Item");
	});
});
