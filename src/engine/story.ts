import { DagobahGenerator, WorldGenerationError, WorldGenerator } from "src/engine/generation";
import { WorldSize } from "./generation";

import AssetManager, { NullIfMissing } from "./asset-manager";
import { Puzzle, Tile, Zone } from "src/engine/objects";
import World from "./world";
import { Point, rand } from "src/util";
import { SaveState, Variant } from ".";

class Story {
	public goal: Puzzle;
	public seed: number;
	public planet: Zone.Planet;
	public size: WorldSize;
	public world: World = null;
	public dagobah: World = null;
	public reseeded: boolean = false;
	public puzzles: [Puzzle[], Puzzle[]] = [[], []];
	public complexity: number;

	private _state: SaveState = null;

	constructor(protected readonly assets: AssetManager, protected readonly variant: Variant) {}

	public generate(seed: number, planet: Zone.Planet, size: WorldSize, maxTries = 1): void {
		this.seed = seed;
		this.planet = planet;
		this.size = size;

		const history: { seed: number; error: WorldGenerationError }[] = [];
		let effectiveSeed = this.seed;
		for (let i = 0; i < maxTries; i++) {
			try {
				this._state = this.tryGenerateWorld(effectiveSeed, this.assets, this.variant);

				return;
			} catch (error) {
				if (!(error instanceof WorldGenerationError)) throw error;
				history.push({ seed: effectiveSeed, error });
			}
			this.reseeded = true;
			effectiveSeed = rand();
		}

		const error = new WorldGenerationError("Too many reseeds");
		error.history = history;
		error.iterations = maxTries;
		error.seed = this.seed;
		error.planet = this.planet;
		error.size = this.size;
		throw error;
	}

	private tryGenerateWorld(seed: number, assets: AssetManager, variant: Variant): SaveState {
		const state = new SaveState();
		state.seed = seed;
		state.planet = this.planet;
		state.size = this.size;
		state.onDagobah = true;
		state.positionOnWorld = new Point(4, 5);
		state.positionOnZone = new Point(10, 10);
		state.currentZoneID = -1;
		state.currentWeapon = -1;
		state.currentAmmo = -1;
		state.damageTaken = 1;
		state.livesLost = 1;
		state.difficulty = 50;

		const generator = new WorldGenerator(assets, variant);
		generator.generate(state);

		this.goal = assets.get(Puzzle, state.goalPuzzle);
		this.puzzles = [
			state.puzzleIDs1.map(id => assets.get(Puzzle, id)),
			state.puzzleIDs2.map(id => assets.get(Puzzle, id))
		];

		this._setupWorld(state, assets);
		this._setupDagobah(state, assets);

		return state;
	}

	private _setupWorld(state: SaveState, assets: AssetManager): void {
		const world = state.world;

		this.world = new World(assets);

		for (let i = 0; i < 100; i++) {
			const sec = world.sectors[i];
			if (!sec) continue;
			if (sec.zone === -1) continue;

			const sector = this.world.at(i);
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

		state.dagobah = world;

		this.dagobah = new World(assets);

		for (let i = 0; i < 100; i++) {
			const sec = world.sectors[i];
			if (!sec) continue;
			if (sec.zone === -1) continue;

			const sector = this.dagobah.at(i);
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

	public get state(): SaveState {
		return this._state;
	}
}

export default Story;
