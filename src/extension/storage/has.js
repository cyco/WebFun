import { Storage } from "std.dom";

const has = function (key) {
	return this.getItem(key) !== null;
};

Storage.prototype.has = Storage.prototype.has || has;

export default has;
