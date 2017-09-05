import { EventTarget } from "src/util";

export default class View extends EventTarget {
	constructor(element) {
		super();
		this._element = element || document.createElement("div");
		this._subviews = [];
		this._superview = null;
	}

	get element() {
		return this._element;
	}
}
