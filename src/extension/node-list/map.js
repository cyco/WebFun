import { NodeList } from 'std.dom';

const map = function(callback) {
	let results = [];
	for (let i = 0; i < this.length; i++) {
		results.push(callback.call(this, this[i], i, this));
	}
	return results;
};

NodeList.prototype.map = NodeList.prototype.map || map;

export default map;
