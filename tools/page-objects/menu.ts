import PageObject from "./page-object";
import MenuItem from "./menu-item";

class Menu extends PageObject {
	items: MenuItem[];

	public get selector() {
		return "wf-menu-window";
	}

	async setup() {
		await super.setup();
		this.items = await MenuItem.ItemsInMenu(this);
		for (const menuItem of this.items) {
			await menuItem.setup();
		}
	}

	itemWithTitle(title: string) {
		return this.items.find((itm) => itm.title === title);
	}
}

export default Menu;
