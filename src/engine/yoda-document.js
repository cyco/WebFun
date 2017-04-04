import { Planet } from './types';
import World from './world';
import { WorldGenerator } from './generation';
import { rand } from '/util';
import { Type as HotspotType } from './objects/hotspot';

export default class YodaDocument {
	constructor() {
		this.seed = -1;
		this.planet = Planet.Hoth;
		this.size = -1;
		this._data = null;

		this.gamesCount = 0;

		this.tatooine_puzzle_ids = [];
		this.endor_puzzle_ids = [];
		this.hoth_puzzle_ids = [];

		this.puzzles_can_be_reused = -1;
		this.goal = null;

		this.world = new World();
		this.dagobah = new World();

		Object.seal(this);
	}

	buildNewWorld() {
		const generator = new WorldGenerator(this);
		generator.generate();

		const goalID = generator.goalPuzzleID;
		this.goal = this.data.getPuzzle(goalID);

		const data = this.data;

		// copy world
		for (let i = 0; i < 100; i++) {
			const worldItem = generator.world[i];
			const zone = data.getZone(worldItem.zoneID);

			this.world.map[i] = zone;

			if (!zone) continue;

			zone.puzzle = data.getPuzzle(worldItem.puzzleIdx);
			zone.puzzleRequired = data.getTile(worldItem.requiredItemID);
			zone.puzzleGain = data.getTile(worldItem.findItemID);
			zone.puzzleNPC = data.getTile(worldItem.npcID);

			//			if (WebFun.DEBUG && this.world.map[i])
			//				this.world.map[i]._debug_worldItem = worldItem;
		}

		this._setupDagobah(generator);
	}

	_setupDagobah(generator) {
		// TODO: use proper ids for items
		const YODA = 0x30c;

		// TODO: use proper constants for puzzles
		const GOAL_IMPERIAL_BATTLE_CODE = 0x84;
		const GOAL_RESCUE_YODA = 0xBD;

		const data = this.data;
		const zones = data.zones;
		// TODO: use proper constants for zone ids
		// setup dagobah
		this.dagobah.map[44] = zones[0x5e];
		this.dagobah.map[45] = zones[0x5f];
		this.dagobah.map[54] = zones[0x5d];
		this.dagobah.map[55] = zones[0x60];

		let random = rand();
		let mode = Math.abs(random) % 3;
		if (this.goal.id === GOAL_IMPERIAL_BATTLE_CODE) {
			mode = 3;
		} else if (this.goal.id === GOAL_RESCUE_YODA) {
			mode = 4;
		}

		switch (mode) {
			case 0:
				this._setupSpawnHotspot(94, YODA);
				/*
	      		document->world_things_1[44].zone_type = Use;
	      		v7 = document->puzzle_ids_2.ptrs;
	      		document->world_things_1[44].npc_id? = document->wg_npc_id;
	      		document->world_things_1[44].zone_id = 94;
	      		document->world_things_1[44].solved_1 = 0;
	      		document->world_things_1[44].zone? = 0;
	      		document->world_things_1[44].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v7]->item_1;
			*/
				generator.PlaceHotspotTiles(94);
				break;
			case 1:
				this._setupSpawnHotspot(535, YODA);
				/*
	      		document->world_things_1[45].zone_type = Use;
	      		v10 = document->puzzle_ids_2.ptrs;
	      		document->world_things_1[45].npc_id? = document->wg_npc_id;
	      		document->world_things_1[45].zone_id = 535;
	      		document->world_things_1[45].solved_1 = 0;
	      		document->world_things_1[45].zone? = 0;
	      		document->world_things_1[45].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v10]->item_1;
			*/
				generator.PlaceHotspotTiles(535);
				break;
			case 2:
				this._setupSpawnHotspot(96, YODA);
				/*
	      		document->world_things_1[55].zone_type = Use;
	      		v8 = document->puzzle_ids_2.ptrs;
	      		document->world_things_1[55].npc_id? = document->wg_npc_id;
	      		document->world_things_1[55].zone_id = 96;
	      		document->world_things_1[55].solved_1 = 0;
	      		document->world_things_1[55].zone? = 0;
	      		document->world_things_1[55].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v8]->item_1;
			*/
				generator.PlaceHotspotTiles(96);
				break;
			case 3:
				this._setupSpawnHotspot(93, YODA);
				/*
				document->world_things_1[54].zone_type = Use;
				v9 = document->puzzle_ids_2.ptrs;
				document->world_things_1[54].npc_id? = document->wg_npc_id;
				document->world_things_1[54].zone_id = 93;
				document->world_things_1[54].solved_1 = 0;
				document->world_things_1[54].zone? = 0;
				document->world_things_1[54].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v9]->item_1;
				*/
				generator.PlaceHotspotTiles(93);
				break;
			case 4:
				this._setupSpawnHotspot(535, 2034);
				/*
	      document->world_things_1[45].zone_type = Use;
	      v10 = document->puzzle_ids_2.ptrs;
	      document->world_things_1[45].npc_id? = document->wg_npc_id;
	      document->world_things_1[45].zone_id = 535;
	      document->world_things_1[45].solved_1 = 0;
	      document->world_things_1[45].zone? = 0;
	      document->world_things_1[45].find_item_id = document->puzzles.ptrs[(unsigned __int16)*v10]->item_1;
			*/
				generator.PlaceHotspotTiles(535);
				break;
			default:
				break;
		}
		/*
  document->world_things_1[44].zone_id = 94;
  document->world_things_1[45].zone_id = 95;
  document->world_things_1[54].zone_id = 93;
  document->world_things_1[55].zone_id = 96;
  document->world_things_1[54].zone? = 0;
  document->current_zone = 0;
  view->next_zone_id = 0;
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
	}

	_setupSpawnHotspot(zoneId, npcId) {
		// TODO: use proper ids for items
		const YODA = 0x30c;

		const data = this.data;
		const zones = data.zones;
		const zone = zones[zoneId];
		const hotspots = zone.hotspots;

		// TODO: use proper constant for zone id
		if (zoneId !== 535) {
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

		if (npcId === YODA) {
			const index = zone.puzzleNPCTileIDs.indexOf(YODA);
			if (index === -1) return;

			let hotspot = hotspots.filter((hotspot) => hotspot.x === 3 && hotspot.y === 3).last();
			if (!hotspot) return;

			hotspot.arg = YODA;
			hotspot.enabled = true;

			return;
		}

		if (npcId === 2034) {
			const index = zone.puzzleNPCTileIDs.indexOf(npcId);
			if (index === -1) return;

			let hotspot = hotspots.filter((hotspot) => hotspot.x === 3 && hotspot.y === 2).last();
			if (!hotspot) return;

			hotspot.arg = npcId;
			hotspot.enabled = true;

			return;
		}
	}

	set data(d) {
		this._data = d;
		this.world.data = d;
		this.dagobah.data = d;
	}

	get data() {
		return this._data;
	}
}
