import { Array } from "src/std";
import { NodeList, Node } from "src/std.dom";

const indexOf = function(node: Node) {
	return Array.from(this).indexOf(node);
};

NodeList.prototype.indexOf = NodeList.prototype.indexOf || indexOf;

declare global {
	interface NodeList {
		indexOf(_: Node): number;
	}
}

export default indexOf;
