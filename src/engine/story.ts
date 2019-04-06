import { DagobahGenerator, WorldGenerationError, WorldGenerator } from "src/engine/generation";
import { Planet, WorldSize } from "./types";

import Engine from "./engine";
import Puzzle from "src/engine/objects/puzzle";
import World from "./generation/world";
import { rand } from "src/util";

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

	public generateWorld(engine: Engine): void {
		let generator = null;
		let success = false;
		let effectiveSeed = this.seed;
		let maxCount = 50;
		do {
			maxCount--;
			if (maxCount === 0) {
				console.warn("too many reseeds");
				return;
			}
			try {
				generator = new WorldGenerator(this.size, this.planet, engine);
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

	private _setupWorld(generator: WorldGenerator, _: Engine): void {
		this._world = generator.world;
	}

	private _setupDagobah(worldGenerator: WorldGenerator, engine: Engine): void {
		const generator = new DagobahGenerator(engine);
		generator.generate(worldGenerator);
		this._dagobah = generator.world;
	}
}

export default Story;
