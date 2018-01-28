function BabelHTMLElement() {
	const newTarget = this.__proto__.constructor;
	return Reflect.construct(HTMLElement, [], newTarget);
}

Object.setPrototypeOf(BabelHTMLElement, HTMLElement);
Object.setPrototypeOf(BabelHTMLElement.prototype, HTMLElement.prototype);

declare interface CustomHTMLElement extends HTMLElement {
	prototype: HTMLElement;

	new (): HTMLElement;
}

export default <CustomHTMLElement>(<any>BabelHTMLElement);
