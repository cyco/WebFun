import { Message, rand } from "/util";
import { WorldGenerator, DagobahGenerator } from "/engine/generation";

export default class {
	constructor(seed, planet, size) {
		this._seed = seed;
		this._planet = planet;
		this._size = size;

		this._world = null;
		this._dagobah = null;
		this._reseeded = false;
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
		let effectiveSeed = this.seed;
		do {
			generator = new WorldGenerator(effectiveSeed, this.size, this.planet, engine);
			success = generator.generate(effectiveSeed);
			if (!success) {
				Message("--== YodaDocument::Reseed ==--");
				this._reseeded = true;
				effectiveSeed = rand();
			}
		} while (!success);

		const goalID = generator.goalPuzzleID;
		this.goal = engine.data.puzzles[goalID];

		this._setupWorld(generator, engine);
		this._setupDagobah(generator, engine);

		Message(`done 0x${this.seed.toString(0x10).padStart(4, '0')}, 0x${this.planet.toString(0x10).padStart(4, '0')}, 0x${this.size.toString(0x10).padStart(4, '0')}`);
	}

	_setupWorld(generator) {
		this._world = generator.world;
	}

	_setupDagobah(worldGenerator, engine) {
		Message("YodaDocument::SetupDagobah");
		const generator = new DagobahGenerator(engine);
		generator.generate(worldGenerator);
		this._dagobah = generator.world;
	}

	get world() {
		return this._world;
	}

	get dagobah() {
		return this._dagobah;
	}
}
