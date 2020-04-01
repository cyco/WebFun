import { Storage } from "src/std/dom";

const has = function (key: string): boolean {
	return this.getItem(key) !== null;
};

Storage.prototype.has = Storage.prototype.has || has;

export default has;
