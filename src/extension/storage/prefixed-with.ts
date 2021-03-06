import { PrefixedStorage } from "src/util";

const prefixedWith = function (prefix: string): PrefixedStorage {
	return new PrefixedStorage(this, prefix);
};

Storage.prototype.prefixedWith = Storage.prototype.prefixedWith || prefixedWith;

export default prefixedWith;
