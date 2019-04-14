import { HotspotType, ZoneType } from "src/engine/objects";

import Engine from "../engine";
import GameData from "../game-data";
import Hotspot from "../objects/hotspot";
import World from "./world";
import WorldGenerator from "./world-generator";
import { WorldItem } from "src/engine/generation";
import Yoda from "../yoda";
import { randmod } from "src/util";

class DagobahGenerator {
	private _engine: Engine;
	private _world: World = null;

	constructor(engine: Engine) {
		this._engine = engine;
	}

	get world() {
		console.assert(this._world !== null);
		return this._world;
	}

	generate(generator: WorldGenerator) {
		const data = this._engine.data;
		const dagobah = new World();
		dagobah.zones = data.zones;

		dagobah.setZone(4, 4, data.zones[Yoda.Zone.DagobahNorthWest]);
		dagobah.at(4, 4).zoneType = ZoneType.Find; // data.zones[Yoda.Zone.DagobahNorthWest].type;
		dagobah.setZone(5, 4, data.zones[Yoda.Zone.DagobahNorthEast]);
		dagobah.at(5, 4).zoneType = ZoneType.Find; // data.zones[Yoda.Zone.DagobahNorthEast].type;
		dagobah.setZone(4, 5, data.zones[Yoda.Zone.DagobahSouthWest]);
		dagobah.at(4, 5).zoneType = data.zones[Yoda.Zone.DagobahSouthWest].type;
		dagobah.setZone(5, 5, data.zones[Yoda.Zone.DagobahSouthEast]);
		dagobah.at(5, 5).zoneType = ZoneType.Town; // data.zones[Yoda.Zone.DagobahSouthEast].type;

		let mode = randmod(4);
		if (generator.goalPuzzle === data.puzzles[Yoda.Goal.ImperialBattleCode]) {
			mode = 3;
		} else if (generator.goalPuzzle === data.puzzles[Yoda.Goal.RescueYoda]) {
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
				this._setupSpawnHotspot(Yoda.Zone.DagobahNorthWest, Yoda.Tile.Yoda, data);
				worldItem = dagobah.at(4, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = data.zones[Yoda.Zone.DagobahNorthWest];
				worldItem.npc = data.tiles[Yoda.Tile.Yoda];
				worldItem.findItem = startingItem;
				break;
			case 1:
				this._setupSpawnHotspot(Yoda.Zone.YodasHut, Yoda.Tile.Yoda, data);
				worldItem = dagobah.at(5, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = data.zones[Yoda.Zone.YodasHut];
				worldItem.npc = data.tiles[Yoda.Tile.Yoda];
				worldItem.findItem = startingItem;
				break;
			case 2:
				this._setupSpawnHotspot(Yoda.Zone.DagobahSouthEast, Yoda.Tile.Yoda, data);
				worldItem = dagobah.at(5, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = data.zones[Yoda.Zone.DagobahSouthEast];
				worldItem.npc = data.tiles[Yoda.Tile.Yoda];
				worldItem.findItem = startingItem;
				break;
			case 3:
				this._setupSpawnHotspot(Yoda.Zone.DagobahSouthWest, Yoda.Tile.Yoda, data);
				worldItem = dagobah.at(4, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = data.zones[Yoda.Zone.DagobahSouthWest];
				worldItem.npc = data.tiles[Yoda.Tile.Yoda];
				worldItem.findItem = startingItem;
				break;
			case 4:
				this._setupSpawnHotspot(Yoda.Zone.YodasHut, Yoda.Tile.YodasSeat, data);
				worldItem = dagobah.at(5, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zone = data.zones[Yoda.Zone.DagobahSouthWest];
				worldItem.npc = data.tiles[Yoda.Tile.Yoda];
				worldItem.findItem = startingItem;
				break;

			default:
				break;
		}

		dagobah.at(4, 4).zone = data.zones[Yoda.Zone.DagobahNorthWest];
		dagobah.at(5, 4).zone = data.zones[Yoda.Zone.DagobahNorthEast];
		dagobah.at(4, 5).zone = data.zones[Yoda.Zone.DagobahSouthWest];
		dagobah.at(5, 5).zone = data.zones[Yoda.Zone.DagobahSouthEast];

		return (this._world = dagobah);
	}

	private _setupSpawnHotspot(zoneID: number, npcID: number, data: GameData) {
		const zones = data.zones;
		const zone = zones[zoneID];
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
