import { min } from "src/std/math";

export enum DifferenceType {
	Added,
	Updated,
	Deleted
}

export type Difference = { key: any[]; type: DifferenceType };
export type Differences = Difference[];

export function diffArray(a: any[], b: any[], depth: number = Infinity): Differences {
	let differences: Differences = [];

	let i: number, j: number;
	const len = min(a.length, b.length);

	for (i = 0; i < len; i++) {
		differences = differences.concat(
			diff(a[i], b[i], depth - 1).map(({ key, type }) => ({
				key: [i, ...key],
				type
			}))
		);
	}

	for (j = i; j < a.length; j++) {
		differences.push({ key: [i], type: DifferenceType.Deleted });
	}

	for (j = i; j < b.length; j++) {
		differences.push({ key: [i], type: DifferenceType.Added });
	}

	return differences;
}

export function diffObject(a: any, b: any, depth: number = Infinity): Differences {
	let differences: Differences = [];
	const keys = new Set<string>();

	for (const k of Object.keys(a)) {
		keys.add(k);

		if (k in b) {
			differences = differences.concat(
				diff(a[k], b[k], depth - 1).map(({ key, type }) => ({
					key: [k, ...key],
					type
				}))
			);
		} else {
			differences.push({ key: [k], type: DifferenceType.Deleted });
		}
	}

	for (const k of Object.keys(b)) {
		if (keys.has(k)) continue;

		differences.push({ key: [k], type: DifferenceType.Added });
	}

	return differences;
}

export function diffMap(a: Map<any, any>, b: Map<any, any>, depth: number = Infinity): Differences {
	let differences: Differences = [];
	const keys = new Set<string>();

	for (const k of a.keys()) {
		keys.add(k);

		if (b.has(k)) {
			differences = differences.concat(
				diff(a.get(k), b.get(k), depth - 1).map(({ key, type }) => ({
					key: [k, ...key],
					type
				}))
			);
		} else {
			differences.push({ key: [k], type: DifferenceType.Deleted });
		}
	}

	for (const k of b.keys()) {
		if (keys.has(k)) continue;

		differences.push({ key: [k], type: DifferenceType.Added });
	}

	return differences;
}

export default function diff(a: any, b: any, depth: number = Infinity): Differences {
	if (depth < 0) return [];
	if (a === b) return [];

	if (a === null && b === null) return [];
	if (a === null || b === null) return [{ key: [], type: DifferenceType.Updated }];

	if (typeof a === "number" || typeof b === "number") {
		if (isNaN(a) && isNaN(a)) return [];
		if (isNaN(a) || isNaN(a)) return [{ key: [], type: DifferenceType.Updated }];
	}

	if (a instanceof Map && b instanceof Map) {
		return diffMap(a, b, depth);
	}

	if (a instanceof Array && b instanceof Array) {
		return diffArray(a, b, depth);
	}

	if (typeof a === "object" && typeof b === "object") {
		return diffObject(a, b);
	}

	return [{ key: [], type: DifferenceType.Updated }];
}
