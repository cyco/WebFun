import { srand } from '/util';
import { WorldGenerator, DagobahGenerator } from '/engine/generation';

export default class {
	constructor(seed, planet, size) {
		this._seed = seed;
		this._planet = planet;
		this._size = size;

		this._world = null;
		this._dagobah = null;
	}

	get seed() {
		return this._seed;
	}

	get planet() {
		return this._planet;
	}

	get size() {
		return this._size;
	}

	generateWorld(engine) {
		let generator = null;
		let success = false;
		do {
			generator = new WorldGenerator(this.seed, this.planet, this.size, engine);
			success = generator.generate();
			if (!success) this.seed = srand();
		} while (!success);

		const goalID = generator.goalPuzzleID;
		this.goal = engine.data.puzzles[goalID];

		this._setupWorld(generator, engine);
		this._setupDagobah(generator, engine);
	}

	_setupWorld(generator) {
		this._world = generator.world;
	}

	_setupDagobah(wordlGenerator, engine) {
		const generator = DagobahGenerator(engine);
		generator.generate(wordlGenerator);
		this._dagobah = generator.world;
	}
}
