import { randmod, Message } from '/util';
import World from './world';
import { Type as HotspotType } from '/engine/objects/hotspot';
import { Type as ZoneType } from '/engine/objects/zone';

const TILE_YODA = 0x30c;
const TILE_YODAS_SEAT = 2034;
const GOAL_IMPERIAL_BATTLE_CODE = 0x84;
const GOAL_RESCUE_YODA = 0xBD;
const ZONE_YODAS_HUT = 535;
const ZONE_DAGOBAH_NORTH_WEST = 94;
const ZONE_DAGOBAH_NORTH_EAST = 95;
const ZONE_DAGOBAH_SOUTH_WEST = 93;
const ZONE_DAGOBAH_SOUTH_EAST = 96;

export default class {
	constructor(engine) {
		this._engine = engine;
		this._world = null;
	}

	generate(generator) {
		const data = this._engine.data;
		const dagobah = new World();
		dagobah.data = data;

		dagobah.setZone(4, 4, ZONE_DAGOBAH_NORTH_WEST);
		dagobah.at(4, 4).zoneType = ZoneType.Find; // data.zones[ZONE_DAGOBAH_NORTH_WEST].type;
		dagobah.setZone(5, 4, ZONE_DAGOBAH_NORTH_EAST);
		dagobah.at(5, 4).zoneType = ZoneType.Find; // data.zones[ZONE_DAGOBAH_NORTH_EAST].type;
		dagobah.setZone(4, 5, ZONE_DAGOBAH_SOUTH_WEST);
		dagobah.at(4, 5).zoneType = data.zones[ZONE_DAGOBAH_SOUTH_WEST].type;
		dagobah.setZone(5, 5, ZONE_DAGOBAH_SOUTH_EAST);
		dagobah.at(5, 5).zoneType = ZoneType.Town; // data.zones[ZONE_DAGOBAH_SOUTH_EAST].type;

		let mode = randmod(4);
		if (generator.goalPuzzleID === GOAL_IMPERIAL_BATTLE_CODE) {
			mode = 3;
		} else if (generator.goalPuzzleID === GOAL_RESCUE_YODA) {
			mode = 4;
		}
		
		const startingItem = data.puzzles[generator.puzzleIDs_2[0]].item_1;

		//* temporarily copy zone types over from main world for easy comparison against original
		// FIXME: remove this section when comparisons are not necessary anymore
		const world = generator.world;
		dagobah.at(4, 4).zoneType = world.at(4, 4).zoneType;
		dagobah.at(5, 4).zoneType = world.at(5, 4).zoneType;
		dagobah.at(4, 5).zoneType = world.at(4, 5).zoneType;
		dagobah.at(5, 5).zoneType = world.at(5, 5).zoneType;
		//*/
		
		Message('mode: %d', mode);

		let worldItem = null;
		switch (mode) {
			case 0:
				this._setupSpawnHotspot(ZONE_DAGOBAH_NORTH_WEST, TILE_YODA, data);
				worldItem = dagobah.at(4, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneID = ZONE_DAGOBAH_NORTH_WEST;
				worldItem.npcID = TILE_YODA;
				worldItem.findItemID = startingItem;
				generator.placeHotspotTiles(ZONE_DAGOBAH_NORTH_WEST);
				break;
			case 1:
				this._setupSpawnHotspot(ZONE_YODAS_HUT, TILE_YODA, data);
				worldItem = dagobah.at(5, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneID = ZONE_YODAS_HUT;
				worldItem.npcID = TILE_YODA;
				worldItem.findItemID = startingItem;
				generator.placeHotspotTiles(ZONE_YODAS_HUT);
				break;
			case 2:
				this._setupSpawnHotspot(ZONE_DAGOBAH_SOUTH_EAST, TILE_YODA, data);
				worldItem = dagobah.at(5, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneID = ZONE_DAGOBAH_SOUTH_EAST;
				worldItem.npcID = TILE_YODA;
				worldItem.findItemID = startingItem;
				generator.placeHotspotTiles(ZONE_DAGOBAH_SOUTH_EAST);
				break;
			case 3:
				this._setupSpawnHotspot(ZONE_DAGOBAH_SOUTH_WEST, TILE_YODA, data);
				worldItem = dagobah.at(4, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneID = ZONE_DAGOBAH_SOUTH_WEST;
				worldItem.npcID = TILE_YODA;
				worldItem.findItemID = startingItem;
				generator.placeHotspotTiles(ZONE_DAGOBAH_SOUTH_WEST);
				break;
			case 4:
				this._setupSpawnHotspot(ZONE_YODAS_HUT, TILE_YODAS_SEAT, data);
				worldItem = dagobah.at(5, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneID = ZONE_DAGOBAH_SOUTH_WEST;
				worldItem.npcID = TILE_YODA;
				worldItem.findItemID = startingItem;
				generator.placeHotspotTiles(ZONE_YODAS_HUT);
				break;
				
			default:
				break;
		}

		dagobah.at(4, 4).zoneID = ZONE_DAGOBAH_NORTH_WEST;
		dagobah.at(5, 4).zoneID = ZONE_DAGOBAH_NORTH_EAST;
		dagobah.at(4, 5).zoneID = ZONE_DAGOBAH_SOUTH_WEST;
		dagobah.at(5, 5).zoneID = ZONE_DAGOBAH_SOUTH_EAST;

		return (this._world = dagobah);
	}

	_setupSpawnHotspot(zoneID, npcID, data) {
		const zones = data.zones;
		const zone = zones[zoneID];
		const hotspots = zone.hotspots;

		if (zoneID !== ZONE_YODAS_HUT) {
			const index = zone.puzzleNPCTileIDs.indexOf(npcID);
			if (index === -1) return;

			const candidates = zone.hotspots.filter((hotspot) => hotspot.type === HotspotType.SpawnLocation);
			if (candidates.length) {
				let hotspot = candidates[randmod(candidates.length)];
				hotspot.arg = npcID;
				hotspot.enabled = true;
			}

			return;
		}

		if (npcID === TILE_YODA) {
			const index = zone.puzzleNPCTileIDs.indexOf(TILE_YODA);
			if (index === -1) return;

			let hotspot = hotspots.filter((hotspot) => hotspot.x === 3 && hotspot.y === 3).last();
			if (!hotspot) return;

			hotspot.arg = TILE_YODA;
			hotspot.enabled = true;

			return;
		}

		if (npcID === TILE_YODAS_SEAT) {
			const index = zone.puzzleNPCTileIDs.indexOf(npcID);
			if (index === -1) return;

			let hotspot = hotspots.filter((hotspot) => hotspot.x === 3 && hotspot.y === 2).last();
			if (!hotspot) return;

			hotspot.arg = npcID;
			hotspot.enabled = true;

			return;
		}
	}

	get world() {
		console.assert(this._world);
		return this._world;
	}
}
