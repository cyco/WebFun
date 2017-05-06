import { HTMLElement } from '/std.dom';

function BabelHTMLElement() {
	const newTarget = this.__proto__.constructor;
	return Reflect.construct(HTMLElement, [], newTarget);
}
Object.setPrototypeOf(BabelHTMLElement, HTMLElement);
Object.setPrototypeOf(BabelHTMLElement.prototype, HTMLElement.prototype);



export default class extends BabelHTMLElement {
	static get TagName() {
		console.assert(false, 'Components must define a tag name');
	}

	static get Options() {
		return undefined;
	}
	adoptedCallback() {}
	connectedCallback() {}
	attributeChangedCallback(attributeName, oldValue, newValue) {}
}

export const makeBabelClass = (baseClass) => {
	function BabelHTMLElement() {
		const newTarget = this.__proto__.constructor;
		return Reflect.construct(HTMLElement, [], newTarget);
	}
	Object.setPrototypeOf(BabelHTMLElement, baseClass);
	Object.setPrototypeOf(BabelHTMLElement.prototype, baseClass.prototype);
	return BabelHTMLElement;
};

export const makeComponent = (baseClass = HTMLElement) => class extends makeBabelClass(baseClass) {
	static get TagName() {
		console.assert(false, 'Components must define a tag name');
	}

	static get Options() {
		return undefined;
	}
	adoptedCallback() {}
	connectedCallback() {}
	attributeChangedCallback(attributeName, oldValue, newValue) {}
};
