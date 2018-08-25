import { rand } from "./random";

class Range {
	public min: number;
	public max: number;

	constructor(min: number, max: number) {
		this.min = min;
		this.max = max;
	}

	randomElement(): number {
		return this.min + (rand() % (this.max - this.min + 1));
	}
}

export default Range;
