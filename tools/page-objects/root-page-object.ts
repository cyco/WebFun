import PageObject from "./page-object";

class RootPageObject extends PageObject {
	protected page: PageObject;

	constructor(page: any) {
		super(null);
		this.page = page;
		this.parent = null;
		this.element = null;
	}

	async setup(): Promise<any> {
		return new Promise((r) => r(null));
	}

	async $(selector: string): Promise<any> {
		return this.page.$(selector);
	}

	async $$(selector: string): Promise<any[]> {
		return this.page.$$(selector);
	}
}

export default RootPageObject;
