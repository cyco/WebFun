import { Point, EventTarget } from "/util";

export default class View extends EventTarget {
	constructor(element) {
		super();
		this._element = element || document.createElement(this.TagName);
		this._subviews = [];
		this._superview = null;
	}

	get element() {
		return this._element;
	}

	willShow() {}

	didShow() {}

	willHide() {}

	didHide() {}

	addSubview(subview) {
		if (subview instanceof View) {
			subview._superview = this;
			this._subviews.push(subview);
			this._element.appendChild(subview.element);
		} else {
			this._element.appendChild(subview);
		}
	}

	contains(e) {
		return this._element.contains(e instanceof View ? e.element : e);
	}

	get style() {
		return this.element.style;
	}

	get classList() {
		return this.element.classList;
	}

	get subviews() {
		return this._subviews;
	}

	get superview() {
		return this._superview;
	}

	get TagName() {
		return "div";
	}

	get absoluteLocation() {
		const frame = this.element.getBoundingClientRect();
		return new Point(frame.left, frame.top);
	}
}
