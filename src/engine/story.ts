import { DagobahGenerator, WorldGenerationError, WorldGenerator } from "src/engine/generation";
import { rand } from "src/util";
import Engine from "./engine";
import World from "./generation/world";
import { Planet, WorldSize } from "./types";
import Puzzle from "src/engine/objects/puzzle";

class Story {
	public goal: Puzzle;
	protected _seed: number;
	protected _planet: Planet;
	protected _size: WorldSize;
	protected _world: World;
	protected _dagobah: World;
	protected _reseeded: boolean;

	constructor(seed: number, planet: Planet, size: WorldSize) {
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

	get world() {
		return this._world;
	}

	get dagobah() {
		return this._dagobah;
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
				if (e instanceof WorldGenerationError) success = false;
			} finally {
				if (!success) {
					this._reseeded = true;
					effectiveSeed = rand();
				}
			}
		} while (!success);

		this.goal = generator.goalPuzzle;

		this._setupWorld(generator, engine);
		this._setupDagobah(generator, engine);

		this._world.layDownHotspotItems();
		this._dagobah.layDownHotspotItems();
	}

	_setupWorld(generator: WorldGenerator, _: Engine): void {
		this._world = generator.world;
	}

	_setupDagobah(worldGenerator: WorldGenerator, engine: Engine): void {
		const generator = new DagobahGenerator(engine);
		generator.generate(worldGenerator);
		this._dagobah = generator.world;
	}
}

export default Story;
