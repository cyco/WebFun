import { min, max } from "src/std/math";

export default (lowerBound: number, value: number, upperBound: number) =>
	min(max(lowerBound, value), upperBound);
