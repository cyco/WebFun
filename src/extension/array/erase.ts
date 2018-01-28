import { Array } from "src/std";

const erase = function<T>(pos: T) {
	this.splice(pos, 1);
};

Array.prototype.erase = Array.prototype.erase || erase;

declare global {
	interface Array<T> {
		erase(pos: number): void;
	}
}

export default erase;
