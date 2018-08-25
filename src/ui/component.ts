import BabelHTMLElement from "./babel-html-element";

abstract class Component extends BabelHTMLElement {
	public static tagName: string;
	public static observedAttributes: string[];

	protected adoptedCallback(): void {}

	protected connectedCallback(): void {}

	protected disconnectedCallback(): void {}

	protected attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}
}

export default Component;
