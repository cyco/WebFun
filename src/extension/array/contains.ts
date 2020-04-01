import { Array } from "src/std";

const contains = function <T>(candidate: T): boolean {
	return !!~this.indexOf(candidate);
};

Array.prototype.contains = Array.prototype.contains || contains;

export default contains;
