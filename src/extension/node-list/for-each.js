import { NodeList } from "std.dom";

const forEach = function (callback) {
	for (let i = 0; i < this.length; i++) {
		callback.call(this, this[ i ], i, this);
	}
};

NodeList.prototype.forEach = NodeList.prototype.forEach || forEach;

export default forEach;
