import Menubar from "src/ui/components/menubar";
import { MenuItem as MenuItemComponent, MenuItemSeparator as MenuItemSeparatorComponent } from "src/ui/components";
import { Menu, MenuItemSeparator } from "src/ui";
import { or } from "test-helpers/css";

describeComponent(Menubar, () => {
	let subject;
	beforeEach(() => {
		subject = render(Menubar);
		subject.menu = new Menu([
			{label: "Test"},
			MenuItemSeparator,
			{label: "Test 2"}
		]);
	});

	it("is a menu view that's attached to the top of a window", () => {
		expect(subject.querySelectorAll(or(MenuItemComponent.TagName, MenuItemSeparatorComponent.TagName)).length).toBe(3);

		subject.menu = null;
		expect(subject.querySelectorAll(or(MenuItemComponent.TagName, MenuItemSeparatorComponent.TagName)).length).toBe(0);
	});

	it("tracks mouse presses and does nothing if no menu item was hit", () => {
		const event = new MouseEvent("mousedown", {pageX: -1, pageY: -1});
		expect(() => subject.dispatchEvent(event)).not.toThrow();
	});

	it("does nothing if the mouse is pressed on an item without callback or title", () => {
		const item = subject.querySelector(MenuItemComponent.TagName);
		const box = item.getBoundingClientRect();
		const event = new MouseEvent("mousedown", {clientX: box.left, clientY: box.top});
		expect(() => subject.dispatchEvent(event)).not.toThrow();
	});

	it("executes a clicked item\'s callback", (done) => {
		subject.menu.items[0].callback = () => done();
		const item = subject.querySelector(MenuItemComponent.TagName);
		const box = item.getBoundingClientRect();
		const event = new MouseEvent("mousedown", {clientX: box.left, clientY: box.top});
		subject.dispatchEvent(event);
	});

	it("starts a modal session and layers submenus on top of it", () => {
	});
});
