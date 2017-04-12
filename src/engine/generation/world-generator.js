import { Point, Message, srand, rand, VerticalPointRange, HorizontalPointRange } from "/util";

import MapGenerator from "./map-generator";
import WorldItem from "./world-item";
import WorldItemType from "./world-item-type";
import World from '/engine/world';
import { Planet, WorldSize } from "/engine/types";
import Quest from "/engine/quest";

import GetDistanceToCenter from "./distance-to-center";

import { Type as ZoneType } from "/engine/objects/zone";
import { Type as PuzzleType } from "/engine/objects/puzzle";
import { Type as HotspotType } from "/engine/objects/hotspot";
import * as Type from "/engine/types";

const TILE_ADEGAN_CRYSTAL = 459;

export default class WorldGenerator {
	constructor(seedOrDocument, size, planet, engine) {
		this._seed = seedOrDocument | 0;
		this._size = size | 0;
		this._planet = planet | 0;
		this.data = engine && engine.data;

		this._puzzleIds = [];
		this.chosenZoneIDs = [];
		this.requiredItems = [];
		this.providedItems = [];
		this.goalPuzzleID = -1;

		this.world = null;

		this.mapGenerator = null;
		this.field_3398 = -1;
		this.item_ids = [];
		this.providedItemQuests = [];
		this.puzzleIDs = [];
		this.puzzleIDs_1 = [];
		this.puzzleIDs_2 = [];
		this.requiredItemQuests = [];
		this.wg_another_item_id = -1;
		this.wg_another_item_id = null;
		this.wg_item_id = -1;
		this.wg_item_id_unknown_2 = -1;
		this.wg_item_id_unknown_3 = -1;
		this.wg_last_added_item_id = -1;
		this.wg_npc_id = -1;
		this.wg_zone_type = -1;
		this.worldZones = [];
		this.field_68 = null;
		this.field_2E64 = -1;

		Object.seal(this);
	}

	generate() {
		Message("Generate New World (JS, 0x%x, 0x%x, 0x%x)", this._seed, this._size, this._planet);

		srand(this._seed);

		const mapGenerator = this.mapGenerator = new MapGenerator();
		mapGenerator.generate(-1, this._size);
		Message('map generation done');

		this.world = new World();

		const typeMap = mapGenerator.typeMap;
		const orderMap = mapGenerator.orderMap;

		for (let i = 0; i < 100; i++) {
			this.world.index(i).puzzleIdx = orderMap[i];
		}

		const puzzle_count = mapGenerator.puzzleCount;
		let puzzles1_count,
			puzzles2_count;
		if (puzzle_count % -2) {
			puzzles1_count = (puzzle_count + 1) / 2;
			puzzles2_count = (puzzle_count + 1) / 2;
		} else {
			puzzles1_count = puzzle_count / 2 + 1;
			puzzles2_count = puzzle_count / 2;
		}

		puzzles1_count = Math.floor(puzzles1_count);
		puzzles2_count = Math.floor(puzzles2_count);

		/*
		if (document.gameCount < 1) {
			document.puzzlesIDs[Planet.HOTH].push(0xBD);
		}
		if (document.gameCount < 10) {
			document.puzzlesIDs[Planet.HOTH].push(0xC5);
		}
		*/

		// view.field_4C = 1;
		this.field_68 = 0;
		this.wg_another_item_id = -1;

		this.puzzleIDs = [];
		this.puzzleIDs_1 = [];
		this.puzzleIDs_2 = [];
		this.worldZones = [];
		this.item_ids = [];

		this.providedItemQuests = [];
		this.requiredItemQuests = [];

		let goalID = this.goalPuzzleID;
		if (goalID < 0) {
			goalID = this.goalPuzzleID = this.GetNewPuzzleId(-1, -1, ZoneType.Unknown, 0);
		}

		if (goalID < 0) {
			Message("No new puzzle id\n");
			return false;
		}

		this.puzzleIDs_1.clear();
		this.puzzleIDs_1.resize(puzzles1_count + 1, -1);

		this.puzzleIDs_2.clear();
		this.puzzleIDs_2.resize(puzzles2_count + 1, -1);

		this.worldZones.clear();
		this.worldZones.resize(100, null);
		this.puzzleIDs.push(goalID);
		this.puzzleIDs_1[puzzles1_count] = goalID;
		this.puzzleIDs_2[puzzles2_count] = goalID;

		// TODO: add goal puzzle to planet puzzle ids
		this.chooseTransportZones();

		let doNotExit;
		doNotExit = this.doLoop0(puzzle_count, puzzles2_count, mapGenerator.orderMap);
		if (!doNotExit) {
			return false;
		}

		Message("After Loop 1\n");
		Message("After Loop 1\n");
		doNotExit = this.choosePuzzles(puzzles2_count - 1, mapGenerator.orderMap);
		if (!doNotExit) {
			Message("Generate new world => %x\n", 0);
			return false;
		}

		Message("After Loop 2\n");
		doNotExit = this.loop2(mapGenerator.typeMap);
		if (!doNotExit) {
			Message("Generate new world => %x\n", 0);
			return false;
		}

		Message("After Loop 3\n");
		doNotExit = this.Unknown_5(mapGenerator.typeMap);
		if (!doNotExit) {
			let result = this.doCleanup();
			Message("Generate new world => %x\n", result);
			return result;
		}

		for (let i = 0; i < 100; i++) {
			if (this.world.index(i).zoneId >= 0) {
				this.placeHotspotTiles(this.world.index(i).zoneId);
			}
		}

		this.chosenZoneIDs.shift();
		this.RemoveEmptyZoneIdsFromWorld();
		this.WritePlanetValues();

		/*
		 doc.contols_puzzle_reuse? = -1;
		 doc.world_generation_size = this.puzzleIDs_2.count + this.puzzleIDs_1.count + 2 * (y_2 + v204);
		 doc.world_generation_time = time(0);
		 this.field_7C = 0;
		 */
		Message("End Generate New World\n\n");

		Message("Generate new world => %x\n", 1);
		return true;
	}

	chooseTransportZones() {
		const typeMap = this.mapGenerator.typeMap;

		let target_x,
			target_y,
			foundTravelTarget,
			range;
		let findTravelTarget = (point, control) => {
			const index = point.x + point.y * 10;
			if (this.worldZones[index]) return;
			if (typeMap[index] !== WorldItemType.TravelEnd) return;

			target_x = point.x;
			target_y = point.y;

			control.stop = foundTravelTarget = true;
		};

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				let idx = x + y * 10;

				this.wg_npc_id = -1;
				this.wg_item_id = -1;
				this.wg_last_added_item_id = -1;

				foundTravelTarget = false;

				if (typeMap[idx] !== WorldItemType.TravelStart)
					continue;

				let distance = GetDistanceToCenter(x, y);
				let zoneID = this.getZoneIDWithType(ZoneType.TravelStart, -1, -1, -1, -1, distance, 1);
				if (zoneID < 0) continue;

				this.world.index(idx).zoneId = zoneID;
				this.world.index(idx).zoneType = ZoneType.TravelStart;
				this.world.index(idx).requiredItemID = this.wg_item_id;

				let zone = this.getZoneByID(zoneID);
				let connectedZoneID = -1;
				for (let hotspot of zone.hotspots) {
					if (hotspot.type === Type.VehicleTo) {
						connectedZoneID = hotspot.arg;
						break;
					}
				}

				if (connectedZoneID < 0) continue;

				// islands on the left
				if (!foundTravelTarget) {
					range = new VerticalPointRange(0, 9, 0);
					range.iterate(findTravelTarget);
				}

				// islands on top
				if (!foundTravelTarget) {
					range = new HorizontalPointRange(0, 9, 0);
					range.iterate(findTravelTarget);
				}

				// islands on the bottom
				if (!foundTravelTarget) {
					range = new HorizontalPointRange(0, 9, 9);
					range.iterate(findTravelTarget);
				}

				// islands on the right
				if (!foundTravelTarget) {
					range = new VerticalPointRange(0, 9, 9);
					range.iterate(findTravelTarget);
				}

				if (foundTravelTarget) {
					this._addTravelTargetZone(zoneID, connectedZoneID, target_x, target_y);
					continue;
				}

				this.RemoveQuestProvidingItem(this.wg_item_id);

				this.world.index(idx).zoneId = -1;
				this.world.index(idx).zoneType = 0;
				this.world.index(idx).requiredItemID = -1;
			}
		}
		Message("After Transport Loop\n");
	}

	_addTravelTargetZone(zoneID, targetID, x, y) {
		if (this.worldContainsZoneId(targetID)) return;

		Message('transport loop: %dx%d', x, y);
		const idx = x + 10 * y;
		this.world.index(idx).zoneId = targetID;
		this.world.index(idx).zoneType = ZoneType.TravelEnd;
		this.world.index(idx).requiredItemID = this.wg_item_id;
		this.worldZones[idx] = this.getZoneByID(targetID);
		// v87 = zone_2;
		// v88 = (char *)doc + 0x34 * idx_3;
		/*
		 LOWORD(idx_3) = (_WORD)zoneID;
		 *(_DWORD *)transport_count = v87;
		 */
		this.addZoneWithIDToWorld(zoneID);
		this.addZoneWithIDToWorld(targetID);
	}

	loop2(map) {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				let idx = x + 10 * y;
				let itemType = map[idx];
				let did_not_place_zone = 0;

				this.wg_another_item_id = -1;
				this.wg_npc_id = -1;
				this.wg_item_id = -1;
				this.wg_last_added_item_id = -1;

				let worldThing = this.world.index(idx);
				if (itemType === WorldItemType.None) continue;
				if (itemType === WorldItemType.KeptFree) continue;
				if (this.worldZones[idx] !== null) continue;

				let did_not_place_zone_ref = {
					value: did_not_place_zone
				};

				let zoneID = this.doPuzzle(x, y, itemType, did_not_place_zone_ref);
				did_not_place_zone = did_not_place_zone_ref.value;

				if (zoneID < 0) {
					if (itemType === WorldItemType.Empty) continue;
					if (itemType === WorldItemType.Island) continue;
					if (itemType === WorldItemType.Candidate) continue;
					if (!did_not_place_zone) continue;

					let distance = GetDistanceToCenter(x, y);
					zoneID = this.getZoneIDWithType(ZoneType.Empty, -1, -1, -1, -1, distance, 0);
					if (zoneID > 0) continue;
					worldThing.zoneType = ZoneType.Empty;
					worldThing.zoneId = zoneID;
					worldThing.requiredItemID = -1;
					/*
					 *(_DWORD *)itemType = this.getZoneByID(zoneId_2);
					 worldThing[-1].field_30 = zoneId_2;
					 worldThing.field_C = -1;
					 LOWORD(worldThing.zoneType) = -1;
					 */
					this.addZoneWithIDToWorld(zoneID);
				} else {
					worldThing.zoneId = zoneID;
					/*
					 *v193 = this.getZoneByID(zoneID);
					 worldThing.field_C = -1;
					 */
					if (worldThing.zoneType !== ZoneType.Town)
						this.addZoneWithIDToWorld(zoneID);
				}
			}
		}
		return true;
	}


	findPositionOfPuzzle(orderIdx, orderMap) {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (orderMap[x + 10 * y] === orderIdx)
					return new Point(x, y);
			}
		}
		return null;
	}

	// TODO: continue cleanup here
	choosePuzzles(puzzleMapIdx, puzzles) {
		for (let zone_type = puzzleMapIdx; zone_type > 0; zone_type--) {
			this.wg_zone_type = -1;
			this.wg_last_added_item_id = -1;
			this.wg_item_id_unknown_2 = -1;
			this.wg_item_id = -1;
			this.wg_item_id_unknown_3 = -1;
			this.wg_npc_id = -1;
			this.wg_another_item_id = -1;
			this.field_3398 = -1;

			const point = this.findPositionOfPuzzle(zone_type - 1, puzzles);
			const distance = GetDistanceToCenter(point.x, point.y);
			const idx = point.x + 10 * point.y;

			let puzzleID = this.puzzleIDs_2[zone_type];
			let item_1 = this._getPuzzleItemId(puzzleID);
			let zoneID = -1;

			let type;
			/*
			if (v199 === x_8) {
				type = ZoneType.Goal;
				zoneID = this.getZoneIDWithType(type, v199 - 1, -1, 0, -1, distance, 0);
			} else {
			*/
			type = ((rand() & 1) + 15);
			zoneID = this.getZoneIDWithType(type, zone_type - 1, -1, item_1, -1, distance, 0);

			if (zoneID === -1) {
				type = type === ZoneType.Use ? ZoneType.Trade : ZoneType.Use;
				zoneID = this.getZoneIDWithType(type, zone_type - 1, -1, item_1, -1, distance, 0);
			}
			//}

			this.wg_zone_type = type;

			if (zoneID < 0) {
				return this.doCleanup();
			}

			this.addZoneWithIDToWorld(zoneID);

			this.world.index(idx).zoneType = this.wg_zone_type;
			this.world.index(idx).zoneId = zoneID;
			this.world.index(idx).findItemID = this.wg_last_added_item_id;
			this.world.index(idx).unknown606 = -1; // this.wg_another_item_id;
			this.world.index(idx).requiredItemID = this.wg_item_id;
			this.world.index(idx).npcID = this.wg_npc_id;
			/*v147 = (char *)doc + 52 * idx_5;
			 *((_WORD *)v147 + 624) = 0; */
			this.worldZones[idx] = this.getZoneByID(zoneID);
			this.wg_another_item_id = -1;
		}
		return true;
	}

	doCleanup() {
		Message("Do Cleanup\n");
		this.puzzleIDs_1.clear();
		this.puzzleIDs_2.clear();
		this.item_ids.clear();

		this.providedItemQuests.clear();
		this.requiredItemQuests.clear();
		this.puzzleIDs.clear();
		this.chosenZoneIDs.clear();

		return false;
	}

	doPuzzle(x, y, zone_2, did_not_place_zone_ref) {
		Message("doPuzzle\n");
		let distance = GetDistanceToCenter(x, y);
		let worldThing = this.world.index(x + 10 * y);
		let type = this.zoneTypeForWorldItem(zone_2);


		did_not_place_zone_ref.value = 0;

		if (type === ZoneType.Town) {
			let result = this.getZoneIDWithType(type, -1, -1, -1, -1, distance, 0);
			if (result >= 0)
				worldThing.zoneType = type;
			did_not_place_zone_ref.value = 1;

			return result;
		}

		if (this.isBlockadeZoneType(type)) {
			let result = this.getZoneIDWithType(type, -1, -1, -1, -1, distance, 0);
			if (result < 0) {
				did_not_place_zone_ref.value = 1;
				return -1;
			}
			worldThing.zoneType = type;
			worldThing.requiredItemID = this.wg_item_id;
			return result;
		}

		return -1;
	}

	isBlockadeZoneType(type) {
		switch (type) {
			case ZoneType.BlockadeNorth:
			case ZoneType.BlockadeEast:
			case ZoneType.BlockadeWest:
			case ZoneType.BlockadeSouth:
				return true;
			default:
				return false;
		}
	}

	zoneTypeForWorldItem(item) {
		switch (item) {
			case WorldItemType.Spaceport:
				return ZoneType.Town;
			case WorldItemType.BlockWest:
				return ZoneType.BlockadeEast;
			case WorldItemType.BlockEast:
				return ZoneType.BlockadeWest;
			case WorldItemType.BlockNorth:
				return ZoneType.BlockadeNorth;
			case WorldItemType.BlockSouth:
				return ZoneType.BlockadeSouth;
			default:
				return ZoneType.Empty;
		}
	}

	doLoop0(puzzle_count, puzzles2_count, puzzles) {
		let y_1 = 0;
		let zoneId_3 = 0;
		let x_4 = 1;

		let connectedZoneID = puzzle_count;
		let zoneId_11 = this.puzzleIDs_1.length - 1;
		if (puzzle_count > 0) {
			do {
				this.wg_zone_type = -1;
				this.wg_item_id = -1;
				this.wg_item_id_unknown_2 = -1;
				this.wg_item_id_unknown_3 = -1;
				this.wg_last_added_item_id = -1;
				this.wg_npc_id = -1;
				this.wg_another_item_id = -1;
				this.field_3398 = -1;

				y_1 = 0;
				let row = 0;
				let zone_2 = this.puzzleIDs_1[zoneId_11];

				let x = 0,
					y = 0;
				do {
					let foundSomething = 0;
					for (x = 0; x < 10; x++) {
						if (puzzles[x + 10 * y] === connectedZoneID - 1) {
							foundSomething = 1;
							break;
						}
					}

					if (foundSomething) {
						let world_puz_idx = puzzles[x + 10 * y];

						let item_1 = this._getPuzzleItemId(zone_2);
						let item_2 = this._getPuzzleItemId2(zone_2);

						let breakAgain = 0;
						zoneId_3 = -1;
						while (1) {
							if (zoneId_3 >= 0) {
								breakAgain = 1;
								break;
							}
							if (connectedZoneID === puzzle_count) {
								let distance = GetDistanceToCenter(x, y);
								zoneId_3 = this.getZoneIDWithType(ZoneType.Goal, zoneId_11 - 1, puzzles2_count - 1, item_1, item_2, distance, true);
								if (zoneId_3 < 0) break;

								this.wg_zone_type = ZoneType.Goal;
								this.wg_another_item_id = world_puz_idx - 1;
								this.field_3398 = 711;
							} else {
								let random = rand();
								Message("random = %x\n", random);
								let type = ((random ^ 1) & 1) + 15; // was rand() & 1
								let distance = GetDistanceToCenter(x, y);
								zoneId_3 = this.getZoneIDWithType(type,
									zoneId_11 - 1, -1,
									item_1, -1,
									distance,
									true);
								if (zoneId_3 < 0) {
									if (type === ZoneType.Use) {
										let distance = GetDistanceToCenter(x, y);
										zoneId_3 = this.getZoneIDWithType(ZoneType.Trade, zoneId_11 - 1, -1, item_1, -1, distance, true);
										if (zoneId_3 < 0) break;
										this.wg_zone_type = ZoneType.Trade;
									} else {
										let distance = GetDistanceToCenter(x, y);
										zoneId_3 = this.getZoneIDWithType(ZoneType.Use, zoneId_11 - 1, -1, item_1, -1, distance, false);
										if (zoneId_3 < 0) break;
										this.wg_zone_type = ZoneType.Use;
									}
									this.wg_another_item_id = world_puz_idx - 1;
								} else {
									this.wg_zone_type = type;
									this.wg_another_item_id = world_puz_idx - 1;
								}
							}
							this.addZoneWithIDToWorld(zoneId_3);
							if (zoneId_3 < 0) break;
							let world_idx_1 = x + 10 * y;

							this.world.index(world_idx_1).zoneType = this.wg_zone_type;
							this.world.index(world_idx_1).zoneId = zoneId_3;
							this.world.index(world_idx_1).findItemID = this.wg_last_added_item_id;
							this.world.index(world_idx_1).unknown606 = this.wg_another_item_id;
							this.world.index(world_idx_1).requiredItemID = this.wg_item_id;
							this.world.index(world_idx_1).npcID = this.wg_npc_id;

							/*
							 *((_WORD *)v113 + 611) = this.wg_item_id_unknown_2;
							 *((_WORD *)v113 + 609) = this.wg_item_id_unknown_3;
							 *((_WORD *)v113 + 607) = this.field_3398;
							 *((_WORD *)v113 + 624) = 1;
							 */
							this.worldZones[world_idx_1] = this.getZoneByID(zoneId_3);

							Message("y_2 = %d\n", zoneId_11);
							if (zoneId_11 === 1) {
								let distance = GetDistanceToCenter(x, y);
								this.AddProvidedQuestWithItemID(this.wg_item_id, distance);

								Message("v206 = %d\n", x_4);
								breakAgain = 1;
								break;
							}

							Message("v206 = %d\n", x_4);
							if (0 > 200) {
								breakAgain = 1;
								break;
							}
						}

						if (breakAgain) break;

						return this.doCleanup();
					}

					row++;
					++y_1;

					y++;
					x = 0;
				} while (row < 100); // (int16 *)&v230;
				Message("x_4 = %d\n", x_4);
				if (!x_4) {
					let distance_1 = GetDistanceToCenter(x, y);
					let zoneId_4 = this.getZoneIDWithType(ZoneType.Empty, -1, -1, -1, -1, distance_1, 0);
					if (zoneId_4 >= 0) {
						let idx_4 = x + 10 * y;
						console.log("idx_4: ", idx_4);
						this.world.index(idx_4).zoneType = this.wg_zone_type;
						this.worldZones[idx_4] = this.getZoneByID(zoneId_4);
						this.world.index(idx_4).zoneId = zoneId_4;
						this.addZoneWithIDToWorld(zoneId_4);
					}
				}
				Message("v198 = %d\n", zoneId_11);
				connectedZoneID--;
				zoneId_11--;
			} while (zoneId_11 > 0);
		}
		return true;
	}

	RemoveEmptyZoneIdsFromWorld() {
		Message("YodaDocument::RemoveEmptyZoneIdsFromWorld()\n");
		let nonEmptyZoneIDs = [];
		for (let zoneID of this.chosenZoneIDs) {
			if (this.getZoneTypeByZoneID(zoneID) !== ZoneType.Empty)
				nonEmptyZoneIDs.push(zoneID);
		}

		this.chosenZoneIDs.clear();

		for (let zoneID of nonEmptyZoneIDs) {
			this.chosenZoneIDs.push(zoneID);
		}
	}

	GetNewPuzzleId(item_id, a3, zone_type, a5) {
		Message("YodaDocument::GetNewPuzzleId(%d, %d, %d, %d)\n", item_id, a3, zone_type, a5);
		let puzzle_id;
		let puzzle_1;
		let break_from_loop = false;

		let puzzleIDs = [];
		this.GetPuzzleCandidates(puzzleIDs, item_id, a3, zone_type, a5);
		if (puzzleIDs.length === 0) {
			return -1;
		}

		puzzleIDs.shuffle();

		let count = puzzleIDs.length;
		let puzzle_idx = 0;
		while (1) {
			puzzle_id = puzzleIDs[puzzle_idx];
			puzzle_1 = this._getPuzzle(puzzle_id);
			if (this.containsPuzzleID(puzzle_id)) {
				if (!break_from_loop) {
					++puzzle_idx;
					if (puzzle_idx >= count)
						break_from_loop = true;
					if (!break_from_loop)
						continue;
				} else {
					return -1;
				}
			}

			// Use: 16, Find: 17, FindTheForce: 18,	Unknown: 9999
			if (zone_type <= ZoneType.Trade) {
				if (zone_type === ZoneType.Trade) {
					if (puzzle_1.type === PuzzleType.U2 && puzzle_1.item_1 === item_id) {
						Message("YodaDocument::GetNewPuzzleId => 0x%x (%d)\n", puzzleIDs[puzzle_idx], puzzleIDs[puzzle_idx]);
						return puzzleIDs[puzzle_idx];
					}
				} else if (zone_type === ZoneType.Goal && puzzle_1.type === PuzzleType.U3 && puzzle_1.item_1 === item_id) {
					Message("YodaDocument::GetNewPuzzleId => 0x%x (%d)\n", puzzleIDs[puzzle_idx], puzzleIDs[puzzle_idx]);
					return puzzleIDs[puzzle_idx];
				}
				if (!break_from_loop) {
					++puzzle_idx;
					if (puzzle_idx >= count)
						break_from_loop = true;
					if (!break_from_loop)
						continue;
				} else return -1;
			}
			if (zone_type !== ZoneType.Use)
				break;

			if (puzzle_1.type === PuzzleType.U1 && puzzle_1.item_1 === item_id) {
				Message("YodaDocument::GetNewPuzzleId => 0x%x (%d)\n", puzzleIDs[puzzle_idx], puzzleIDs[puzzle_idx]);
				return puzzleIDs[puzzle_idx];
			}
			if (!break_from_loop) {
				++puzzle_idx;
				if (puzzle_idx >= count)
					break_from_loop = true;
				if (!break_from_loop)
					continue;
			} else return -1;

			Message("YodaDocument::GetNewPuzzleId => 0x%x (%d)\n", -1, -1);
			return -1;
		}

		if (zone_type !== ZoneType.Unknown || puzzle_1.type !== PuzzleType.End) {
			if (!break_from_loop) {
				++puzzle_idx;
				if (puzzle_idx >= count)
					break_from_loop = true;
				if (!break_from_loop)
					console.log("IF THIS EVER HAPPENS WE'D HAVE TO JUMP BACK INTO THE LOOP AND CONTINUE\n");
			} else return -1;
		}

		Message("YodaDocument::GetNewPuzzleId => 0x%x (%d)\n", puzzleIDs[puzzle_idx], puzzleIDs[puzzle_idx]);
		return puzzleIDs[puzzle_idx];
	}

	getZoneIDWithType(type_1, a3, a4, item_id_1, item_id_2, item_id_3, a8) {
		Message("YodaDocument::GetZoneIdWithType(%d, %d, %d, %d, %d, %d, %d)\n", type_1, a3, a4, item_id_1, item_id_2, item_id_3, a8);

		// item_id_1 = first required quest.itemID, last required quest.itemID
		let usableZoneIDs = [];
		const zoneCount = this.getZoneCount();
		for (let zoneIndex = 0; zoneIndex < zoneCount; zoneIndex++) {
			let zone = this.getZoneByID(zoneIndex);
			if (zone === -1 || !zone || zone.planet !== this._planet)
				continue;

			switch (type_1) {
				case ZoneType.Empty:
				case ZoneType.BlockadeNorth:
				case ZoneType.BlockadeSouth:
				case ZoneType.BlockadeWest:
				case ZoneType.BlockadeEast:
				case ZoneType.TravelStart:
				case ZoneType.TravelEnd:
				case ZoneType.Goal:
				case ZoneType.Town:
				case ZoneType.Trade:
				case ZoneType.Use:
					if (zone.type === type_1)
						usableZoneIDs.push(zoneIndex);
					break;
				case ZoneType.Find:
				case ZoneType.FindTheForce:
					{ // ?
						if (zone.type === ZoneType.Find || zone.type === ZoneType.FindTheForce)
							usableZoneIDs.push(zoneIndex);
						break;
					}
				default:
					break;
			}
		}

		if (usableZoneIDs.length === 0) {
			// Message("YodaDocument::getZoneIDWithType => %d\n", -1);
			return -1;
		}

		usableZoneIDs.shuffle();

		for (let idx = 0; idx < usableZoneIDs.length; idx++) {
			let puzzle_id = 0;
			let zone_type = 0;
			let item_id = [null, null];
			let item_ids = 0;

			let zoneId = usableZoneIDs[idx];
			let zone = this.getZoneByID(zoneId);
			if (this.worldContainsZoneId(zoneId) && (type_1 !== ZoneType.Goal || this.document.puzzles_can_be_reused <= 0))
				continue;

			switch (type_1) {
				case ZoneType.Empty:
					if (this.field_2E64) {
						const count = zone.hotspots.length;
						if (count <= 0) {
							// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
							return zoneId;
						}
						// used to iterate through all teleporter hotspots here
					} else if (zone.type === ZoneType.Empty) {
						// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
						return zoneId;
					}
					continue;
				case ZoneType.BlockadeNorth:
					if (zone.type !== ZoneType.BlockadeNorth || !this.SetupRequiredItemForZone_(zoneId, item_id_3, 0)) {
						continue;
					}
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.BlockadeSouth:
					if (zone.type !== ZoneType.BlockadeSouth || !this.SetupRequiredItemForZone_(zoneId, item_id_3, 0)) {
						continue;
					}
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.BlockadeWest:
					if (zone.type !== ZoneType.BlockadeWest || !this.SetupRequiredItemForZone_(zoneId, item_id_3, 0))
						continue;
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.BlockadeEast:
					if (zone.type !== ZoneType.BlockadeEast || !this.SetupRequiredItemForZone_(zoneId, item_id_3, 0))
						continue;
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.TravelStart:
					if (zone.type !== ZoneType.TravelStart || !this.SetupRequiredItemForZone_(zoneId, item_id_3, 0))
						continue;
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.TravelEnd:
					if (zone.type !== ZoneType.TravelEnd || !this.SetupRequiredItemForZone_(zoneId, item_id_3, 0))
						continue;
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.Goal:
					if (zone.type !== ZoneType.Goal)
						continue;
					if (!this.ZoneHasProvidedItem(zoneId, item_id_1))
						continue;
					if (!this.ZoneHasProvidedItem(zoneId, item_id_2))
						continue;

					let newItem0 = this.GetItemIDThatsNotRequiredYet(zoneId, a3, 0);
					let newItem1 = this.GetItemIDThatsNotRequiredYet(zoneId, a4, 1);
					if (newItem0 < 0 || newItem1 < 0)
						continue;
					let newItem2 = this.GetNewPuzzleId(newItem0, item_id_1, ZoneType.Goal, !a3);
					if (newItem2 >= 0) this.puzzleIDs.push(newItem2);
					puzzle_id = this.GetNewPuzzleId(newItem1, item_id_2, ZoneType.Goal, !a3);
					if (puzzle_id >= 0) {
						this.puzzleIDs.push(puzzle_id);
					}
					if (newItem2 < 0 || puzzle_id < 0)
						continue;

					this.puzzleIDs_1[a3] = newItem2;
					this.puzzleIDs_2[a4] = puzzle_id;
					if (!this.Unknown_7(zoneId, a3, a4, item_id_3, a8)) {
						this.puzzleIDs_1[a3] = -1;
						this.puzzleIDs_2[a4] = -1;
						continue;
					}
					this.AddRequiredQuestWithItemID(item_id[0], item_id_3);
					this.AddRequiredQuestWithItemID(item_ids, item_id_3);
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.Town:
					if (zone.type !== ZoneType.Town) continue;
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.Trade:
					if (zone.type !== ZoneType.Trade) continue;
					if (!this.ZoneHasProvidedItem(zoneId, item_id_1)) continue;
					let newItem38 = this.GetItemIDThatsNotRequiredYet(zoneId, a3, 0);
					if (newItem38 < 0) continue;
					let newItem25 = this.GetNewPuzzleId(newItem38, item_id_1, ZoneType.Trade, !a3);
					if (newItem25 < 0) continue;

					if (a8)
						this.puzzleIDs_1[a3] = newItem25;
					else
						this.puzzleIDs_2[a3] = newItem25;

					if (!this.Unknown_1(zoneId, a3, item_id_3, a8)) continue;

					this.puzzleIDs.push(newItem25);
					this.AddRequiredQuestWithItemID(newItem38, item_id_3);

					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				case ZoneType.Use:
					{
						if (zone.type !== ZoneType.Use)
							continue;
						if (!this.ZoneHasProvidedItem(zoneId, item_id_1))
							continue;
						let puzzleID1 = this.GetItemIDThatsNotRequiredYet(zoneId, a3, 0);
						if (puzzleID1 < 0) continue;

						let puzzleID2 = this.GetNewPuzzleId(puzzleID1, item_id_1, ZoneType.Use, !a3);
						if (puzzleID2 < 0) continue;

						if (a8)
							this.puzzleIDs_1[a3] = puzzleID2;
						else
							this.puzzleIDs_2[a3] = puzzleID2;

						if (!this.useIDsFromArray1(zoneId, a3, item_id_3, a8)) continue;
						this.puzzleIDs.push(puzzleID2);

						this.AddRequiredQuestWithItemID(puzzleID1, item_id_3);
						// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
						return zoneId;
					}
				case ZoneType.Find:
					zone_type = zone.type;
					if ((zone_type !== ZoneType.Find && zone_type !== ZoneType.FindTheForce) || !this.AssociateItemWithZoneHotspot(zoneId, item_id_1, item_id_3)) {
						continue;
					}
					// Message("YodaDocument::getZoneIDWithType => %d\n", zoneId);
					return zoneId;
				default:
					continue;
			}
		}

		// Message("YodaDocument::getZoneIDWithType => %d\n", -1);
		return -1;
	}

	Unknown_5(world) {
		Message("YodaDocument::Unknown_5(...)\n");
		let result = false;
		let zoneID = 0;
		let zone = null;
		let worldSize = this._size;
		let zoneID_1 = 0;
		let someX = 0;
		let someY = 0;

		this.AddProvidedQuestWithItemID(Type.THE_FORCE, 2);
		this.AddProvidedQuestWithItemID(Type.LOCATOR, 1);

		let x_1 = 0,
			y_1 = 0;
		// int do_second_part = this.providedItemQuests.length == 0;
		let do_second_part = true;

		for (let quest of this.providedItemQuests) {
			let x = 0,
				y = 0;
			let xref = {
					value: x
				},
				yref = {
					value: y
				};
			if (!this.findPlaceToPutPuzzle(quest.unknown, world, xref, yref)) {
				Message("YodaDocument::Unknown_5 => 0\n");
				return false;
			}

			x = xref.value;
			y = yref.value;

			let zoneID = this.getZoneIDWithType(ZoneType.Find, -1, -1, quest.itemID, -1, quest.unknown, 0);
			if (zoneID < 0) {
				Message("YodaDocument::Unknown_5 => %d\n", 0);
				return false;
			}

			let idx = x + 10 * y;
			this.world.index(idx).zoneType = ZoneType.Find;
			this.world.index(idx).zoneId = zoneID;
			this.world.index(idx).findItemID = this.wg_last_added_item_id;
			this.worldZones[idx] = this.getZoneByID(zoneID);
			world[idx] = WorldItemType.Puzzle;

			this.addZoneWithIDToWorld(zoneID);
		}

		if (do_second_part) {
			Message("YodaDocument::Unknown_5 -> cleanup\n");
			// for(let quest of this.providedItemQuests) {
			//delete quest;
			// }
			this.providedItemQuests.clear();
			this.item_ids.clear();

			someX = 0;
			zoneID_1 = -1;

			let x = 0,
				y = 0;
			for (y = 0; y < 10; y++) {
				for (x = 0; x < 10; x++) {
					let intermediate_puzzle_item = world[x + 10 * y];
					if (intermediate_puzzle_item === 1 || intermediate_puzzle_item === WorldItemType.Candidate || intermediate_puzzle_item === WorldItemType.Island) {
						let distance = GetDistanceToCenter(x, y);
						this.field_2E64 = intermediate_puzzle_item === WorldItemType.Island || distance < 2;

						if (this.field_2E64) {
							zoneID = this.getZoneIDWithType(ZoneType.Empty, -1, -1, -1, -1, distance, 0);
						} else if (x_1) { // used to be x
							zoneID = zoneID_1;
						} else {
							zoneID = this.getZoneIDWithType(ZoneType.Empty, -1, -1, -1, -1, distance, 0);
						}

						if (zoneID < 0) {
							Message("YodaDocument::Unknown_5 => %d\n", 0);
							return false;
						}

						while (1) {
							zone = this.getZoneByID(zoneID);
							if (this.field_2E64) break;

							let has_teleporter = 0;
							for (let hotspot of zone.hotspots) {
								if (hotspot.type === Type.Teleporter) {
									has_teleporter = 1;
									break;
								}
							}

							if (!has_teleporter)
								break;

							Message("y = %d\n", y_1);
							if (!y_1) {
								y_1 = 1;
								someY = x;
								someX = y;
								Message("x = %d\n", x_1);
								if (!x_1) break;

								x_1 = 0;
								zoneID_1 = -1;
								break;
							}

							if (worldSize === WorldSize.SMALL) {
								if (Math.abs(someY - x) > 1 || Math.abs(someX - y) > 1) {
									y_1++;
									someY = x;
									someX = y;
									Message("x = %d\n", x_1);
									if (!x_1)
										break;

									x_1 = 0;
									zoneID_1 = -1;
									break;
								}
							} else if (worldSize === WorldSize.MEDIUM) {
								if (Math.abs(someY - x) > 1 || Math.abs(someX - y) > 1) {
									y_1++;
									someY = x;
									someX = y;
									Message("x_1 = %d\n", x_1);
									if (!x_1)
										break;

									x_1 = 0;
									zoneID_1 = -1;
									break;
								}
							} else {
								if (worldSize !== WorldSize.LARGE) break;
								if (Math.abs(someY - x) > 2 || Math.abs(someX - y) > 2) {
									y_1++;
									someY = x;
									someX = y;
									Message("x = %d\n", x_1);
									if (!x_1)
										break;

									x_1 = 0;
									zoneID_1 = -1;
									break;
								}
							}
							zoneID_1 = zoneID;
							x_1 = 1;
							zoneID = this.getZoneIDWithType(ZoneType.Empty, -1, -1, -1, -1, distance, 0);
							if (zoneID < 0) {
								Message("YodaDocument::Unknown_5 => %d\n", 0);
								return false;
							}
						}

						let idx = x + 10 * y;
						this.worldZones[idx] = zone;
						this.world.index(idx).zoneId = zoneID;
						this.world.index(idx).zoneType = ZoneType.Empty;
						this.world.index(idx).unknown606 = -1;
						this.world.index(idx).requiredItemID = -1;
						this.world.index(idx).npcID = -1;
						this.world.index(idx).findItemID = -1;

						this.addZoneWithIDToWorld(zoneID);

						if (zoneID === zoneID_1) {
							zoneID_1 = -1;
							x_1 = 0;
						}
					}
				}
			}

			Message("y = %d\n", y_1);
			if (y_1 === 1) {
				let y = someX;
				let x = someY;
				this.field_2E64 = 1;

				let distance = GetDistanceToCenter(x, y);
				let zoneID = this.getZoneIDWithType(ZoneType.Empty, -1, -1, -1, -1, distance, 0);
				if (zoneID !== -1) {
					let idx = x + 10 * y;
					this.world.index(idx).zoneType = 1;
					this.world.index(idx).zoneId = zoneID;
					this.world.index(idx).unknown606 = -1;
					this.world.index(idx).requiredItemID = -1;
					this.world.index(idx).findItemID = -1;
					this.worldZones[idx] = this.getZoneByID(zoneID);

					this.addZoneWithIDToWorld(zoneID);
				}
			}
			Message("YodaDocument::Unknown_5 => 1\n");
			return true;
		}

		Message("YodaDocument::Unknown_5 => %d\n", result);
		return result;
	}


	Unknown_1(zoneId, a3, distance, a8) {
		Message("YodaDocument::Unknown_1(%d, %d, %d, %d)\n", zoneId, a3, distance, a8);
		if (false) return false;
		if (false) return false;

		if (false === 0xF) return false;
		if (false > 0) return false;

		let puzzleID1,
			puzzleID2;
		if (a8) { // assumes a8 is 1
			puzzleID1 = this.puzzleIDs_1[a3];
			puzzleID2 = this.puzzleIDs_1[a3 + 1];
		} else {
			puzzleID1 = this.puzzleIDs_2[a3];
			puzzleID2 = this.puzzleIDs_2[a3 + 1];
		}

		let p1,
			p2;
		p1 = this._getPuzzle(puzzleID1);
		p2 = this._getPuzzle(puzzleID2);

		if (!p1) return false;
		if (!p2) return false;

		this.AddRequiredQuestWithItemID(p1.item_1, distance);
		this.AddRequiredQuestWithItemID(p2.item_1, distance);

		if (!this.RequiredItemForZoneWasNotPlaced(zoneId)) {
			this.RemoveQuestRequiringItem(p1.item_1);
			// RemoveQuestRequiringItem(0);

			Message("YodaDocument::Unknown_1 => 0\n");
			return false;
		}

		if (this.ChooseItemIDFromZone_1(zoneId, puzzleID1, distance, p1.item_1, 0) >= 0) {
			this.Unknown_14(zoneId, puzzleID1, distance, p2.item_1);
		}

		this.addRequiredItemQuestsFromHotspots(zoneId);

		Message("YodaDocument::Unknown_1 => %d\n", 1);
		return true;
	}


	Unknown_14(zoneID, a3, distance, providedItemID) {
		Message("YodaDocument::Unknown_14(%d, %d, %d, %d)\n", zoneID, a3, distance, providedItemID);
		if (zoneID < 0) return false;

		let zone = this.getZoneByID(zoneID);

		for (let itemID of zone.providedItemIDs) {
			if (itemID === providedItemID) {
				let hotspots = [];
				for (let hotspot of zone.hotspots) {
					if (hotspot.type === Type.TriggerLocation) {
						hotspots.push(hotspot);
					}
				}

				if (hotspots.length) {
					this.AddRequiredQuestWithItemID(itemID, distance);
					this.wg_last_added_item_id = providedItemID;

					let hotspot = hotspots[rand() % hotspots.length];
					hotspot.arg = providedItemID;
					hotspot.enabled = true;

					Message("YodaDocument::Unknown_14 => %d\n", 1);
					return true;
				}
				break;
			}
		}

		for (let hotspot of zone.hotspots) {
			if (hotspot.type === HotspotType.DoorIn) {
				let result = this.Unknown_14(hotspot.arg, a3, distance, providedItemID);
				if (result) {
					Message("YodaDocument::Unknown_14 => %d\n", result);
					return result;
				}
			}
		}

		Message("YodaDocument::Unknown_14 => %d\n", 0);
		return false;
	}

	WritePlanetValues() {
		/*
		 switch (this.planet) {
		 case Planet.TATOOINE: doc.WriteTatooineValues(); break;
		 case Planet.HOTH: doc.WriteHothValues(); break;
		 case Planet.ENDOR: doc.WriteEndorValues(); break;
		 }
		 */
	}

	PuzzleUsedInLastGame( /*puzzle_id, planet*/ ) {
		return false;
	}

	placeHotspotTiles(zoneId) {
		const zone = this.getZoneByID(zoneId);
		zone.hotspots.filter((htsp) => htsp.enabled).forEach((hotspot) => {
			let tile = null;

			switch (hotspot.type) {
				case HotspotType.TriggerLocation:
				case HotspotType.SpawnLocation:
				case HotspotType.ForceLocation:
				case HotspotType.LocatorThingy:
				case HotspotType.CrateItem:
				case HotspotType.PuzzleNPC:
				case HotspotType.CrateWeapon:
					if (hotspot.arg < 0) break;

					tile = zone.getTile(hotspot.x, hotspot.y, 1);
					if (tile) break;

					zone.setTile(hotspot.x, hotspot.y, 1, hotspot.arg);
					break;
				case HotspotType.Unused:
					hotspot.arg = TILE_ADEGAN_CRYSTAL;

					tile = zone.getTile(hotspot.x, hotspot.y, 1);
					if (tile) break;

					zone.setTile(hotspot.x, hotspot.y, 1, 0x1CB);
					break;
				default:
					break;
			}
		});
	}

	containsPuzzleID(puzzle_id) {
		for (let id of this.puzzleIDs)
			if (id === puzzle_id) return true;

		return false;
	}

	ZoneHasItem(zoneID, targetItemID, a4) {
		Message("YodaDocument::ChooseItemIDFromZone_2(%d, %d, %d)\n", zoneID, targetItemID, a4);
		let zone = this.getZoneByID(zoneID);
		if (!zone) return false;

		let itemIDs = a4 ? zone.assignedItemIDs : zone.requiredItemIDs;
		for (let itemID of itemIDs)
			if (itemID === targetItemID)
				return true;

		for (let hotspot of zone.hotspots)
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg >= 0)
				if (this.ZoneHasItem(hotspot.arg, targetItemID, a4))
					return true;

		return false;
	}

	HasQuestRequiringItem(itemID) {
		console.assert(Number.isInteger(itemID));
		Message("YodaDocument::HasQuestRequiringItem(%d)\n", itemID);
		for (let quest of this.requiredItemQuests)
			if (quest.itemID === itemID) {
				// Message("YodaDocument::HasQuestRequiringItem => 1\n");
				return true;
			}

			// Message("YodaDocument::HasQuestRequiringItem => 0\n");
		return false;
	}

	AddProvidedQuestWithItemID(itemID, maximumDistance) {
		if (itemID === null) return null;
		Message("YodaDocument::AddProvidedQuestWithItemID(%d, %d)\n", itemID, maximumDistance);
		console.assert(Number.isInteger(itemID));
		console.assert(Number.isInteger(maximumDistance));

		let quest = this.providedItemQuests.find(quest => quest.itemID === itemID);
		if (!quest) {
			quest = new Quest(itemID, maximumDistance);
			this.providedItemQuests.unshift(quest);
		}

		return quest;
	}

	AddRequiredQuestWithItemID(itemID, maximumDistance) {
		if (itemID === null) return null;
		console.assert(Number.isInteger(itemID), 'itemID argument must be an integer');
		console.assert(Number.isInteger(maximumDistance), 'maxiumDistance argument must be an integer');

		Message("YodaDocument::AddRequiredQuestWithItemID(%d, %d)\n", itemID, maximumDistance);
		let quest = new Quest(itemID, maximumDistance);
		this.requiredItemQuests.push(quest);

		return quest;
	}

	RemoveQuestProvidingItem(itemID) {
		console.assert(Number.isInteger(itemID));
		Message("YodaDocument::RemoveQuestProvidingItem(%d)\n", itemID);

		for (let i = 0; i < this.providedItemQuests.length; i++)
			if (this.providedItemQuests[i].itemID === itemID) {
				this.providedItemQuests.splice(i, 1);
				return;
			}
	}

	RemoveQuestRequiringItem(itemID) {
		console.assert(Number.isInteger(itemID));
		Message("YodaDocument::RemoveQuestRequiringItem(%d)\n", itemID);

		for (let i = 0; i < this.requiredItemQuests.length; i++)
			if (this.requiredItemQuests[i].itemID === itemID) {
				this.requiredItemQuests.splice(i, 1);
				return;
			}
	}

	RequiredItemForZoneWasNotPlaced(zoneId) {
		Message("YodaDocument::ZoneDoesNOTProvideRequiredItemID(%d)\n", zoneId);
		let zone = this.getZoneByID(zoneId);
		if (!zone) {
			Message("YodaDocument::ZoneDoesNOTProvideRequiredItemID => 0\n");
			return false;
		}

		for (let hotspot of zone.hotspots) {
			if (hotspot.arg <= 0) continue;

			switch (hotspot.type) {
				case HotspotType.DoorIn:
					if (!this.RequiredItemForZoneWasNotPlaced(hotspot.arg)) {
						Message("YodaDocument::ZoneDoesNOTProvideRequiredItemID => 0\n");
						return false;
					}
					break;

				case Type.CrateItem:
				case Type.PuzzleNPC:
				case Type.CrateWeapon:
					if (this.HasQuestRequiringItem(hotspot.arg)) {
						Message("YodaDocument::ZoneDoesNOTProvideRequiredItemID => 0\n");
						return false;
					}
					break;

				default:
					break;
			}
		}

		Message("YodaDocument::ZoneDoesNOTProvideRequiredItemID => 1\n");
		return true;
	}


	ChooseItemIDFromZone(zoneID, itemID, fromAssignedItems) {
		Message("YodaDocument::ChooseItemIDFromZone(%d, %d, %d)\n", zoneID, itemID, fromAssignedItems);
		let zone = this.getZoneByID(zoneID);
		if (!zone) return -1;

		let itemIDs = fromAssignedItems ? zone.assignedItemIDs : zone.requiredItemIDs;
		for (let candidate of itemIDs) {
			if (candidate === itemID) {
				Message("YodaDocument::ChooseItemIDFromZone => %x\n", candidate);
				return candidate;
			}
		}

		for (let hotspot of zone.hotspots) {
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg >= 0) {
				let result = this.ChooseItemIDFromZone(hotspot.arg, itemID, fromAssignedItems);
				if (result >= 0) {
					Message("YodaDocument::ChooseItemIDFromZone => %x\n", result);
					return result;
				}
			}
		}

		Message("YodaDocument::ChooseItemIDFromZone => %x\n", -1);
		return -1;
	}

	getZoneIDAt(x, y) {
		if (x + y * 10 < 0) return null;
		if (100 <= x + 10 * y) return null;

		return this.world.index(x + 10 * y).zoneId;
	}

	getLocationOfZoneWithID(zoneID, xOut, yOut) {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (this.world.index(x + 10 * y).zoneId === zoneID) {
					xOut.value = x;
					yOut.value = y;
					return true;
				}
			}
		}

		return false;
	}

	worldContainsZoneId(zoneID) {
		Message("YodaDocument::WorldContainsZoneId(%d)\n", zoneID);
		for (let chosenZoneID of this.chosenZoneIDs)
			if (chosenZoneID === zoneID) {
				Message("YodaDocument::WorldContainsZoneId => 1\n");
				return true;
			}
		Message("YodaDocument::WorldContainsZoneId => 0\n");
		return false;
	}

	addZoneWithIDToWorld(zoneID) {
		Message("YodaDocument::AddZoneWithIdToWorld(%d)\n", zoneID);
		if (zoneID >= this.getZoneCount()) {
			console.log("Invalid Zone ID\n");
			return;
		}

		this.chosenZoneIDs.unshift(zoneID);
	}

	addRequiredItemQuestsFromHotspots(zoneID) {
		Message("YodaDocument::AddRequiredItemsFromHotspots(%d)\n", zoneID);
		let zone = this.getZoneByID(zoneID);
		for (let hotspot of zone.hotspots) {
			switch (hotspot.type) {
				case Type.CrateItem:
				case Type.PuzzleNPC:
				case Type.CrateWeapon:
					if (hotspot.arg !== -1)
						this.AddRequiredQuestWithItemID(hotspot.arg, -1);
					break;
				case HotspotType.DoorIn:
					if (hotspot.arg !== -1)
						this.addRequiredItemQuestsFromHotspots(hotspot.arg);
					break;
				default:
					break;
			}
		}
	}

	findUnusedNPCForZone(zoneId) {
		Message("YodaDocument::ChoosePuzzleNPCForZone(%d)\n", zoneId);
		let zone = this.getZoneByID(zoneId);
		if (!zone) {
			Message("YodaDocument::ChoosePuzzleNPCForZone => %d\n", -1);
			return -1;
		}

		let npcCandidates = [];
		for (let npcTileID of zone.puzzleNPCTileIDs) {
			if (!this.HasQuestRequiringItem(npcTileID))
				npcCandidates.push(npcTileID);
		}

		if (npcCandidates.length) {
			let idx = rand() % npcCandidates.length;
			Message("YodaDocument::ChoosePuzzleNPCForZone => %d\n", npcCandidates[idx]);
			return npcCandidates[idx];
		}

		for (let hotspot of zone.hotspots) {
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg >= 0) {
				let result = this.findUnusedNPCForZone(hotspot.arg);
				if (result >= 0) {
					Message("YodaDocument::ChoosePuzzleNPCForZone => %d\n", result);
					return result;
				}
			}
		}

		Message("YodaDocument::ChoosePuzzleNPCForZone => %d\n", -1);
		return -1;
	}

	hasPuzzleNPC(zoneID, targetNPCID) {
		Message("YodaDocument::hasPuzzleNPC(%d, %d)\n", zoneID, targetNPCID);

		let zone = this.getZoneByID(zoneID);
		if (!zone) return false;

		if (targetNPCID === -1) {
			console.log("Is this really a valid call?\n");
			return zone.puzzleNPCTileIDs.length !== 0;
		}

		for (let npcID of zone.puzzleNPCTileIDs)
			if (npcID === targetNPCID) {
				Message("YodaDocument::hasPuzzleNPC => 1");
				return true;
			}

		for (let hotspot of zone.hotspots)
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1)
				if (this.hasPuzzleNPC(hotspot.arg, targetNPCID)) {
					Message("YodaDocument::hasPuzzleNPC => 1");
					return true;
				}

		Message("YodaDocument::hasPuzzleNPC => 0");
		return false;
	}

	ZoneHasProvidedItem(zoneID, itemID) {
		Message("YodaDocument::ZoneLeadsToItem(%d, %d)\n", zoneID, itemID);
		let zone = this.getZoneByID(zoneID);
		for (let itemIDInZone of zone.providedItemIDs)
			if (itemIDInZone === itemID) {
				Message("YodaDocument::ZoneLeadsToItem => 1\n");
				return true;
			}

		for (let hotspot of zone.hotspots)
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1 && this.ZoneHasProvidedItem(hotspot.arg, itemID)) {
				Message("YodaDocument::ZoneLeadsToItem => 1\n");
				return true;
			}

		Message("YodaDocument::ZoneLeadsToItem => 0\n");
		return false;
	}


	ChooseSpawnForPuzzleNPC(zoneID, npcID) {
		Message("YodaDocument::ChooseSpawnForPuzzleNPC(%d, %d)\n", zoneID, npcID);
		let zone = this.getZoneByID(zoneID);
		if (!zone) {
			Message("YodaDocument::ChooseSpawnForPuzzleNPC => %d\n", -1);
			return -1;
		}

		let hotspotCandidates = [];
		for (let npcTileID of zone.puzzleNPCTileIDs) {
			if (npcTileID !== npcID) continue;

			hotspotCandidates.clear();
			for (let hotspot of zone.hotspots) {
				if (hotspot.type === Type.SpawnLocation && hotspot.arg === -1) {
					hotspotCandidates.push(hotspot);
				}
			}

			if (hotspotCandidates.length) {
				let idx = rand() % hotspotCandidates.length;
				let hotspot = hotspotCandidates[idx];

				hotspot.arg = npcID;
				hotspot.enabled = true;
				this.wg_npc_id = npcID;

				Message("YodaDocument::ChooseSpawnForPuzzleNPC => %d\n", npcID);
				return npcID;
			}
		}

		for (let hotspot of zone.hotspots) {
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1) {
				let result = this.ChooseSpawnForPuzzleNPC(hotspot.arg, npcID);
				if (result !== -1) {
					Message("YodaDocument::ChooseSpawnForPuzzleNPC => %d\n", result);
					return result;
				}
			}
		}

		Message("YodaDocument::ChooseSpawnForPuzzleNPC => %d\n", -1);
		return -1;
	}


	PuzzleIsGoal(puzzle_id, planet) {
		if (planet === Planet.TATOOINE) {
			switch (puzzle_id) {
				case Type.GOAL_FALCON:
				case Type.GOAL_HAN:
				case Type.GOAL_AMULET:
				case Type.GOAL_ADEGAN_CRYSTAL:
				case Type.GOAL_THREEPIOS_PARTS:
					return true;
				default:
					return false;
			}
		}

		if (planet === Planet.HOTH) {
			switch (puzzle_id) {
				case Type.GOAL_GENERAL_MARUTZ:
				case Type.GOAL_HIDDEN_FACTORY:
				case Type.GOAL_WARN_THE_REBELS:
				case Type.GOAL_RESCUE_YODA:
				case Type.GOAL_CAR:
					return true;
				default:
					return false;
			}
		}

		if (planet === Planet.ENDOR) {
			switch (puzzle_id) {
				case Type.GOAL_FIND_LEIA:
				case Type.GOAL_IMPERIAL_BATTLE_STATION:
				case Type.GOAL_LANTERN_OF_SACRED_LIGHT:
				case Type.GOAL_IMPERIAL_BATTLE_CODE:
				case Type.GOAL_RELAY_STATION:
					return true;
				default:
					return false;
			}
		}

		return false;
	}

	GetItemIDThatsNotRequiredYet(zoneID, unused, use_array_2_ids) {
		Message("YodaDocument::GetItemIDThatsNotRequiredYet(%d, %d, %d)\n", zoneID, unused, use_array_2_ids);
		let itemIDs = [];
		let zone = this.getZoneByID(zoneID);

		let zoneItemIds = use_array_2_ids ? zone.assignedItemIDs : zone.requiredItemIDs;
		for (let itemID of zoneItemIds) {
			if (!this.HasQuestRequiringItem(itemID))
				itemIDs.push(itemID);
		}

		if (itemIDs.length)
			return itemIDs[rand() % itemIDs.length];

		for (let hotspot of zone.hotspots) {
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg !== -1) {
				let itemID = this.GetItemIDThatsNotRequiredYet(hotspot.arg, unused, use_array_2_ids);
				if (itemID !== -1) return itemID;
			}
		}

		return -1;
	}

	findPlaceToPutPuzzle(maxDistance, world, xref, yref) {
		Message("YodaDocument::place_puzzles__(%d, .., .., ..)\n", maxDistance);
		let farPoints = [];
		let bestPoints = [];
		let pointsCloseToPuzzles = [];

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				let idx = x + 10 * y;
				let item = world[idx];
				let point = new Point(x, y);
				if (GetDistanceToCenter(x, y) > maxDistance) {
					if (item === 1) {
						Message("1) %dx%d\n", x, y);
						farPoints.push(point);
					} else; //delete point;
				} else if (item === 1 || item === WorldItemType.Candidate) {
					Message("2) %dx%d\n", x, y);
					if ((x < 1 || world[idx - 1] !== WorldItemType.Puzzle) && (x > 8 || world[idx + 1] !== WorldItemType.Puzzle) && (y < 1 || world[idx - 10] !== WorldItemType.Puzzle) && (y > 8 || world[idx + 10] !== WorldItemType.Puzzle))
						bestPoints.push(point);
					else
						pointsCloseToPuzzles.push(point);
				} else; //delete point;
			}
		}

		let idx = 0;
		let array = null;
		if (bestPoints.length) {
			idx = rand() % bestPoints.length;
			array = bestPoints;
		} else if (pointsCloseToPuzzles.length) {
			idx = rand() % pointsCloseToPuzzles.length;
			array = pointsCloseToPuzzles;
		} else if (farPoints.length) {
			idx = rand() % farPoints.length;
			array = farPoints;
		} else {
			Message("No Place to put puzzle!\n");
			return false;
		}

		if (array) {
			let chosenPoint = array[idx];
			xref.value = chosenPoint.x;
			yref.value = chosenPoint.y;
			Message("YodaDocument::place_puzzles__: %dx%d\n", chosenPoint.x, chosenPoint.y);
		}

		farPoints.clear();
		bestPoints.clear();
		pointsCloseToPuzzles.clear();

		return true;
	}

	GetPuzzleCandidates(result, item_id, a3, zone_type /*, a5*/ ) {
		result.clear();

		this.forEachPuzzle((puzzle, puzzleID) => {
			if (zone_type <= ZoneType.Trade) {
				if (zone_type === ZoneType.Trade) {
					if (puzzle.type !== PuzzleType.U2 || this.containsPuzzleID(puzzleID))
						return;
				} else if (zone_type !== ZoneType.Goal || puzzle.type !== PuzzleType.U3 || this.containsPuzzleID(puzzleID)) {
					return;
				}

				result.push(puzzleID);
				return;
			}

			if (zone_type === ZoneType.Use) {
				if (!puzzle.type && !this.containsPuzzleID(puzzleID))
					result.push(puzzleID);
				return;
			}

			if (zone_type !== ZoneType.Unknown || puzzle.type !== PuzzleType.End)
				return;

			if (this.PuzzleUsedInLastGame(puzzleID, this._planet) && this.goalPuzzleID < 0)
				return;

			if (this.PuzzleIsGoal(puzzleID, this._planet)) {
				result.push(puzzleID);
			}
		});
	}

	ChooseItemIDFromZone_0(zoneId, itemID) {
		Message("YodaDocument::ChooseItemIDFromZone_0(%d, %d)\n", zoneId, itemID);
		let hotspotCandidates = [];
		let zone = this.getZoneByID(zoneId);
		if (!zone) return -1;

		Message("v16 = %d\n", 0);

		if (zone.providedItemIDs.contains(itemID)) {
			hotspotCandidates.clear();

			for (let hotspot of zone.hotspots)
				if (hotspot.type === Type.TriggerLocation)
					hotspotCandidates.unshift(hotspot);

			if (hotspotCandidates.length > 0) {
				let idx = rand() % hotspotCandidates.length;
				let hotspot = hotspotCandidates[idx];
				if (hotspot.type === Type.TriggerLocation) {
					hotspot.arg = itemID;
					hotspot.enabled = true;
					Message("YodaDocument::ChooseItemIDFromZone_0 => %d\n", itemID);
					return itemID;
				}
			}
		}

		for (let hotspot of zone.hotspots) {
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg >= 0) {
				let itemID = this.ChooseItemIDFromZone_0(hotspot.arg, itemID);
				if (itemID >= 0) {
					Message("YodaDocument::ChooseItemIDFromZone_0 => %d\n", itemID);
					return itemID;
				}
			}
		}

		Message("YodaDocument::ChooseItemIDFromZone_0 => %d\n", -1);
		return -1;
	}

	ChooseItemIDFromZone_1(zoneID, a3, a4, item_id, a6) {
		Message("YodaDocument::ChooseItemIDFromZone_1(%d, %d, %d, %d, %d)\n", zoneID, a3, a4, item_id, a6);
		if (zoneID < 0) {
			Message("YodaDocument::ChooseItemIDFromZone_1() => %d\n", 0);
			return false;
		}

		let zone = this.getZoneByID(zoneID);
		let itemIDs = a6 ? zone.assignedItemIDs : zone.requiredItemIDs;
		for (let itemID of itemIDs) {
			if (itemID !== item_id) continue;

			for (let hotspot of zone.hotspots) {
				if (hotspot.type === Type.Lock) {
					this.AddRequiredQuestWithItemID(item_id, a4);

					if (a6)
						this.wg_item_id_unknown_3 = item_id;
					else
						this.wg_item_id = item_id;

					hotspot.arg = item_id;
					hotspot.enabled = 1;

					Message("YodaDocument::ChooseItemIDFromZone_1() => %d\n", 1);
					return true;
				}
			}
		}

		for (let hotspot of zone.hotspots) {
			if (hotspot.type === HotspotType.DoorIn) {
				let result = this.ChooseItemIDFromZone_1(hotspot.arg, a3, a4, item_id, a6);
				if (result) {
					Message("YodaDocument::ChooseItemIDFromZone_1() => %d\n", result);
					return result;
				}
			}
		}

		Message("YodaDocument::ChooseItemIDFromZone_1() => %d\n", 0);
		return false;
	}

	useIDsFromArray1(zoneId, a3, item_id_1, a5) {
		Message("YodaDocument::useIDsFromArray1(%d, %d, %d, %d)\n", zoneId, a3, item_id_1, a5);
		let zone = null;
		let v9 = null;
		let v10 = 0;
		let v11 = null;
		let v12 = null;
		let v13 = null;
		let item_id = 0;
		let a3a = 0;
		let a3_2 = null;

		if (zoneId < 0) return false;
		zone = this.getZoneByID(zoneId);

		if (!zone) return false;

		if (zone.type !== ZoneType.Use) return false;
		if (!this.RequiredItemForZoneWasNotPlaced(zoneId)) return false;

		if (a5) {
			if (this.puzzleIDs_1.length - 1 > a3) {
				v9 = this.puzzleIDs_1;
				v10 = v9[a3 + 1];
			} else {
				v10 = -1;
			}
		} else if (this.puzzleIDs_2.length - 1 > a3) {
			v9 = this.puzzleIDs_2;
			v10 = v9[a3 + 1];
		} else
			v10 = -1;

		let v8 = a5 ? this.puzzleIDs_1[a3] : this.puzzleIDs_2[a3];

		v11 = this.data.puzzles;
		v12 = (v11)[v8];
		if (!v12) return false;
		if (v10 < 0) {
			v13 = a3_2;
		} else {
			v13 = (v11)[v10];
			if (!v13) return false;
		}
		item_id = -1;
		a3a = v12.item_1;
		if (v10 >= 0)
			item_id = v13.item_1;
		let npcID = this.findUnusedNPCForZone(zoneId);
		if (npcID < 0) return false;

		let v19 = 1;
		let a3_2a = this.ZoneHasItem(zoneId, a3a, 0);
		if (item_id >= 0)
			v19 = this.ZoneHasProvidedItem(zoneId, item_id);

		if (!a3_2a || !v19) return false;

		let resultingNPCID = this.ChooseSpawnForPuzzleNPC(zoneId, npcID);
		if (resultingNPCID < 0) return false;

		this.wg_npc_id = npcID;
		this.wg_last_added_item_id = item_id;
		this.wg_item_id = a3a;
		this.wg_another_item_id = a3;

		this.AddRequiredQuestWithItemID(npcID, item_id_1);
		this.addRequiredItemQuestsFromHotspots(zoneId);

		return true;
	}

	Unknown_7(zoneId, puzzle_idx, a4, unknown, a6) {
		Message("YodaDocument::Unknown_7(%d, %d, %d, %d, %d)\n", zoneId, puzzle_idx, a4, unknown, a6);
		let zone = null;
		let item = 0;

		zone = this.getZoneByID(zoneId);
		if (!zone) {
			Message("YodaDocument::Unknown_7 => 0\n");
			return false;
		}

		if (zone.type !== ZoneType.Goal) {
			Message("YodaDocument::Unknown_7 => 0\n");
			return false;
		}

		if (!this.RequiredItemForZoneWasNotPlaced(zoneId)) {
			Message("YodaDocument::Unknown_7 => 0\n");
			return false;
		}

		let puzzle1 = this.data.puzzles[this.puzzleIDs_1[puzzle_idx]];
		let puzzle2 = this.data.puzzles[this.puzzleIDs_2[a4]];
		let puzzle3 = this.data.puzzles[this.puzzleIDs_1[puzzle_idx + 1]];

		const npcID = this.findUnusedNPCForZone(zoneId);
		const hasPuzzleNPC = npcID >= 0 ? this.hasPuzzleNPC(zoneId, npcID) : 0;
		puzzle1.hasPuzzleNPC = hasPuzzleNPC;

		let hasItem = true;
		hasItem &= this.ZoneHasItem(zoneId, puzzle1.item_1, 0);
		this.ZoneHasItem(zoneId, puzzle2.item_1, 1);
		hasItem &= this.ZoneHasProvidedItem(zoneId, puzzle3.item_1);
		this.ZoneHasProvidedItem(zoneId, puzzle3.item_2);

		if (!hasItem) {
			Message("YodaDocument::Unknown_7 => 0\n");
			return false;
		}

		if (hasPuzzleNPC) {
			this.addRequiredItemQuestsFromHotspots(zoneId);

			this.wg_npc_id = npcID;
			this.wg_last_added_item_id = item;
			this.wg_item_id_unknown_2 = puzzle1.item_1;
			this.wg_item_id = puzzle1.item_1;
			this.wg_another_item_id = puzzle_idx;
			this.field_3398 = a4;
			this.wg_item_id_unknown_3 = puzzle1.item_1;
			this.addRequiredItemQuestsFromHotspots(zoneId);
			Message("YodaDocument::Unknown_7 => %d\n", true);
			return true;
		}

		let didAddItem = true;
		didAddItem &= this.ChooseItemIDFromZone(zoneId, puzzle1.item_1, 0) !== -1;
		didAddItem &= this.ChooseItemIDFromZone_0(zoneId, puzzle3.item_1) !== -1;

		didAddItem &= this.ChooseItemIDFromZone(zoneId, puzzle2.item_1, 1) !== -1;
		didAddItem &= this.ChooseItemIDFromZone_0(zoneId, puzzle3.item_2) !== -1;

		if (didAddItem) {
			this.AddRequiredQuestWithItemID(puzzle2.item_1, unknown);
			this.AddRequiredQuestWithItemID(puzzle3.item_2, unknown);
			this.AddRequiredQuestWithItemID(puzzle1.item_1, unknown);
			this.AddRequiredQuestWithItemID(puzzle3.item_1, unknown);

			this.wg_npc_id = -1;
			this.wg_last_added_item_id = puzzle3.item_1;
			this.wg_item_id = puzzle1.item_1;
			this.wg_another_item_id = puzzle_idx;
			this.wg_item_id_unknown_2 = puzzle1.item_1;
			this.wg_item_id_unknown_3 = puzzle1.item_1;
			this.field_3398 = a4;
			this.addRequiredItemQuestsFromHotspots(zoneId);
			Message("YodaDocument::Unknown_7 => %d\n", true);

			return true;
		}

		this.RemoveQuestRequiringItem(puzzle1.item_1);
		this.RemoveQuestRequiringItem(item);
		this.RemoveQuestRequiringItem(puzzle1.item_1);
		this.RemoveQuestRequiringItem(puzzle1.item_1);

		Message("YodaDocument::Unknown_7 => %d\n", false);
		return false;
	}

	SetupRequiredItemForZone_(zoneId, arg2, use_required_items_array) {
		Message("YodaDocument::SetupRequiredItemForZone_(%d, %d, %d)\n", zoneId, arg2, use_required_items_array);
		if (zoneId < 0) {
			// Message("YodaDocument::SetupRequiredItemForZone => 0\n");
			return false;
		}

		let zone = this.getZoneByID(zoneId);
		if (zone === null) {
			// Message("YodaDocument::SetupRequiredItemForZone => 0\n");
			return false;
		}

		let count = use_required_items_array ? zone.assignedItemIDs.length : zone.requiredItemIDs.length;
		if (count === 0) {
			// Message("YodaDocument::SetupRequiredItemForZone => 0\n");
			return false;
		}

		if (!this.RequiredItemForZoneWasNotPlaced(zoneId)) {
			// Message("YodaDocument::SetupRequiredItemForZone => 0\n");
			return false;
		}

		let itemArray = use_required_items_array ? zone.assignedItemIDs : zone.requiredItemIDs;
		let itemCandidates = [];
		for (let itemID of itemArray) {
			if (!this.HasQuestRequiringItem(itemID))
				itemCandidates.push(itemID);
		}

		count = itemCandidates.length;
		if (count === 0) {
			// Message("YodaDocument::SetupRequiredItemForZone => 0\n");
			return false;
		}

		let random_item_id = itemCandidates[rand() % count];
		if (zone.providedItemIDs.length === 1) {
			// TODO: this looks broken
			let foundItem = 0;
			for (let itemID of this.item_ids) {
				if (itemID === zone.providedItemIDs[0])
					foundItem = 1;
			}

			if (foundItem) {
				// Message("YodaDocument::SetupRequiredItemForZone => 0\n");
				return false;
			}

			this.item_ids.push(zone.providedItemIDs[0]);
		}

		if (zone.type === ZoneType.TravelStart) {
			this.AddProvidedQuestWithItemID(random_item_id, 5);
		} else {
			// TODO: broken here?
			this.AddProvidedQuestWithItemID(random_item_id, arg2);
		}

		this.AddRequiredQuestWithItemID(random_item_id, arg2);

		this.wg_item_id = random_item_id;
		this.addRequiredItemQuestsFromHotspots(zoneId);

		// Message("YodaDocument::SetupRequiredItemForZone => 1\n");
		return true;
	}

	AssociateItemWithZoneHotspot(zoneId, item_id, a4) {
		// TODO: check if this implementation is broken
		Message("YodaDocument::AssociateItemWithZoneHotspot(%d, %d, %d)\n", zoneId, item_id, a4);
		if (zoneId < 0) {
			Message("YodaDocument::AssociateItemWithZoneHotspot => 0\n");
			return false;
		}
		if (!this.RequiredItemForZoneWasNotPlaced(zoneId)) {
			Message("YodaDocument::AssociateItemWithZoneHotspot => 0\n");
			return false;
		}

		let hotspot_type;
		let tile_specs;

		let zone = this.getZoneByID(zoneId);
		if (!zone) {
			Message("YodaDocument::AssociateItemWithZoneHotspot => 0\n");
			return false;
		}

		if (zone.requiredItemIDs.length > 0 || zone.puzzleNPCTileIDs.length > 0) {
			Message("YodaDocument::AssociateItemWithZoneHotspot => 0\n");
			return false;
		}

		let found_item_id_in_zone_items = 0;
		for (let itemID of zone.providedItemIDs) {
			if (itemID === item_id) {
				found_item_id_in_zone_items = 1;
				break;
			}
		}

		hotspot_type = 0;
		if (found_item_id_in_zone_items) {
			let hotspotCandidates = [];

			tile_specs = this.data.tiles[item_id].specs;
			if (tile_specs & Type.TILE_SPEC_THE_FORCE) {
				hotspot_type = Type.ForceLocation;
			} else if (tile_specs & Type.TILE_SPEC_MAP) {
				hotspot_type = Type.LocatorThingy;
			} else if (tile_specs & Type.TILE_SPEC_USEFUL) {
				hotspot_type = Type.TriggerLocation;
			}

			for (let hotspot of zone.hotspots) {
				if (hotspot.type === hotspot_type)
					hotspotCandidates.push(hotspot);
			}

			if (hotspotCandidates.length) {
				let hotspot = hotspotCandidates[rand() % hotspotCandidates.length];
				hotspot.arg = item_id;
				hotspot.enabled = true;
				this.AddRequiredQuestWithItemID(item_id, a4);
				this.wg_last_added_item_id = item_id;
				this.addRequiredItemQuestsFromHotspots(zoneId);
				Message("YodaDocument::AssociateItemWithZoneHotspot => 1\n");
				return true;
			}

			Message("YodaDocument::AssociateItemWithZoneHotspot => 0\n");
			return false;
		}

		for (let hotspot of zone.hotspots) {
			if (hotspot.type === HotspotType.DoorIn && hotspot.arg >= 0) {
				let result = this.AssociateItemWithZoneHotspot(hotspot.arg, item_id, a4);
				if (result) {
					this.addRequiredItemQuestsFromHotspots(zoneId);

					Message("YodaDocument::AssociateItemWithZoneHotspot => 1\n");
					return true;
				}
			}
		}

		Message("YodaDocument::AssociateItemWithZoneHotspot => 0\n");
		return false;
	}

	_getPuzzle(puzzleID) {
		return this.data.puzzles[puzzleID];
	}

	forEachPuzzle(callback) {
		this.data.puzzles.forEach(callback);
	}

	_getPuzzleItemId(puzzleID) {
		return this.data.puzzles[puzzleID].item_1;
	}

	_getPuzzleItemId2(puzzleID) {
		return this.data.puzzles[puzzleID].item_2;
	}

	getZoneCount() {
		return this.data.zones.length;
	}

	getZoneTypeByZoneID(zoneID) {
		return this.getZoneByID(zoneID).type;
	}

	getZoneByID(zoneID) {
		return this.data.zones[zoneID];
	}

	getZoneID(zone) {
		for (let i = 0, len = this.getZoneCount(); i < len; i++)
			if (this.getZoneByID(i) === zone) return i;

		return -1;
	}
}
