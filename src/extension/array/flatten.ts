import { Array } from "src/std";

const flatten = function() {
	return Array.prototype.concat.apply([], this);
};

Array.prototype.flatten = Array.prototype.flatten || flatten;

declare global {
	interface Array<T> {
		flatten<T>(): any[];
	}
}

export default flatten;
