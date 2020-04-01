import { Array } from "src/std";
import { floor, random } from "src/std/math";

const randomElement = function () {
	return this[floor(random() * this.length)];
};

Array.prototype.random = Array.prototype.random || randomElement;

declare global {
	interface Array<T> {
		random(): T;
	}
}

export default random;
