import { HotspotType, ZoneType } from "src/engine/objects";

import AssetManager from "../asset-manager";
import { Tile, Zone, Hotspot, Puzzle } from "../objects";
import World from "./world";
import WorldGenerator from "./world-generator";
import { WorldItem } from "src/engine/generation";
import Yoda from "../yoda";
import { randmod } from "src/util";

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

	generate(generator: WorldGenerator) {
		const assets = this.assets;
		const dagobah = new World();
		dagobah.zones = assets.getAll(Zone);

		dagobah.setZone(4, 4, assets.get(Zone, Yoda.Zone.DagobahNorthWest));
		dagobah.at(4, 4).zoneType = ZoneType.Find; // assets.get(Zone, Yoda.Zone.DagobahNorthWest).type;
		dagobah.setZone(5, 4, assets.get(Zone, Yoda.Zone.DagobahNorthEast));
		dagobah.at(5, 4).zoneType = ZoneType.Find; // assets.get(Zone, Yoda.Zone.DagobahNorthEast).type;
		dagobah.setZone(4, 5, assets.get(Zone, Yoda.Zone.DagobahSouthWest));
		dagobah.at(4, 5).zoneType = assets.get(Zone, Yoda.Zone.DagobahSouthWest).type;
		dagobah.setZone(5, 5, assets.get(Zone, Yoda.Zone.DagobahSouthEast));
		dagobah.at(5, 5).zoneType = ZoneType.Town; // assets.get(Zone, Yoda.Zone.DagobahSouthEast).type;

		let mode = randmod(4);
		if (generator.goalPuzzle === assets.get(Puzzle, Yoda.Goal.ImperialBattleCode)) {
			mode = 3;
		} else if (generator.goalPuzzle === assets.get(Puzzle, Yoda.Goal.RescueYoda)) {
			mode = 4;
		}

		const startingItem = generator.initialItem;

		//* temporarily copy zone types over from main world for easy comparison against original
		// FIXME: remove this section when comparisons are not necessary anymore
		const world = generator.world;
		dagobah.at(4, 4).zoneType = world.at(4, 4).zoneType;
		dagobah.at(5, 4).zoneType = world.at(5, 4).zoneType;
		dagobah.at(4, 5).zoneType = world.at(4, 5).zoneType;
		dagobah.at(5, 5).zoneType = world.at(5, 5).zoneType;
		//*/

		let worldItem: WorldItem = null;
		switch (mode) {
			case 0:
				this._setupSpawnHotspot(Yoda.Zone.DagobahNorthWest, Yoda.Tile.Yoda, assets);
				worldItem = dagobah.at(4, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = assets.get(Zone, Yoda.Zone.DagobahNorthWest);
				worldItem.npc = assets.get(Tile, Yoda.Tile.Yoda);
				worldItem.findItem = startingItem;
				break;
			case 1:
				this._setupSpawnHotspot(Yoda.Zone.YodasHut, Yoda.Tile.Yoda, assets);
				worldItem = dagobah.at(5, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = assets.get(Zone, Yoda.Zone.YodasHut);
				worldItem.npc = assets.get(Tile, Yoda.Tile.Yoda);
				worldItem.findItem = startingItem;
				break;
			case 2:
				this._setupSpawnHotspot(Yoda.Zone.DagobahSouthEast, Yoda.Tile.Yoda, assets);
				worldItem = dagobah.at(5, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = assets.get(Zone, Yoda.Zone.DagobahSouthEast);
				worldItem.npc = assets.get(Tile, Yoda.Tile.Yoda);
				worldItem.findItem = startingItem;
				break;
			case 3:
				this._setupSpawnHotspot(Yoda.Zone.DagobahSouthWest, Yoda.Tile.Yoda, assets);
				worldItem = dagobah.at(4, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = assets.get(Zone, Yoda.Zone.DagobahSouthWest);
				worldItem.npc = assets.get(Tile, Yoda.Tile.Yoda);
				worldItem.findItem = startingItem;
				break;
			case 4:
				this._setupSpawnHotspot(Yoda.Zone.YodasHut, Yoda.Tile.YodasSeat, assets);
				worldItem = dagobah.at(5, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = assets.get(Zone, Yoda.Zone.DagobahSouthWest);
				worldItem.npc = assets.get(Tile, Yoda.Tile.Yoda);
				worldItem.findItem = startingItem;
				break;

			default:
				break;
		}

		dagobah.at(4, 4).zone = assets.get(Zone, Yoda.Zone.DagobahNorthWest);
		dagobah.at(5, 4).zone = assets.get(Zone, Yoda.Zone.DagobahNorthEast);
		dagobah.at(4, 5).zone = assets.get(Zone, Yoda.Zone.DagobahSouthWest);
		dagobah.at(5, 5).zone = assets.get(Zone, Yoda.Zone.DagobahSouthEast);

		return (this._world = dagobah);
	}

	private _setupSpawnHotspot(zoneID: number, npcID: number, assets: AssetManager) {
		const zone = assets.get(Zone, zoneID);
		const hotspots = zone.hotspots;

		if (zoneID !== Yoda.Zone.YodasHut) {
			const index = zone.puzzleNPCs.findIndex(i => i.id === npcID);
			if (index === -1) return;

			const candidates = zone.hotspots.filter(
				(hotspot: Hotspot) => hotspot.type === HotspotType.SpawnLocation
			);
			if (candidates.length) {
				const hotspot = candidates[randmod(candidates.length)];
				hotspot.arg = npcID;
				hotspot.enabled = true;
			}

			return;
		}

		if (npcID === Yoda.Tile.Yoda) {
			const index = zone.puzzleNPCs.findIndex(i => i.id === Yoda.Tile.Yoda);
			if (index === -1) return;

			const hotspot = hotspots.filter((hotspot: Hotspot) => hotspot.x === 3 && hotspot.y === 3).last();
			if (!hotspot) return;

			hotspot.arg = Yoda.Tile.Yoda;
			hotspot.enabled = true;

			return;
		}

		if (npcID === Yoda.Tile.YodasSeat) {
			const index = zone.puzzleNPCs.findIndex(i => i.id === npcID);
			if (index === -1) return;

			const hotspot = hotspots.filter((hotspot: Hotspot) => hotspot.x === 3 && hotspot.y === 2).last();
			if (!hotspot) return;

			hotspot.arg = npcID;
			hotspot.enabled = true;
		}
	}
}

export default DagobahGenerator;
