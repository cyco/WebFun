abstract class PageObject {
	public get selector(): string {
		return "";
	};

	protected element: any;
	protected parent: PageObject;

	constructor(parent: PageObject) {
		this.parent = parent;
	}

	async setup(): Promise<any> {
		this.element = await this.parent.$(this.selector);
		return new Promise((r) => r(null));
	}

	async $(selector: string): Promise<any> {
		return this.parent.$(this.selector + " > " + selector);
	}

	async $$(selector: string): Promise<any[]> {
		return this.parent.$$(this.selector + " > " + selector);
	}
}

export default PageObject;
