import { DagobahGenerator, WorldGenerationError, WorldGenerator } from "src/engine/generation";
import { WorldSize } from "./generation";

import AssetManager, { NullIfMissing } from "./asset-manager";
import { Puzzle, Tile, Zone } from "src/engine/objects";
import World from "./world";
import { rand } from "src/util";
import { SaveState, Variant } from ".";

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
		const state = generator.generate(seed);

		this.goal = assets.get(Puzzle, state.goalPuzzle);
		this._puzzles = [
			state.puzzleIDs1.map(id => assets.get(Puzzle, id)),
			state.puzzleIDs2.map(id => assets.get(Puzzle, id))
		];

		this._setupWorld(state, assets);
		this._setupDagobah(state, assets);
	}

	private _setupWorld(state: SaveState, assets: AssetManager): void {
		const world = state.world;

		this._world = new World(assets);

		for (let i = 0; i < 100; i++) {
			const sec = world.sectors[i];
			if (sec.zone === -1) continue;

			const sector = this._world.at(i);
			sector.npc = assets.get(Tile, sec.npc, NullIfMissing);
			sector.findItem = assets.get(Tile, sec.findItem, NullIfMissing);
			sector.requiredItem = assets.get(Tile, sec.requiredItem, NullIfMissing);
			sector.zone = assets.get(Zone, sec.zone, NullIfMissing);
			sector.zoneType = sector.zone.type;
			sector.puzzleIndex = sec.puzzleIndex;
			sector.visited = false;
			sector.additionalGainItem = assets.get(Tile, sec.additionalGainItem, NullIfMissing);
			sector.additionalRequiredItem = assets.get(Tile, sec.additionalRequiredItem, NullIfMissing);
			sector.usedAlternateStrain = sec.usedAlternateStrain;
		}
	}

	private _setupDagobah(state: SaveState, assets: AssetManager): void {
		const generator = new DagobahGenerator(assets);
		const world = generator.generate(
			state,
			assets.get(Puzzle, state.goalPuzzle),
			assets.get(Puzzle, state.puzzleIDs2[0]).item1
		);

		this._dagobah = new World(assets);

		for (let i = 0; i < 100; i++) {
			const sec = world.sectors[i];
			if (sec.zone === -1) continue;

			const sector = this._dagobah.at(i);
			sector.npc = assets.get(Tile, sec.npc, NullIfMissing);
			sector.findItem = assets.get(Tile, sec.findItem, NullIfMissing);
			sector.requiredItem = assets.get(Tile, sec.requiredItem, NullIfMissing);
			sector.zone = assets.get(Zone, sec.zone, NullIfMissing);
			sector.zoneType = sector.zone.type;
			sector.puzzleIndex = sec.puzzleIndex;
			sector.visited = false;
			sector.additionalGainItem = assets.get(Tile, sec.additionalGainItem, NullIfMissing);
			sector.additionalRequiredItem = assets.get(Tile, sec.additionalRequiredItem, NullIfMissing);
			sector.usedAlternateStrain = sec.usedAlternateStrain;
		}
	}
}

export default Story;
