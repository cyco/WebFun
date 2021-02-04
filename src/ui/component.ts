abstract class Component extends HTMLElement {
	public static readonly tagName: string;
	public static observedAttributes: string[];

	protected adoptedCallback(): void {
		/* empty definition to ensure subclasses can safely make the super call */
	}

	protected connectedCallback(): void {
		/* empty definition to ensure subclasses can safely make the super call */
	}

	protected disconnectedCallback(): void {
		/* empty definition to ensure subclasses can safely make the super call */
	}

	protected attributeChangedCallback(
		_attributeName: string,
		_oldValue: string,
		_newValue: string
	): void {
		/* empty definition to ensure subclasses can safely make the super call */
	}
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
			table: Styleable<HTMLTableElement>;
			tr: Styleable<HTMLTableRowElement>;
			td: Styleable<HTMLTableCellElement>;
			tbody: Styleable<HTMLTableSectionElement>;
			thead: Styleable<HTMLTableSectionElement>;
			th: Styleable<HTMLTableCellElement>;
			a: Styleable<HTMLAnchorElement>;
			h1: Styleable<HTMLHeadingElement>;
			code: Styleable<HTMLSpanElement>;
		}

		interface ElementClass extends Component {}
		interface IntrinsicClassAttributes {
			[_: string]: any;
		}
	}
}

export default Component;
