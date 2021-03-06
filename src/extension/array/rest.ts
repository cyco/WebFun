import { Array } from "src/std";

const rest = function <T>(): T[] {
	return this.slice(1);
};

Array.prototype.rest = Array.prototype.rest || rest;

declare global {
	interface Array<T> {
		rest(): T[];
	}
}

export default rest;
