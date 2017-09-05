import sandboxed from "test-helpers/dom-sandbox";
import { default as MenuItem, Separator, State } from "src/ui/menu-item";
import Menu from "src/ui/menu";

describe("MenuItem", sandboxed((sand) => {
	it("represents an item in a menu", () => {
		let menuItem = new MenuItem();
	});

	it("can be initiated with an object specifying releveant properties", () => {
		let callbackExecuted = false;
		let properties = {
			title: "test-title",
			state: State.Mixed,
			callback: () => {
				callbackExecuted = true;
			},
			enabled: false,
			mnemonic: "M"
		};
		let menuItem = new MenuItem(properties);

		expect(menuItem.title).toBe("test-title");
		expect(menuItem.state).toBe(State.Mixed);
		expect(menuItem.enabled).toBeFalse();
		expect(menuItem.mnemonic).toBe("M");
	});

	it("defines a special item used to represent separatation between other items", () => {
		expect(Separator).not.toBe(undefined);
	});

	it("is enabled by default, if it has a callback or a submenu", () => {
		let menuItem = new MenuItem({});
		expect(menuItem.enabled).toBeFalse();

		menuItem = new MenuItem({callback: () => null});
		expect(menuItem.enabled).toBeTrue();

		menuItem = new MenuItem({submenu: []});
		expect(menuItem.enabled).toBeTrue();

		menuItem = new MenuItem();
		expect(menuItem.enabled).toBeFalse();
	});

	it("can be dynamically disabled by supplying a function", () => {
		let menuItem = new MenuItem({callback: () => null});

		expect(menuItem.enabled).toBeTrue();

		let functionCalls = 0;
		menuItem.enabled = () => {
			functionCalls++;
			return functionCalls > 1;
		};
		expect(menuItem.enabled).toBeFalse();
		expect(functionCalls).toBe(1);
		expect(menuItem.enabled).toBeTrue();
		expect(functionCalls).toBe(2);
	});

	it("has a method to easily detect if something has a submenu", () => {
		let menuItem = new MenuItem({submenu: new Menu([])});
		expect(menuItem.hasSubmenu).toBeTrue();

	});
}));
