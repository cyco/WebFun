import { DagobahGenerator, WorldGenerationError, WorldGenerator } from "src/engine/generation";
import { WorldSize } from "./generation";

import AssetManager from "./asset-manager";
import { Puzzle, Zone } from "src/engine/objects";
import World from "./world";
import { rand } from "src/util";
import { Variant } from ".";

class Story {
	public goal: Puzzle;
	protected _seed: number;
	protected _planet: Zone.Planet;
	protected _size: WorldSize;
	protected _world: World = null;
	protected _dagobah: World = null;
	protected _reseeded: boolean = false;
	protected _puzzles: [Puzzle[], Puzzle[]] = [[], []];

	constructor(seed: number, planet: Zone.Planet, size: WorldSize) {
		this._seed = seed;
		this._planet = planet;
		this._size = size;
	}

	get seed(): number {
		return this._seed;
	}

	get planet(): Zone.Planet {
		return this._planet;
	}

	get size(): WorldSize {
		return this._size;
	}

	get world(): World {
		return this._world;
	}

	get dagobah(): World {
		return this._dagobah;
	}

	get puzzles(): [Puzzle[], Puzzle[]] {
		return this._puzzles;
	}

	public generateWorld(assets: AssetManager, variant: Variant, maxRetries = 1): void {
		const history: { seed: number; error: WorldGenerationError }[] = [];
		let effectiveSeed = this.seed;
		for (let i = 0; i < maxRetries; i++) {
			try {
				return this.tryGenerateWorld(effectiveSeed, assets, variant);
			} catch (error) {
				if (!(error instanceof WorldGenerationError)) throw error;
				history.push({ seed: effectiveSeed, error });
			}
			this._reseeded = true;
			effectiveSeed = rand();
		}

		const error = new WorldGenerationError("Too many reseeds");
		error.history = history;
		error.iterations = maxRetries;
		error.seed = this.seed;
		error.planet = this.planet;
		error.size = this.size;
		throw error;
	}

	private tryGenerateWorld(seed: number, assets: AssetManager, variant: Variant): void {
		const generator = new WorldGenerator(this.size, this.planet, assets, variant);
		generator.generate(seed);

		this.goal = generator.goalPuzzle;
		this._puzzles = generator.puzzles;

		this._setupWorld(generator);
		this._setupDagobah(generator, assets);
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
