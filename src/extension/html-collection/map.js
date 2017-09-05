import { HTMLCollection } from "std.dom";

const map = function (cb) {
	let result = [];
	for (let i = 0, len = this.length; i < len; i++) {
		result.push(cb(this[ i ]));
	}
	return result;
};

HTMLCollection.prototype.map = HTMLCollection.prototype.map || map;

export default map;
