import { HTMLCollection } from "src/std/dom";

const find = function (cb: (_: Element) => boolean) {
	for (let i = 0, len = this.length; i < len; i++) {
		if (cb(this[i])) return this[i];
	}
	return null;
};

declare global {
	interface HTMLCollectionOf<T> {
		find(_: (_: T) => boolean): T;
	}
}

if (HTMLCollection) HTMLCollection.prototype.find = HTMLCollection.prototype.find || find;

export default find;
