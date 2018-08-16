import { Array } from "src/std";

const groupedBy = function<T, R>(accessor: ((item: T) => R)): T[][] {
	return Object.values(
		this.reduce(function(result: any, x: T) {
			const key = accessor(x);
			(result[key] = result[key] || []).push(x);
			return result;
		}, {})
	);
};

Array.prototype.groupedBy = Array.prototype.groupedBy || groupedBy;

declare global {
	interface Array<T> {
		groupedBy<R>(key: ((item: T) => R)): T[][];
	}
}

export default groupedBy;
