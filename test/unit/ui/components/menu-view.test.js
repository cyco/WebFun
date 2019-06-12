import { Menu, MenuItemSeparator } from "src/ui";
import {
	MenuItem as MenuItemComponent,
	MenuItemSeparator as MenuItemSeparatorComponent
} from "src/ui/components";
import MenuView from "src/ui/components/menu-view";
import { or } from "test/helpers/css";

describeComponent(MenuView, () => {
	let subject;
	beforeEach(() => (subject = render(MenuView)));

	it("draws all items of a menu", () => {
		subject.menu = new Menu([{ label: "Test" }, MenuItemSeparator, { label: "Test 2" }]);
		expect(
			subject.querySelectorAll(or(MenuItemComponent.tagName, MenuItemSeparatorComponent.tagName)).length
		).toBe(3);

		subject.menu = null;
		expect(
			subject.querySelectorAll(or(MenuItemComponent.tagName, MenuItemSeparatorComponent.tagName)).length
		).toBe(0);
	});

	it("redraws if the menu changes", () => {
		subject.menu = new Menu([
			{ label: "Test" },
			{ label: "Test 2" },
			{ label: "Test 3" },
			{ label: "Test 4" }
		]);
		expect(subject.querySelectorAll(MenuItemComponent.tagName).length).toBe(4);
	});

	it("can be closed, removing it from the dom", () => {
		subject.menu = new Menu([{ label: "Test" }]);
		document.body.appendChild(subject);
		subject.close();
		expect(subject.isConnected).toBeFalse();
	});

	it("executes a callback when closed", done => {
		subject.menu = new Menu([{ label: "Test" }]);
		subject.onclose = () => {
			expect(true).toBeTrue();
			done();
		};
		subject.close();
	});
});
