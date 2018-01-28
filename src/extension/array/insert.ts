import { Array } from "src/std";

const insert = function<T>(pos: number, item: T) {
	this.splice(pos, 0, item);
};

Array.prototype.insert = Array.prototype.insert || insert;

declare global {
	interface Array<T> {
		insert(pos: number, item: T): void;
	}
}

export default insert;
