import "src/extension";

import { Array } from "src/std";
import { rand } from "src/util";

const shuffle = function() {
	const count = this.length;
	if (count === 0) return this;
	if (count === 1) {
		rand();
		return this;
	}

	let tempArray = new Array(count);

	let idx = 0;
	for (let i = 0; i < count; i++) {
		idx = rand() % count;
		if (tempArray[idx] === undefined) {
			tempArray[idx] = this[i];
			this[i] = undefined;
		}
	}

	for (let i = count - 1; i !== 0; i--) {
		while (true) {
			let didFindFreeSpot = false;
			for (let j = 0; !didFindFreeSpot && j < count; j++) didFindFreeSpot = tempArray[j] === undefined;
			if (!didFindFreeSpot) break;

			idx = rand() % count;
			if (tempArray[idx] === undefined) {
				tempArray[idx] = this[i];
				this[i] = undefined;
				break;
			}
		}
	}

	for (let i = 0; i < count; i++) {
		this[i] = tempArray[i];
	}

	return this;
};

Array.prototype.shuffle = Array.prototype.shuffle || shuffle;

declare global {
	interface Array<T> {
		shuffle(): this;
	}
}

export default shuffle;
