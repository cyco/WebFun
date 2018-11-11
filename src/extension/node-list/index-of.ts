import { Array } from "src/std";
import { NodeList } from "src/std/dom";

const indexOf = function(node: Node) {
	return Array.from(this).indexOf(node);
};

if (NodeList) NodeList.prototype.indexOf = NodeList.prototype.indexOf || indexOf;

declare global {
	interface NodeListOf<TNode extends Node> {
		indexOf(_: TNode): number;
	}
}

export default indexOf;
