import { Array } from "src/std";

const first = function () {
	return this.length ? this[0] : null;
};

Array.prototype.first = Array.prototype.first || first;

declare global {
	interface Array<T> {
		first(): T | null;
	}
}

export default first;
