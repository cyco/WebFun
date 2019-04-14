import { global } from "src/std";

if (!global.HTMLElement) {
	global.HTMLElement = class {};
}

abstract class Component extends HTMLElement {
	public static readonly tagName: string;
	public static observedAttributes: string[];

	protected adoptedCallback(): void {}

	protected connectedCallback(): void {}

	protected disconnectedCallback(): void {}

	protected attributeChangedCallback(_attributeName: string, _oldValue: string, _newValue: string): void {}
}

declare global {
	namespace JSX {
		type Styleable<T extends HTMLElement> = Partial<T | { style: Partial<CSSStyleDeclaration> }>;
		export interface IntrinsicElements {
			div: Styleable<HTMLDivElement>;
			label: Styleable<HTMLLabelElement>;
			span: Styleable<HTMLSpanElement>;
			input: Styleable<HTMLInputElement>;
			canvas: Styleable<HTMLCanvasElement>;
			img: Styleable<HTMLImageElement>;
			i: Styleable<HTMLElement>;
			button: Styleable<HTMLButtonElement>;
			br: Styleable<HTMLBRElement>;
			select: Styleable<HTMLSelectElement>;
			option: Styleable<HTMLOptionElement>;
			ul: Styleable<HTMLUListElement>;
			li: Styleable<HTMLLIElement>;
			textarea: Styleable<HTMLTextAreaElement>;
		}

		interface Element extends HTMLElement {}
		interface IntrinsicClassAttributes<T> {
			[_: string]: any;
		}
	}
}

export default Component;
