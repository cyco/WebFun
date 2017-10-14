import { Message, rand } from "src/util";
import { DagobahGenerator, WorldGenerationError, WorldGenerator } from "src/engine/generation";
import World from "./generation/world";
import Engine from "./engine";
import { Planet, WorldSize } from "./types";

class Story {
	private _seed: number;
	private _planet: Planet;
	private _size: WorldSize;
	private _world: World;
	private _dagobah: World;
	private _reseeded: boolean;
	public goal: any;

	constructor(seed: number, planet: Planet, size: WorldSize) {
		this._seed = seed;
		this._planet = planet;
		this._size = size;

		this._world = null;
		this._dagobah = null;
		this._reseeded = false;
	}

	generateWorld(engine: Engine): void {
		let generator = null;
		let success = false;
		let effectiveSeed = this.seed;
		do {
			try {
				generator = new WorldGenerator(effectiveSeed, this.size, this.planet, engine);
				success = generator.generate(effectiveSeed);
			} catch (e) {
				if (e instanceof WorldGenerationError)
					success = false;
			} finally {
				if (!success) {
					Message("--== YodaDocument::Reseed ==--");
					this._reseeded = true;
					effectiveSeed = rand();
				}
			}
		} while (!success);

		const goalID = generator.goalPuzzleID;
		this.goal = engine.data.puzzles[goalID];

		this._setupWorld(generator, engine);
		this._setupDagobah(generator, engine);

		this._world.layDownHotspotItems();
		this._dagobah.layDownHotspotItems();

		Message(`done 0x${this.seed.toString(0x10).padStart(4, "0")}, 0x${this.planet.rawValue.toString(0x10).padStart(4, "0")}, 0x${this.size.rawValue.toString(0x10).padStart(4, "0")}`);
	}

	_setupWorld(generator: WorldGenerator, engine: Engine): void {
		this._world = generator.world;
	}

	_setupDagobah(worldGenerator: WorldGenerator, engine: Engine): void {
		Message("YodaDocument::SetupDagobah");
		const generator = new DagobahGenerator(engine);
		generator.generate(worldGenerator);
		this._dagobah = generator.world;
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

	get world() {
		return this._world;
	}

	get dagobah() {
		return this._dagobah;
	}
}

export default Story;
