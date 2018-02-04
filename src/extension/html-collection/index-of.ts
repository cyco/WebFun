import { Array } from "src/std";
import { HTMLCollection, Node } from "src/std.dom";

const indexOf = function(node: Node) {
	return Array.from(this).indexOf(node);
};

HTMLCollection.prototype.indexOf = HTMLCollection.prototype.indexOf || indexOf;

declare global {
	interface HTMLCollection {
		indexOf(_: Node): number;
	}
}

export default indexOf;
