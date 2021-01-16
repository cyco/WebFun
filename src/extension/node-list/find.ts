import { Array } from "src/std";
import { NodeList } from "src/std/dom";

const find = function <TNode extends Node>(predicate: (_: TNode) => boolean): TNode {
	return Array.from(this).find(predicate) || null;
};

if (NodeList) NodeList.prototype.find = NodeList.prototype.find || find;

declare global {
	interface NodeListOf<TNode extends Node> {
		find(_: (_: TNode) => boolean): TNode;
	}
}

export default find;
