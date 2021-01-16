import { Array } from "src/std";

const last = function (): any {
	return this.length ? this[this.length - 1] : null;
};

Array.prototype.last = Array.prototype.last || last;

declare global {
	interface Array<T> {
		last(): T | null;
	}
}

export default last;
