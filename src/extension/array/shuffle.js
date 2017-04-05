import "/extension";
import { rand } from "/util";

Array.prototype.shuffle = function() {
	const count = this.length;
	if (count === 0) return;

	let tempArray = Array.Repeat(-1, count);

	let idx = 0;
	for (let i = 0; i < count; i++) {
		let random = rand();
		// Message("Array::Shuffle rand 1: %x\n", random);
		idx = random % count;
		if (tempArray[idx] === -1) {
			tempArray[idx] = this[i];
			this[i] = -1;
		}
	}

	for (let i = count - 1; i !== 0; i--) {
		let did_find_free_spot = 0;
		while (true) {
			for (let i = 0; i < count; i++)
				if (tempArray[i] === -1)
					did_find_free_spot = 1;

			if (!did_find_free_spot) break;

			let random = rand();
			// Message("Array::Shuffle rand 2: %x\n", random);
			idx = random % count;
			if (tempArray[idx] === -1) {
				tempArray[idx] = this[i];
				this[i] = -1;
				break;
			}
		}
	}

	for (let i = 0; i < count; i++) {
		this[i] = tempArray[i];
	}
};
export default Array.prototype.shuffle;