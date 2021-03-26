import { Story } from "src/engine";
import { Puzzle } from "src/engine/objects";
import World from "src/engine/world";

class MutableStory extends Story {
	set world(w: World) {
		this._world = w;
	}

	get world(): World {
		return this._world;
	}

	set dagobah(d: World) {
		this._dagobah = d;
	}

	get dagobah(): World {
		return this._dagobah;
	}

	set puzzles(p: [Puzzle[], Puzzle[]]) {
		this._puzzles = p;
	}

	get puzzles(): [Puzzle[], Puzzle[]] {
		return this._puzzles;
	}
}

export default MutableStory;
