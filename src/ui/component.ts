import BabelHTMLElement from "./babel-html-element";

abstract class Component extends BabelHTMLElement {
	public static TagName: string;
	public static observedAttributes: string[];
	public static Options: any = undefined;

	adoptedCallback(): void {}

	connectedCallback(): void {}

	disconnectedCallback(): void {}

	attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}
}

export default Component;
