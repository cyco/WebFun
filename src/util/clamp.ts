import { min, max } from "src/std/math";

export default (lowerBound: number, value: number, upperBound: number): number => {
	if (lowerBound > upperBound) {
		return min(max(upperBound, value), lowerBound);
	} else {
		return min(max(lowerBound, value), upperBound);
	}
};
