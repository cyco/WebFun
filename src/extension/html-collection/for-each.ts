import { HTMLCollection } from "src/std.dom";

const forEach = function(
	callback: (_: HTMLElement, idx: number, collection: HTMLCollection) => void
) {
	for (let i = 0; i < this.length; i++) {
		callback.call(this, this[i], i, this);
	}
};

declare global {
	interface HTMLCollectionOf<T> {
		forEach(_: (_: T, idx: number, collection: HTMLCollectionOf<T>) => boolean): void;
	}
}

HTMLCollection.prototype.forEach = HTMLCollection.prototype.forEach || forEach;

export default forEach;
