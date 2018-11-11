import Menu from "src/ui/menu";
import MenuItem from "src/ui/menu-item";

describe("WebFun.UI.Menu", () => {
	it("is a class representing a menu", () => {
		expect(Menu).toBeClass();
	});

	it("converts all items to MenuItem instances if necessary", () => {
		const items = [new MenuItem({ title: "item 1" }), { title: "item 2" }];
		const menu = new Menu(items);

		expect(menu.items.length).toBe(2);
		expect(menu.items[0]).toBeInstanceOf(MenuItem);
		expect(menu.items[1]).toBeInstanceOf(MenuItem);
	});

	it("also allows for items to be set directly (without conversion)", () => {
		const menu = new Menu();
		const items = [new MenuItem({ title: "item 1" }), { title: "item 2" }];

		menu.items = items;
		expect(menu.items).toBe(items);
	});
});
