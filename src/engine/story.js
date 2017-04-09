import { rand, srand } from '/util';
import { World } from '/engine';
import { WorldGenerator } from '/engine/generation';
import { Type as HotspotType } from '/engine/objects/hotspot';


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
	constructor(seed, planet, size) {
		this._seed = seed;
		this._planet = planet;
		this._size = size;

		this._world = null;
		this._dagobah = null;
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

	generateWorld(engine) {
		let generator = null;
		let success = false;
		do {
			generator = new WorldGenerator(this.seed, this.planet, this.size, engine);
			success = generator.generate();
			if (!success) this.seed = srand();
		} while (!success);

		const goalID = generator.goalPuzzleID;
		this.goal = engine.data.puzzles[goalID];

		this._setupWorld(generator, engine.data);
		this._setupDagobah(generator, engine.data);
	}

	_setupWorld(generator, data) {
		const world = new World();
		world.data = data;
		for (let i = 0; i < 100; i++) {
			const worldItem = generator.world[i];
			const zone = data.zones[worldItem.zoneID];

			world.map[i] = zone;

			if (!zone) continue;

			zone.puzzle = data.puzzles[worldItem.puzzleIdx] || null;
			zone.puzzleRequired = data.tiles[worldItem.requiredItemID] || null;
			zone.puzzleGain = data.tiles[worldItem.findItemID] || null;
			zone.puzzleNPC = data.tiles[worldItem.npcID] || null;
		}
		this._world = world;
	}

	_setupDagobah(generator, data) {
		const zones = data.zones;
		const dagobah = new World();
		dagobah.data = data;

		dagobah.map[44] = zones[ZONE_DAGOBAH_NORTH_EAST];
		dagobah.map[45] = zones[ZONE_DAGOBAH_NORTH_WEST];
		dagobah.map[54] = zones[ZONE_DAGOBAH_SOUTH_EAST];
		dagobah.map[55] = zones[ZONE_DAGOBAH_SOUTH_WEST];

		let random = rand();
		let mode = Math.abs(random) % 3;
		if (this.goal.id === GOAL_IMPERIAL_BATTLE_CODE) {
			mode = 3;
		} else if (this.goal.id === GOAL_RESCUE_YODA) {
			mode = 4;
		}

		switch (mode) {
			case 0:
				this._setupSpawnHotspot(ZONE_DAGOBAH_NORTH_EAST, TILE_YODA, data);
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
			case 3:
				this._setupSpawnHotspot(ZONE_DAGOBAH_SOUTH_EAST, TILE_YODA, data);
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
		/*
  document->world_things_1[44].zoneId = ZONE_DAGOBAH_NORTH_EAST;
  document->world_things_1[45].zoneId = ZONE_DAGOBAH_NORTH_WEST;
  document->world_things_1[54].zoneId = ZONE_DAGOBAH_SOUTH_EAST;
  document->world_things_1[55].zoneId = ZONE_DAGOBAH_SOUTH_WEST;
  document->world_things_1[54].zone? = 0;
  document->current_zone = 0;
  view->next_zoneId = 0;
  document->field_2E34 = 0;
  document->field_50 = 0;
  document->hero_x = 320;
  document->hero_y = 320;
  document->world_x = 4;
  document->world_y = 5;
  document->game_mode_1 = 11;
  document->unknown = 1;
  YodaDocument::CopyWorld1ToWorldDagobah(document);
  result = 1;
  view->isCheckingHotspots? = 0;
  return result;
*/
		this.dagobah = dagobah;
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
}
