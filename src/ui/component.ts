import BabelHTMLElement from "./babel-html-element";

abstract class Component extends BabelHTMLElement {
	public static tagName: string;
	public static observedAttributes: string[];

	protected adoptedCallback(): void {}

	protected connectedCallback(): void {}

	protected disconnectedCallback(): void {}

	protected attributeChangedCallback(
		attributeName: string,
		oldValue: string,
		newValue: string
	): void {}
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
		}
		interface Element extends Component {}
		/*
			interface ElementClass { }
			interface HtmlElementInstance { }
			interface ElementAttributesProperty { __props: any; }
			interface ElementTypeProperty { __elementType: any; }
			*/
	}
}

export default Component;
