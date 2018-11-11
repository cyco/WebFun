import { Array } from "src/std";
import { HTMLCollection, Node } from "src/std/dom";

const indexOf = function(node: Node) {
	return Array.from(this).indexOf(node);
};

if (HTMLCollection) HTMLCollection.prototype.indexOf = HTMLCollection.prototype.indexOf || indexOf;

declare global {
	interface HTMLCollectionOf<T> {
		indexOf(_: T): number;
	}
}

export default indexOf;
