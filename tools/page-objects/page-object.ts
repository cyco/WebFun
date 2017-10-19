abstract class PageObject {
	protected element: any;
	protected parent: PageObject;

	constructor(parent: PageObject) {
		this.parent = parent;
	}

	public get selector(): string {
		return "";
	};

	async click() {
		await this.element.click();
	}

	async hover() {
		await this.element.hover();
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

	async evaluate(code: Function, selector: string = null): Promise<any> {
		return this.parent.evaluate(code, this.selector + (selector ? " > " + selector : ""));
	}
}

export default PageObject;
