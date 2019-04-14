import { NodeList } from "src/std/dom";

const map = function<T>(callback: (node: Node, idx: number, list: NodeList) => T): T[] {
	const results = [];
	for (let i = 0; i < this.length; i++) {
		results.push(callback.call(this, this[i], i, this));
	}
	return results;
};

if (NodeList) NodeList.prototype.map = NodeList.prototype.map || map;

export default map;
