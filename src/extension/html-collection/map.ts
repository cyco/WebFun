import { HTMLCollection } from "src/std.dom";

const map = function<T extends Element, U>(
	cb: (_: T, idx: number, collection: HTMLCollectionOf<T>) => U
) {
	let result = [];
	for (let i = 0, len = this.length; i < len; i++) {
		result.push(cb(this[i], i, this));
	}
	return result;
};

declare global {
	interface HTMLCollectionOf<T> {
		map<U>(_: (_: T, idx: number, collection: HTMLCollectionOf<T>) => U): U[];
	}
}

HTMLCollection.prototype.map = HTMLCollection.prototype.map || map;

export default map;
