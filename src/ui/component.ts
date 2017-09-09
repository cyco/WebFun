import BabelHTMLElement from "./babel-html-element";

class Component extends BabelHTMLElement {
	public static TagName: string;

	static get Options(): any {
		return undefined;
	}

	adoptedCallback(): void {
	}

	connectedCallback(): void {
	}

	disconnectedCallback(): void {
	}

	attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
	}
}

export default Component;
