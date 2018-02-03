import BabelHTMLElement from "./babel-html-element";

abstract class Component extends BabelHTMLElement {
	public static TagName: string;
	public static observedAttributes: string[];
	public static Options: any = undefined;

	adoptedCallback(): void { }

	connectedCallback(): void { }

	disconnectedCallback(): void { }

	attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void { }
}

declare global {
	module JSX {
		export interface IntrinsicElements {
			div: Partial<HTMLDivElement>;
		}
		interface Element extends Component { }
		/*
			interface ElementClass { }
			interface HtmlElementInstance { }
			interface ElementAttributesProperty { __props: any; }
			interface ElementTypeProperty { __elementType: any; }
			*/
	}
}

export default Component;
