import { rand } from "./random";

export default class Range {
	constructor(min, max) {
		this.min = min;
		this.max = max;

		Object.seal(this);
	}

	randomElement() {
		return this.min + rand() % (this.max - this.min + 1);
	}
}

window.Range = Range;