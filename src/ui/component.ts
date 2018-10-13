abstract class Component extends HTMLElement {
	public static tagName: string;
	public static observedAttributes: string[];

	protected adoptedCallback(): void {}

	protected connectedCallback(): void {}

	protected disconnectedCallback(): void {}

	protected attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}
}

export default Component;
