import { rand } from '/util';
import WorldItemType from './world-item-type';
import World from '/engine/world';
import { Type as HotspotType } from '/engine/objects/hotspot';
import { Type as ZoneType } from '/engine/objects/zone';

const TILE_YODA = 0x30c;
const TILE_YODAS_SEAT = 2034;
const GOAL_IMPERIAL_BATTLE_CODE = 0x84;
const GOAL_RESCUE_YODA = 0xBD;
const ZONE_YODAS_HUT = 535;
const ZONE_DAGOBAH_NORTH_EAST = 94;
const ZONE_DAGOBAH_NORTH_WEST = 95;
const ZONE_DAGOBAH_SOUTH_EAST = 93;
const ZONE_DAGOBAH_SOUTH_WEST = 96;

export default class {
	constructor(engine) {
		this._engine = engine;
		this._world = null;
	}

	generate(generator) {
		const data = this._engine.data;
		const dagobah = new World();
		dagobah.data = data;

		dagobah.setZone(4, 4, ZONE_DAGOBAH_NORTH_EAST);
		dagobah.setZone(5, 4, ZONE_DAGOBAH_NORTH_WEST);
		dagobah.setZone(4, 5, ZONE_DAGOBAH_SOUTH_EAST);
		dagobah.setZone(5, 5, ZONE_DAGOBAH_SOUTH_WEST);

		let random = rand();
		let mode = Math.abs(random) % 3;
		if (this.goal.id === GOAL_IMPERIAL_BATTLE_CODE) {
			mode = 3;
		} else if (this.goal.id === GOAL_RESCUE_YODA) {
			mode = 4;
		}

		let worldItem = null;
		switch (mode) {
			case 0:
				this._setupSpawnHotspot(ZONE_DAGOBAH_NORTH_EAST, TILE_YODA, data);
				worldItem = dagobah.at(4, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneId = ZONE_DAGOBAH_NORTH_EAST;
				worldItem.npcId = TILE_YODA;
				/*
	      		document->world_things_1[44].zone_type = Use;
	      		v7 = document->puzzle_ids_2.ptrs;
	      		document->world_things_1[44].npc_id? = document->wg_npc_id;
	      		document->world_things_1[44].zoneId = ZONE_DAGOBAH_NORTH_EAST;
	      		document->world_things_1[44].solved_1 = 0;
	      		document->world_things_1[44].zone? = 0;
	      		document->world_things_1[44].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v7]->item_1;
			*/
				generator.placeHotspotTiles(ZONE_DAGOBAH_NORTH_EAST);
				break;
			case 1:
				this._setupSpawnHotspot(ZONE_YODAS_HUT, TILE_YODA, data);
				worldItem = dagobah.at(4, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneId = ZONE_YODAS_HUT;
				worldItem.npcId = TILE_YODA;
				/*
	      		document->world_things_1[45].zone_type = Use;
	      		v10 = document->puzzle_ids_2.ptrs;
	      		document->world_things_1[45].npc_id? = document->wg_npc_id;
	      		document->world_things_1[45].zoneId = ZONE_YODAS_HUT;
	      		document->world_things_1[45].solved_1 = 0;
	      		document->world_things_1[45].zone? = 0;
	      		document->world_things_1[45].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v10]->item_1;
			*/
				generator.placeHotspotTiles(ZONE_YODAS_HUT);
				break;
			case 2:
				this._setupSpawnHotspot(ZONE_DAGOBAH_SOUTH_WEST, TILE_YODA, data);
				worldItem = dagobah.at(5, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneId = ZONE_DAGOBAH_SOUTH_WEST;
				worldItem.npcId = TILE_YODA;
				/*
	      		document->world_things_1[55].zone_type = Use;
	      		v8 = document->puzzle_ids_2.ptrs;
	      		document->world_things_1[55].npc_id? = document->wg_npc_id;
	      		document->world_things_1[55].zoneId = ZONE_DAGOBAH_SOUTH_WEST;
	      		document->world_things_1[55].solved_1 = 0;
	      		document->world_things_1[55].zone? = 0;
	      		document->world_things_1[55].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v8]->item_1;
			*/
				generator.placeHotspotTiles(ZONE_DAGOBAH_SOUTH_WEST);
				break;
			case 3: // ZONE_DAGOBAH_SOUTH_EAST ??? 54 should be north west
				this._setupSpawnHotspot(ZONE_DAGOBAH_SOUTH_EAST, TILE_YODA, data);
				worldItem = dagobah.at(5, 4);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneId = ZONE_DAGOBAH_SOUTH_EAST;
				worldItem.npcId = TILE_YODA;
				/*
				document->world_things_1[54].zone_type = Use;
				v9 = document->puzzle_ids_2.ptrs;
				document->world_things_1[54].npc_id? = document->wg_npc_id;
				document->world_things_1[54].zoneId = ZONE_DAGOBAH_SOUTH_EAST;
				document->world_things_1[54].solved_1 = 0;
				document->world_things_1[54].zone? = 0;
				document->world_things_1[54].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v9]->item_1;
				*/
				generator.placeHotspotTiles(ZONE_DAGOBAH_SOUTH_EAST);
				break;
			case 4:
				this._setupSpawnHotspot(ZONE_YODAS_HUT, TILE_YODAS_SEAT, data);
				worldItem = dagobah.at(4, 5);
				worldItem.zoneType = ZoneType.Use;
				worldItem.zoneId = ZONE_DAGOBAH_SOUTH_EAST;
				worldItem.npcId = TILE_YODA;
				/*
	      document->world_things_1[45].zone_type = Use;
	      v10 = document->puzzle_ids_2.ptrs;
	      document->world_things_1[45].npc_id? = document->wg_npc_id;
	      document->world_things_1[45].zoneId = ZONE_YODAS_HUT;
	      document->world_things_1[45].solved_1 = 0;
	      document->world_things_1[45].zone? = 0;
	      document->world_things_1[45].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v10]->item_1;
			*/
				generator.placeHotspotTiles(ZONE_YODAS_HUT);
				break;
			default:
				break;
		}

		return dagobah;
	}

	_setupSpawnHotspot(zoneId, npcId, data) {
		const zones = data.zones;
		const zone = zones[zoneId];
		const hotspots = zone.hotspots;

		if (zoneId !== ZONE_YODAS_HUT) {
			const index = zone.puzzleNPCTileIDs.indexOf(npcId);
			if (index === -1) return;

			const candidates = zone.hotspots.filter((hotspot) => hotspot.type === HotspotType.SpawnLocation);
			if (candidates.length) {
				let hotspot = candidates[rand() % candidates.length];
				hotspot.arg = npcId;
				hotspot.enabled = true;
			}

			return;
		}

		if (npcId === TILE_YODA) {
			const index = zone.puzzleNPCTileIDs.indexOf(TILE_YODA);
			if (index === -1) return;

			let hotspot = hotspots.filter((hotspot) => hotspot.x === 3 && hotspot.y === 3).last();
			if (!hotspot) return;

			hotspot.arg = TILE_YODA;
			hotspot.enabled = true;

			return;
		}

		if (npcId === TILE_YODAS_SEAT) {
			const index = zone.puzzleNPCTileIDs.indexOf(npcId);
			if (index === -1) return;

			let hotspot = hotspots.filter((hotspot) => hotspot.x === 3 && hotspot.y === 2).last();
			if (!hotspot) return;

			hotspot.arg = npcId;
			hotspot.enabled = true;

			return;
		}
	}

	get world() {
		console.assert(this._world);
		return this._world;
	}
}
