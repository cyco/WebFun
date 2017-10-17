import { EventTarget } from "src/util";

class View extends EventTarget {
	protected _element: HTMLElement;
	protected _subviews: View[] = [];
	protected _superview: View = null;

	constructor(element?: HTMLElement) {
		super();
		this._element = element || document.createElement(this.tagName);
	}

	get element(): HTMLElement {
		return this._element;
	}

	protected get tagName() {
		return "div";
	}
}

export default View;
