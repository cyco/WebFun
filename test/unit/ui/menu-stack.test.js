import MenuStack from "src/ui/menu-stack";
import { document } from "../../../src/std/dom";

describe("WebFun.UI.MenuStack", () => {
	it("is a class that manages z-order of a menu hierarchy", () => {
		expect(MenuStack).toBeClass();
	});

	it("offers a shared instance to be used by default", () => {
		expect(MenuStack.sharedStack).toBeInstanceOf(MenuStack);
		expect(MenuStack.sharedStack).toBe(MenuStack.sharedStack);
	});

	it("has a push methods to put menus on the stack (and in the document)", () => {
		const menu1 = mockMenuWindow();
		const menu2 = mockMenuWindow();

		const subject = new MenuStack();
		subject.push(menu1);
		subject.push(menu2);

		expect(menu1.isConnected).toBeTrue();
		expect(menu1.style.zIndex).toEqual("1002");
		expect(menu2.style.zIndex).toEqual("1003");

		menu1.remove();
		menu2.remove();
	});

	it("has a clear methods remove all menus", () => {
		const menu1 = mockMenuWindow();
		spyOn(menu1, "close");
		const menu2 = mockMenuWindow();
		spyOn(menu2, "close");

		const subject = new MenuStack();
		subject.push(menu1);
		subject.push(menu2);

		expect(menu1.isConnected).toBeTrue();
		subject.clear();

		expect(menu1.close).toHaveBeenCalled();
		expect(menu2.close).toHaveBeenCalled();

		menu1.remove();
		menu2.remove();
	});

	it("has a pop method to remove a menu and all of its descendants", () => {
		const menu1 = mockMenuWindow();
		spyOn(menu1, "close");
		const menu2 = mockMenuWindow();
		spyOn(menu2, "close");

		const subject = new MenuStack();
		subject.push(menu1);
		subject.push(menu2);

		expect(menu1.isConnected).toBeTrue();
		subject.pop(menu1);

		expect(menu1.close).toHaveBeenCalled();
		expect(menu2.close).toHaveBeenCalled();

		menu1.remove();
		menu2.remove();
	});

	it("has a property to query the stack size", () => {
		const menu1 = mockMenuWindow();
		const menu2 = mockMenuWindow();

		const subject = new MenuStack();

		subject.push(menu1);
		subject.push(menu2);

		expect(subject.size).toBe(2);

		subject.clear();
	});

	function mockMenuWindow() {
		const mockedMenuWindow = document.createElement("div");
		mockedMenuWindow.close = () => {};
		return mockedMenuWindow;
	}
});
