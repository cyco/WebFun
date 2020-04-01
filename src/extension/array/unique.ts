import { Array } from "src/std";

const unique = function <T>() {
	return this.sort().filter((item: T, pos: number, ary: T[]) => !pos || item !== ary[pos - 1]);
};

Array.prototype.unique = Array.prototype.unique || unique;

declare global {
	interface Array<T> {
		unique(): T[];
	}
}

export default unique;
