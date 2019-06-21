import AssetManager from "src/engine/asset-manager";
import { Tile, Zone, Hotspot, Puzzle } from "src/engine/objects";
import World from "./world";
import WorldGenerator from "./world-generator";
import Yoda from "src/engine/yoda";
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

	get world() {
		console.assert(this._world !== null);
		return this._world;
	}

	generate(generator: WorldGenerator): void {
		const assets = this.assets;
		const dagobah = new World();
		dagobah.zones = assets.getAll(Zone);

		dagobah.setZone(4, 4, assets.get(Zone, Yoda.Zone.DagobahNorthWest));
		dagobah.at(4, 4).zoneType = Zone.Type.Find;
		dagobah.setZone(5, 4, assets.get(Zone, Yoda.Zone.DagobahNorthEast));
		dagobah.at(5, 4).zoneType = Zone.Type.Find;
		dagobah.setZone(4, 5, assets.get(Zone, Yoda.Zone.DagobahSouthWest));
		dagobah.at(4, 5).zoneType = Zone.Type.Find;
		dagobah.setZone(5, 5, assets.get(Zone, Yoda.Zone.DagobahSouthEast));
		dagobah.at(5, 5).zoneType = Zone.Type.Town;

		//* temporarily copy zone types over from main world for easy comparison against original
		// FIXME: remove this section when comparisons are not necessary anymore
		const world = generator.world;
		dagobah.at(4, 4).zoneType = world.at(4, 4).zoneType;
		dagobah.at(5, 4).zoneType = world.at(5, 4).zoneType;
		dagobah.at(4, 5).zoneType = world.at(4, 5).zoneType;
		dagobah.at(5, 5).zoneType = world.at(5, 5).zoneType;
		//*/

		const spawn = this.determineYodasSpawnLocation(generator.goalPuzzle);
		switch (spawn) {
			case YodaSpawn.NorthWest:
			case YodaSpawn.SouthEast:
			case YodaSpawn.SouthWest:
				this.setupOutdoorSpawn(spawn, generator.initialItem, dagobah);
				break;
			case YodaSpawn.Hut:
				this._setupIndoorSpawn(dagobah, generator.initialItem, Yoda.Tile.Yoda);
				break;
			case YodaSpawn.None:
				this._setupIndoorSpawn(dagobah, generator.initialItem, Yoda.Tile.YodasSeat);
				break;
		}
		this._world = dagobah;
	}

	private determineYodasSpawnLocation(goal: Puzzle) {
		const spawn = randmod(4);

		if (goal === this.assets.get(Puzzle, Yoda.Goal.ImperialBattleCode)) {
			return YodaSpawn.SouthWest;
		}

		if (goal === this.assets.get(Puzzle, Yoda.Goal.RescueYoda)) {
			return YodaSpawn.None;
		}

		return spawn;
	}

	private setupOutdoorSpawn(spawn: YodaSpawn, tile: Tile, dagobah: World) {
		const npcID = Yoda.Tile.Yoda;
		const places = [[4, 4], , [5, 5], [4, 5]];
		const [x, y] = places[spawn];
		const place = dagobah.at(x, y);
		place.zoneType = Zone.Type.Use;
		place.npc = this.assets.get(Tile, npcID);
		place.findItem = tile;

		const zone = this.assets.get(Zone, place.zone.id);
		console.assert(!!zone.puzzleNPCs.find(i => i.id === npcID));
		const candidates = zone.hotspots.withType(Hotspot.Type.SpawnLocation);
		console.assert(candidates.length === 1);
		const hotspot = candidates[randmod(candidates.length)];
		hotspot.arg = npcID;
		hotspot.enabled = true;
	}

	private _setupIndoorSpawn(dagobah: World, tile: Tile, npcID: number) {
		const zoneID = Yoda.Zone.YodasHut;
		const zone = this.assets.get(Zone, zoneID);
		console.assert(!!zone.puzzleNPCs.find(i => i.id === npcID));

		const place = dagobah.at(5, 4);
		place.zoneType = Zone.Type.Use;
		place.npc = this.assets.get(Tile, npcID);
		place.findItem = tile;

		let hotspotFilter: (hotspot: Hotspot) => boolean;
		if (npcID === Yoda.Tile.Yoda) {
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
