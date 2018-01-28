import { HTMLCollection } from "std.dom";

const find = function(cb) {
	for (let i = 0, len = this.length; i < len; i++) {
		if (cb(this[i])) return this[i];
	}
	return null;
};

HTMLCollection.prototype.find = HTMLCollection.prototype.find || find;

export default find;
