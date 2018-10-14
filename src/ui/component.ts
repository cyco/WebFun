abstract class Component extends HTMLElement {
	public static readonly tagName: string;
	public static observedAttributes: string[];

	protected adoptedCallback(): void {}

	protected connectedCallback(): void {}

	protected disconnectedCallback(): void {}

	protected attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {}
}

declare global {
	namespace JSX {
		export interface IntrinsicElements {
			div: Partial<HTMLDivElement>;
			label: Partial<HTMLLabelElement>;
			span: Partial<HTMLSpanElement>;
			input: Partial<HTMLInputElement>;
			canvas: Partial<HTMLCanvasElement>;
			img: Partial<HTMLImageElement>;
			i: Partial<HTMLElement>;
			button: Partial<HTMLButtonElement>;
			br: Partial<HTMLBRElement>;
			select: Partial<HTMLSelectElement>;
			option: Partial<HTMLOptionElement>;
			ul: Partial<HTMLUListElement>;
			li: Partial<HTMLLIElement>;
		}

		interface Element extends HTMLElement {}
		interface IntrinsicClassAttributes<T> {
			[_: string]: any;
		}
		/*
	interface HtmlElementInstance { }
	interface ElementAttributesProperty { __props: any; }
	interface ElementTypeProperty { __elementType: any; }
	*/
	}
}

export default Component;
