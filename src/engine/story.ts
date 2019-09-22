import { DagobahGenerator, WorldGenerationError, WorldGenerator } from "src/engine/generation";
import { Planet, WorldSize } from "./types";

import AssetManager from "./asset-manager";
import { Puzzle } from "src/engine/objects";
import World from "./world";
import { rand } from "src/util";

class Story {
	public goal: Puzzle;
	protected _seed: number;
	protected _planet: Planet;
	protected _size: WorldSize;
	protected _world: World = null;
	protected _dagobah: World = null;
	protected _reseeded: boolean = false;
	protected _puzzles: [Puzzle[], Puzzle[]] = [[], []];

	constructor(seed: number, planet: Planet, size: WorldSize) {
		this._seed = seed;
		this._planet = planet;
		this._size = size;
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

	get puzzles() {
		return this._puzzles;
	}

	public generateWorld(assetManager: AssetManager, gamesWon: number = 0): void {
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
				generator = new WorldGenerator(this.size, this.planet, assetManager);
				success = generator.generate(effectiveSeed, gamesWon);
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
		this._puzzles = generator.puzzles;

		this._setupWorld(generator);
		this._setupDagobah(generator, assetManager);
	}

	private _setupWorld(generator: WorldGenerator): void {
		this._world = generator.world;
	}

	private _setupDagobah(worldGenerator: WorldGenerator, assets: AssetManager): void {
		const generator = new DagobahGenerator(assets);
		generator.generate(worldGenerator);
		this._dagobah = generator.world;
	}
}

export default Story;
