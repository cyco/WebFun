import PageObject from "./page-object";

class MenuItem extends PageObject {
	public title: string;
	public mnemonic: string;
	public state: string;
	public enabled: boolean;
	public isSeparator: boolean = false;
	private _index: number = null;

	public get selector() {
		let selector = "wf-menu-item,wf-menu-item-separator";

		if (this._index !== null) {
			selector += `:nth-child(${this._index + 1})`;
		}
		return selector;
	}

	static async ItemsInMenu(menu: PageObject) {
		const items = await menu.$$("wf-menu-item");
		return items.map((handle, index) => {
			const item = new MenuItem(menu);
			item._index = index;
			item.element = handle;
			return item;
		});
	}

	async setup() {
		this.title = await this.evaluate((el: any): void => el.textContent);
		try {
			this.mnemonic = await this.evaluate((el: any): void => el.textContent, "span.mnemonic");
			this.state = await this.evaluate((el: any): void => el.textContent, "span.state");
			this.enabled = await this.evaluate((el: any): void => el.classList.contains("enabled"));
		} catch (e) {
			this.isSeparator = true;
		}
	}
}

export default MenuItem;
