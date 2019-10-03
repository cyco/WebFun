import MenuStack from "src/ui/menu-stack";
import { document } from "../../../src/std/dom";
import { MenuWindow } from "src/ui/components";

describe("WebFun.UI.MenuStack", () => {
	let subject: MenuStack;
	let menu1: MenuWindow, menu2: MenuWindow;

	beforeEach(() => {
		menu1 = mockMenuWindow();
		menu2 = mockMenuWindow();

		subject = new MenuStack();
	});

	afterEach(() => subject.clear());

	it("is a class that manages z-order of a menu hierarchy", () => {
		expect(MenuStack).toBeClass();
	});

	it("offers a shared instance to be used by default", () => {
		expect(MenuStack.sharedStack).toBeInstanceOf(MenuStack);
		expect(MenuStack.sharedStack).toBe(MenuStack.sharedStack);
	});

	it("has a push methods to put menus on the stack (and in the document)", () => {
		subject.push(menu1);
		subject.push(menu2);

		expect(menu1.isConnected).toBeTrue();
		expect(menu1.style.zIndex).toEqual("1002");
		expect(menu2.style.zIndex).toEqual("1003");

		menu1.remove();
		menu2.remove();
	});

	it("has a clear methods remove all menus", () => {
		spyOn(menu1, "close");
		spyOn(menu2, "close");

		subject.push(menu1);
		subject.push(menu2);

		expect(menu1.isConnected).toBeTrue();
		subject.clear();

		expect(menu1.close).toHaveBeenCalled();
		expect(menu2.close).toHaveBeenCalled();

		menu1.remove();
		menu2.remove();
	});

	it("removes all menus in the stack when the overlay is clicked", () => {
		spyOn(subject, "clear").and.callThrough();

		subject.push(menu1);
		const overlay = document.body.lastElementChild.previousElementSibling;
		overlay.dispatchEvent(new CustomEvent("mousedown"));
		expect(subject.clear).toHaveBeenCalled();
	});

	it("has a pop method to remove a menu and all of its descendants", () => {
		spyOn(menu1, "close");
		spyOn(menu2, "close");
		subject.push(menu1);
		subject.push(menu2);

		expect(menu1.isConnected).toBeTrue();
		subject.pop(menu1);

		expect(menu1.close).toHaveBeenCalled();
		expect(menu2.close).toHaveBeenCalled();

		menu1.remove();
		menu2.remove();
	});

	it("ignores unregisterd menus", () => {
		expect(() => subject.pop(menu1)).not.toThrow();
	});

	it("has a property to query the stack size", () => {
		subject.push(menu1);
		subject.push(menu2);

		expect(subject.size).toBe(2);

		subject.clear();
	});

	function mockMenuWindow(): MenuWindow {
		const mockedMenuWindow: MenuWindow = document.createElement("div") as any;
		mockedMenuWindow.close = () => {};
		return mockedMenuWindow;
	}
});
