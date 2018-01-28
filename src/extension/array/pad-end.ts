import { Array } from "src/std";

const padEnd = function<T>(length: number, item: T): T[] {
	const result = this.slice();
	while (result.length < length) result.push(item);
	return result;
};

Array.prototype.padEnd = Array.prototype.padEnd || padEnd;

declare global {
	interface Array<T> {
		padEnd(length: number, item: T): T[];
	}
}

export default padEnd;
