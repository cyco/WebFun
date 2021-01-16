import AssetManager from "src/engine/asset-manager";
import { Tile, Zone, Hotspot, Puzzle } from "src/engine/objects";
import World from "src/engine/world";
import WorldGenerator from "./world-generator";
import { Yoda } from "src/engine/type";
import { randmod } from "src/util";

enum YodaSpawn {
	NorthWest = 0,
	Hut = 1,
	SouthEast = 2,
	SouthWest = 3,
	None = 4
}

class DagobahGenerator {
	private readonly assets: AssetManager;
	private _world: World = null;

	constructor(assets: AssetManager) {
		this.assets = assets;
	}

	get world(): World {
		console.assert(this._world !== null);
		return this._world;
	}

	generate(generator: WorldGenerator): void {
		const assets = this.assets;
		const dagobah = new World(this.assets);

		dagobah.at(4, 4).zone = assets.get(Zone, Yoda.zoneIDs.DagobahNorthWest);
		dagobah.at(4, 4).zoneType = Zone.Type.Find;
		dagobah.at(5, 4).zone = assets.get(Zone, Yoda.zoneIDs.DagobahNorthEast);
		dagobah.at(5, 4).zoneType = Zone.Type.Find;
		dagobah.at(4, 5).zone = assets.get(Zone, Yoda.zoneIDs.DagobahSouthWest);
		dagobah.at(4, 5).zoneType = Zone.Type.Find;
		dagobah.at(5, 5).zone = assets.get(Zone, Yoda.zoneIDs.DagobahSouthEast);
		dagobah.at(5, 5).zoneType = Zone.Type.Town;

		//* temporarily copy zone types over from main world for easy comparison against original
		// FIXME: remove this section when comparisons are not necessary anymore
		const world = generator.world;
		dagobah.at(4, 4).zoneType = world.at(4, 4).zoneType;
		dagobah.at(5, 4).zoneType = world.at(5, 4).zoneType;
		dagobah.at(4, 5).zoneType = world.at(4, 5).zoneType;
		dagobah.at(5, 5).zoneType = world.at(5, 5).zoneType;
		//*/

		const spawn = this.determineYodaSpawnLocation(generator.goalPuzzle);
		switch (spawn) {
			case YodaSpawn.NorthWest:
			case YodaSpawn.SouthEast:
			case YodaSpawn.SouthWest:
				this.setupOutdoorSpawn(spawn, generator.initialItem, dagobah);
				break;
			case YodaSpawn.Hut:
				this._setupIndoorSpawn(dagobah, generator.initialItem, Yoda.tileIDs.Yoda);
				break;
			case YodaSpawn.None:
				this._setupIndoorSpawn(dagobah, generator.initialItem, Yoda.tileIDs.YodasSeat);
				break;
		}
		this._world = dagobah;
	}

	private determineYodaSpawnLocation = (goal: Puzzle) => {
		const spawn = randmod(4);

		if (goal === this.assets.get(Puzzle, Yoda.goalIDs.IMPERIAL_BATTLE_CODE)) {
			return YodaSpawn.SouthWest;
		}

		if (goal === this.assets.get(Puzzle, Yoda.goalIDs.RESCUE_YODA)) {
			return YodaSpawn.None;
		}

		return spawn;
	};

	private setupOutdoorSpawn(spawn: YodaSpawn, tile: Tile, dagobah: World) {
		const npcID = Yoda.tileIDs.Yoda;
		const places = [
			[4, 4],
			[-1, -1],
			[5, 5],
			[4, 5]
		];
		const [x, y] = places[spawn];
		const place = dagobah.at(x, y);
		place.zoneType = Zone.Type.Use;
		place.npc = this.assets.get(Tile, npcID);
		place.findItem = tile;

		const zone = this.assets.get(Zone, place.zone.id);
		console.assert(!!zone.npcs.find(i => i.id === npcID));
		const candidates = zone.hotspots.withType(Hotspot.Type.SpawnLocation);
		console.assert(candidates.length === 1);
		const hotspot = candidates[randmod(candidates.length)];
		if (hotspot) {
			hotspot.arg = npcID;
			hotspot.enabled = true;
		}
	}

	private _setupIndoorSpawn(dagobah: World, tile: Tile, npcID: number) {
		const zoneID = Yoda.zoneIDs.YodasHut;
		const zone = this.assets.get(Zone, zoneID);
		const place = dagobah.at(5, 4);
		place.zoneType = Zone.Type.Use;
		place.npc = this.assets.get(Tile, npcID);
		place.findItem = tile;

		let hotspotFilter: (hotspot: Hotspot) => boolean;
		if (npcID === Yoda.tileIDs.Yoda) {
			hotspotFilter = ({ x, y }: Hotspot) => x === 3 && y === 3;
		} else {
			hotspotFilter = ({ x, y }: Hotspot) => x === 3 && y === 2;
		}
		const hotspot = zone.hotspots.find(hotspotFilter);
		console.assert(!!hotspot);
		hotspot.arg = npcID;
		hotspot.enabled = true;
	}
}

export default DagobahGenerator;
