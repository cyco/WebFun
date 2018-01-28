import { Array } from "src/std";

const clear = function(): void {
	this.splice(0, this.length);
};

Array.prototype.clear = Array.prototype.clear || clear;

declare global {
	interface Array<T> {
		clear(): void;
	}
}

export default clear;
