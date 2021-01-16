import { Array } from "src/std";
import { HTMLCollection } from "src/std/dom";

const indexOf = function (node: Node): number {
	return Array.from(this).indexOf(node);
};

if (HTMLCollection) HTMLCollection.prototype.indexOf = HTMLCollection.prototype.indexOf || indexOf;

declare global {
	interface HTMLCollectionOf<T> {
		indexOf(_: T): number;
	}
}

export default indexOf;
