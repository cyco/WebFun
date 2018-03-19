import { Array } from "src/std";

const remove = function<T>(item: T) {
	const index = this.indexOf(item);
	if (~index) {
		this.splice(index, 1);
		return true;
	}

	return false;
};

Array.prototype.remove = Array.prototype.remove || remove;

declare global {
	interface Array<T> {
		remove(element: T): boolean;
	}
}

export default remove;
