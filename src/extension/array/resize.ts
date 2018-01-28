import { Array } from "src/std";

const resize = function<T>(targetSize: number, element: T) {
	this.splice(0, this.length);
	for (let i = 0; i < targetSize; i++) {
		this.push(element);
	}
};

Array.prototype.resize = Array.prototype.resize || resize;

declare global {
	interface Array<T> {
		resize(length: number, element: T): void;
	}
}

export default resize;
