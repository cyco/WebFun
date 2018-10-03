import { NodeList } from "src/std/dom";

const forEach = function(callback: (_: Node, idx: number, list: NodeList) => void): void {
	for (let i = 0; i < this.length; i++) {
		callback.call(this, this[i], i, this);
	}
};

NodeList.prototype.forEach = NodeList.prototype.forEach || forEach;

export default forEach;
