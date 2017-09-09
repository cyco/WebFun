import PageObject from "./page-object";

class RootPageObject extends PageObject {
	protected page: any;

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

	async evaluate(code: Function, selector:string = ""): Promise<any> {
		return this.page.$eval(selector, code);
	}
}

export default RootPageObject;
