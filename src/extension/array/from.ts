import { Array } from "src/std";

const From = <T>(thing: T): T[] => {
	return Array.prototype.slice.call(thing);
};

Array.from = Array.from || From;

declare global {
	interface ArrayConstructor {
		From<T>(item: ArrayLike<T>): T[];
	}
}

export default From;
