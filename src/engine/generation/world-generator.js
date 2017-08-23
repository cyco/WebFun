import { identity, constantly, Point, srand, rand, VerticalPointRange, HorizontalPointRange } from "/util";
import { console } from "std";
import MapGenerator from "./map-generator";
import WorldItemType from "./world-item-type";
import World from "./world";
import * as Type from "/engine/types";
import { WorldSize } from "/engine/types";
import GetDistanceToCenter from "./distance-to-center";
import { ZoneType, PuzzleType, HotspotType } from "/engine/objects";
import { and, not } from "/util/functional";
import WorldGenerationError from "./world-generation-error";

class WorldGenerator {
	constructor(seed, size, planet, engine) {
		this._seed = seed | 0;
		this._size = size | 0;
		this._planet = planet | 0;
		const data = engine && engine.data;
		this._zones = data._zones;
		this._tiles = data.tiles;
		this._puzzles = data.puzzles;

		this.puzzleZoneIDs = [];
		this.requiredItems = [];
		this.providedItems = [];
		this.goalPuzzleID = -1;

		this.world = null;

		this.mapGenerator = null;
		this.additionalRequiredItemID = -1;
		this.providedItemQuests = [];
		this.puzzleIDs = [];
		this.puzzleIDs1 = [];
		this.puzzleIDs2 = [];
		this.requiredItemQuests = [];
		this.puzzleIndex = -1;
		this.requiredItemID = -1;
		this.findItemID = -1;
		this.npcID = -1;
		this.worldZones = [];
		this.field_2E64 = -1;

		this.puzzles_can_be_reused = 0;

		Object.seal(this);
	}

	generate(seed = undefined) {
		if (seed !== undefined) this._seed = seed;
		srand(this._seed);

		const mapGenerator = this.mapGenerator = new MapGenerator();
		mapGenerator.generate(-1, this._size);

		this.world = new World();
		this.world.zones = this._zones;
		for (let i = 0; i < 100; i++) {
			this.world.index(i).puzzleIdx = mapGenerator.orderMap[i];
		}

		const puzzleCount = mapGenerator.puzzleCount;
		const puzzles1Count = Math.floor(puzzleCount % 2 === 1 ? (puzzleCount + 1) / 2 : puzzleCount / 2 + 1);
		const puzzles2Count = Math.floor(puzzleCount % 2 === 1 ? (puzzleCount + 1) / 2 : puzzleCount / 2);

		this.puzzleIDs1 = Array.Repeat(-1, puzzles1Count + 1);
		this.puzzleIDs2 = Array.Repeat(-1, puzzles2Count + 1);
		this.worldZones = Array.Repeat(null, 100);

		this.puzzleIndex = -1;

		this.puzzleIDs = [];

		this.providedItemQuests = [];
		this.requiredItemQuests = [];

		let goalID = this.goalPuzzleID;
		if (goalID < 0) {
			const puzzle = this.GetUnusedPuzzleRandomly(-1, ZoneType.Unknown);
			if (puzzle)
				goalID = this.goalPuzzleID = puzzle.id
		}
		if (goalID < 0) {
			return false;
		}

		this.puzzleIDs.push(goalID);
		this.puzzleIDs1[puzzles1Count] = goalID;
		this.puzzleIDs2[puzzles2Count] = goalID;

		this.DetermineTransportZones();
		this.DetermineGoalZone(puzzleCount, puzzles2Count, mapGenerator.orderMap);
		this.DetermineQuestZones(puzzleCount, mapGenerator.orderMap);
		this.PlacePuzzlesZones(puzzles2Count - 1, mapGenerator.orderMap);
		this.DetermineBlockadeAndTownZones(mapGenerator.typeMap);

		this.AddProvidedQuestWithItemID(Type.THE_FORCE, 2);
		this.AddProvidedQuestWithItemID(Type.LOCATOR, 1);
		this.DetermineFindZones(mapGenerator.typeMap);
		this.DetermineTeleporters(mapGenerator.typeMap);

		// waste another random number
		rand();

		this.WritePlanetValues();

		return true;
	}

	DetermineTransportZones() {
		const typeMap = this.mapGenerator.typeMap;
		const isTravelTarget = (point) => {
			const index = point.x + point.y * 10;
			return typeMap[index] === WorldItemType.TravelEnd && !this.worldZones[index];
		};

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (typeMap[x + y * 10] !== WorldItemType.TravelStart)
					continue;

				this.resetState();

				const distance = GetDistanceToCenter(x, y);
				const zone = this.GetUnusedZoneRandomly(ZoneType.TravelStart, -1, -1, -1, -1, distance, true);
				if (!zone) continue;

				this.placeZone(x, y, zone.id, ZoneType.TravelStart, {requiredItemID: this.requiredItemID});

				const vehicleHotspot = zone.hotspots.find(htsp => htsp.type === HotspotType.VehicleTo);
				const connectedZoneID = vehicleHotspot ? vehicleHotspot.arg : -1;
				if (connectedZoneID < 0)
					continue;

				let range = null;
				let travelTarget = null;

				// islands on the left
				if (!travelTarget) {
					range = new VerticalPointRange(0, 9, 0);
					travelTarget = range.find(isTravelTarget);
				}

				// islands on top
				if (!travelTarget) {
					range = new HorizontalPointRange(0, 9, 0);
					travelTarget = range.find(isTravelTarget);
				}

				// islands on the right
				if (!travelTarget) {
					range = new VerticalPointRange(0, 9, 9);
					travelTarget = range.find(isTravelTarget);
				}

				// islands on the bottom
				if (!travelTarget) {
					range = new HorizontalPointRange(0, 9, 9);
					travelTarget = range.find(isTravelTarget);
				}

				if (travelTarget) {
					if (this.puzzleZoneIDs.contains(connectedZoneID))
						continue;

					this.placeZone(travelTarget.x, travelTarget.y, connectedZoneID, ZoneType.TravelEnd, {
						requiredItemID: this.requiredItemID
					});
				} else {
					this.RemoveQuestProvidingItem(this.requiredItemID);
					this.placeZone(x, y, -1, ZoneType.None);
				}
			}
		}
	}

	loopWorld(map, callback) {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				callback(map[x + 10 * y], x, y, x + 10 * y, map);
			}
		}
	}

	DetermineBlockadeAndTownZones(map) {
		this.loopWorld(map, (worldItemType, x, y) => {
			const type = worldItemType.toZoneType();
			if (!(type.isBlockadeType() || type === ZoneType.Town))
				return;

			this.resetState();

			const distance = GetDistanceToCenter(x, y);
			let zone = this.GetUnusedZoneRandomly(type, -1, -1, -1, -1, distance, false);
			if (!zone) zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, -1, -1, distance, false);
			if (!zone) return;

			let options = {};
			if (type !== ZoneType.Town) options.requiredItemID = this.requiredItemID;
			this.placeZone(x, y, zone.id, zone.type, options);
		});
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

	PlacePuzzlesZones(puzzleMapIdx, puzzles) {
		for (let puzzleIndex = puzzleMapIdx; puzzleIndex > 0; puzzleIndex--) {
			this.resetState();

			const point = this.findPositionOfPuzzle(puzzleIndex - 1, puzzles);
			const distance = GetDistanceToCenter(point.x, point.y);

			const puzzleID = this.puzzleIDs2[puzzleIndex];
			const item_1 = this._puzzles[puzzleID].item_1;
			let zone = -1;

			let type = rand() % 2 ? ZoneType.Use : ZoneType.Trade;
			zone = this.GetUnusedZoneRandomly(type, puzzleIndex - 1, -1, item_1, -1, distance, false);

			if (!zone) {
				type = type === ZoneType.Use ? ZoneType.Trade : ZoneType.Use;
				zone = this.GetUnusedZoneRandomly(type, puzzleIndex - 1, -1, item_1, -1, distance, false);
			}

			this.errorWhen(!zone, 'Unable to find suitable puzzle zone');

			this.placeZone(point.x, point.y, zone.id, zone.type, {
				findItemID: this.findItemID,
				puzzleIndex: this.puzzleIndex,
				requiredItemID: this.requiredItemID,
				npcID: this.npcID
			});

			this.puzzleIndex = -1;
		}
	}

	DetermineGoalZone(puzzleCount, puzzles2Count, puzzles) {
		this.resetState();

		const puzzleId = this.puzzleIDs1[this.puzzleIDs1.length - 1];
		const pos = this.findPositionOfPuzzle(puzzleCount - 1, puzzles);
		const distance = GetDistanceToCenter(pos.x, pos.y);
		const worldPuzzleIndex = puzzles[pos.x + 10 * pos.y];
		const puzzle = this._puzzles[puzzleId];
		const zone = this.GetUnusedZoneRandomly(ZoneType.Goal, this.puzzleIDs1.length - 2, puzzles2Count - 1, puzzle.item_1, puzzle.item_2, distance, true);
		this.errorWhen(!zone, "Unable to find suitable goal zone.");
		this.placeZone(pos.x, pos.y, zone.id, ZoneType.Goal, {
			findItemID: this.findItemID,
			puzzleIndex: worldPuzzleIndex - 1,
			requiredItemID: this.requiredItemID,
			npcID: -1,
			additionalRequiredItemID: this._puzzles[this.puzzleIDs[2]].item_1
		});
	}

	resetState() {
		this.requiredItemID = -1;
		this.findItemID = -1;
		this.npcID = -1;
		this.puzzleIndex = -1;
		this.additionalRequiredItemID = -1;
	}

	DetermineQuestZones(puzzleCount, puzzles) {
		let previousPuzzleIndex = puzzleCount - 1;
		for (let puzzleIdIndex = this.puzzleIDs1.length - 2; puzzleIdIndex > 0; puzzleIdIndex--) {
			this.resetState();

			const puzzleId = this.puzzleIDs1[puzzleIdIndex];
			const pos = this.findPositionOfPuzzle(previousPuzzleIndex - 1, puzzles);
			const distance = GetDistanceToCenter(pos.x, pos.y);
			const worldPuzzleIndex = puzzles[pos.x + 10 * pos.y];
			const itemID1 = this._puzzles[puzzleId].item_1;

			let zone = null;
			do {
				let type = rand() % 2 ? ZoneType.Trade : ZoneType.Use;
				zone = this.GetUnusedZoneRandomly(type, puzzleIdIndex - 1, -1, itemID1, -1, distance, true);

				if (!zone) {
					type = type === ZoneType.Use ? ZoneType.Trade : ZoneType.Use;
					zone = this.GetUnusedZoneRandomly(type, puzzleIdIndex - 1, -1, itemID1, -1, distance, true);
				}
				this.errorWhen(!zone, `Unable to find suitable zone for puzzle at ${pos.x}x${pos.y}`);

				this.puzzleIndex = worldPuzzleIndex - 1;

				this.placeZone(pos.x, pos.y, zone.id, zone.type, {
					findItemID: this.findItemID,
					puzzleIndex: this.puzzleIndex,
					requiredItemID: this.requiredItemID,
					npcID: this.npcID,
					additionalRequiredItemID: this.additionalRequiredItemID
				});

				if (puzzleIdIndex === 1) {
					this.AddProvidedQuestWithItemID(this.requiredItemID, distance);
					break;
				}
			} while (!zone);
			previousPuzzleIndex--;
		}
	}

	GetUnusedPuzzleRandomly(itemID, zoneType) {
		let puzzles = this.GetPuzzleCandidates(zoneType).shuffle();
		const puzzleType = zoneType.toPuzzleType();
		const typeIsCompatible = puzzle => puzzle.type === puzzleType;
		const hasPuzzleBeenPlaced = puzzle => this.hasPuzzleBeenPlaced(puzzle.id);

		let hasRequiredItem = ({item_1}) => item_1 === itemID;
		if (zoneType === ZoneType.Unknown) hasRequiredItem = constantly(true);

		return puzzles.find(and(typeIsCompatible, not(hasPuzzleBeenPlaced), hasRequiredItem));
	}

	GetUnusedZoneRandomly(zoneType, puzzleIndex, puzzleIndex2, providedItem, providedItem2, distance, a8) {
		let zoneMatchesType = zone => zone.type === zoneType;
		if (zoneType === ZoneType.Find || zoneType === ZoneType.FindTheForce)
			zoneMatchesType = zone => zone.type === ZoneType.Find || zone.type === ZoneType.FindTheForce;
		let zoneMatchesPlanet = (zone) => zone.planet === this._planet;
		let zoneIsUnused = (zone) => !this.puzzleZoneIDs.contains(zone.id) || (zoneType === ZoneType.Goal && this.puzzles_can_be_reused > 0);
		const usableZones = this._zones.filter(and(zoneMatchesPlanet, zoneMatchesType)).shuffle();

		return usableZones.filter(zoneIsUnused).find(zone => this.GetUnusedZone(zone, puzzleIndex, puzzleIndex2, providedItem, providedItem2, distance, a8));
	}

	GetUnusedZone(zone, puzzleIndex, puzzleIndex2, providedItem, providedItem2, distance, a8) {
		switch (zone.type) {
			case ZoneType.Town:
				return true;
			case ZoneType.BlockadeNorth:
			case ZoneType.TravelStart:
			case ZoneType.BlockadeWest:
			case ZoneType.BlockadeSouth:
			case ZoneType.BlockadeEast:
			case ZoneType.TravelEnd:
				if (!this.RequiredItemForZoneWasNotPlaced(zone.id)) {
					return false;
				}
				const itemCandidates = zone.requiredItemIDs.filter(itemID => !this.HasQuestRequiringItem(itemID));
				if (itemCandidates.length === 0) {
					return false;
				}
				const itemID = itemCandidates[rand() % itemCandidates.length];
				this.AddProvidedQuestWithItemID(itemID, zone.type === ZoneType.TravelStart ? 5 : distance);
				this.AddRequiredQuestWithItemID(itemID, distance);
				this.requiredItemID = itemID;
				this.addRequiredItemQuestsFromHotspots(zone.id);

				return true;
			case ZoneType.Empty:
				if (this.field_2E64) {
					const count = zone.hotspots.length;
					if (count <= 0) {
						return true;
					}
					// used to iterate through all teleporter hotspots here
					return false;
				}

				return true;
			case ZoneType.Goal:
				if (!this.ZoneLeadsToProvidedItem(zone.id, providedItem))
					return false;
				if (!this.ZoneLeadsToProvidedItem(zone.id, providedItem2))
					return false;

				const newPuzzleItem1 = this.GetUnusedRequiredItemForZoneRandomly(zone.id, false);
				const newPuzzleItem2 = this.GetUnusedRequiredItemForZoneRandomly(zone.id, true);
				if (newPuzzleItem1 < 0 || newPuzzleItem2 < 0)
					return false;
				const newPuzzle = this.GetUnusedPuzzleRandomly(newPuzzleItem1, ZoneType.Goal);
				if (newPuzzle) this.puzzleIDs.push(newPuzzle.id);
				const aapuzzle = this.GetUnusedPuzzleRandomly(newPuzzleItem2, ZoneType.Goal);
				if (aapuzzle) {
					this.puzzleIDs.push(aapuzzle.id);
				}
				if (!newPuzzle || !aapuzzle)
					return false;

				this.puzzleIDs1[puzzleIndex] = newPuzzle.id;
				this.puzzleIDs2[puzzleIndex2] = aapuzzle.id;
				if (!this.RequiredItemForZoneWasNotPlaced(zone.id)) {
					return false;
				}

				const puzzle1 = this._puzzles[this.puzzleIDs1[puzzleIndex]];
				const puzzle2 = this._puzzles[this.puzzleIDs2[puzzleIndex2]];
				const puzzle3 = this._puzzles[this.puzzleIDs1[puzzleIndex + 1]];

				const npcID = this.findUnusedNPCForZoneRandomly(zone.id);
				const hasPuzzleNPC = npcID >= 0 ? this.zoneLeadsToNPC(zone.id, npcID) : 0;
				puzzle1.hasPuzzleNPC = hasPuzzleNPC;

				let hasItem = true;
				hasItem &= this.ZoneLeadsToRequiredItem(zone.id, puzzle1.item_1);
				// this.ZoneLeadsToRequiredItem(zone.id, puzzle2.item_1, 1);
				hasItem &= this.ZoneLeadsToProvidedItem(zone.id, puzzle3.item_1);
				this.ZoneLeadsToProvidedItem(zone.id, puzzle3.item_2);

				if (!hasItem) {
					return false;
				}

				if (hasPuzzleNPC) {
					this.addRequiredItemQuestsFromHotspots(zone.id);

					this.npcID = npcID;
					this.findItemID = 0;
					this.requiredItemID = puzzle1.item_1;
					this.puzzleIndex = puzzleIndex;
					this.additionalRequiredItemID = puzzleIndex2;
					this.addRequiredItemQuestsFromHotspots(zone.id);
				} else {
					let didAddItem = true;
					didAddItem &= this.ChooseItemIDFromZone(zone.id, puzzle1.item_1, 0);
					didAddItem &= this.DropItemAtTriggerHotspotRandomly(zone.id, puzzle3.item_1);

					didAddItem &= this.ChooseItemIDFromZone(zone.id, puzzle2.item_1, 1);
					didAddItem &= this.DropItemAtTriggerHotspotRandomly(zone.id, puzzle3.item_2);

					if (!didAddItem)
						return false;

					this.AddRequiredQuestWithItemID(puzzle1.item_1, distance);
					this.AddRequiredQuestWithItemID(puzzle2.item_1, distance);
					this.AddRequiredQuestWithItemID(puzzle3.item_1, distance);
					this.AddRequiredQuestWithItemID(puzzle3.item_2, distance);

					this.npcID = -1;
					this.findItemID = puzzle3.item_1;
					this.requiredItemID = puzzle1.item_1;
					this.puzzleIndex = puzzleIndex;
					this.additionalRequiredItemID = puzzleIndex2;
					this.addRequiredItemQuestsFromHotspots(zone.id);
				}
				this.AddRequiredQuestWithItemID(newPuzzleItem1, distance);
				this.AddRequiredQuestWithItemID(newPuzzleItem2, distance);
				return true;
			case ZoneType.Trade:
				if (!this.ZoneLeadsToProvidedItem(zone.id, providedItem))
					return false;
				const requiredItem = this.GetUnusedRequiredItemForZoneRandomly(zone.id, false);
				if (requiredItem < 0)
					return false;
				const puzzle = this.GetUnusedPuzzleRandomly(requiredItem, ZoneType.Trade);
				if (!puzzle)
					return false;

				const array = a8 ? this.puzzleIDs1 : this.puzzleIDs2;
				array[puzzleIndex] = puzzle.id;

				const puzzleID1 = array[puzzleIndex];
				const puzzleID2 = array[puzzleIndex + 1];

				const p1 = this._puzzles[puzzleID1];
				const p2 = this._puzzles[puzzleID2];

				this.AddRequiredQuestWithItemID(p1.item_1, distance);
				this.AddRequiredQuestWithItemID(p2.item_1, distance);

				if (!this.RequiredItemForZoneWasNotPlaced(zone.id)) {
					this.RemoveQuestRequiringItem(p1.item_1);

					return false;
				}

				if (this.DropItemAtLockHotspot(zone.id, p1.item_1)) {
					this.AddRequiredQuestWithItemID(p1.item_1, distance);
					this.requiredItemID = p1.item_1;

					if (this.DropItemAtTriggerHotspotRandomly(zone.id, p2.item_1)) {
						this.AddRequiredQuestWithItemID(p2.item_1, distance);
						this.findItemID = p2.item_1;
					}
				}

				this.addRequiredItemQuestsFromHotspots(zone.id);

				this.puzzleIDs.push(puzzle.id);
				this.AddRequiredQuestWithItemID(requiredItem, distance);

				return true;
			case ZoneType.Use: {
				if (!this.ZoneLeadsToProvidedItem(zone.id, providedItem))
					return false;
				const puzzleID1 = this.GetUnusedRequiredItemForZoneRandomly(zone.id, false);
				if (puzzleID1 < 0)
					return false;

				const puzzle2 = this.GetUnusedPuzzleRandomly(puzzleID1, ZoneType.Use);
				if (!puzzle2)
					return false;

				const array = a8 ? this.puzzleIDs1 : this.puzzleIDs2;
				array[puzzleIndex] = puzzle2.id;

				if (zone.type !== ZoneType.Use) return false;
				if (!this.RequiredItemForZoneWasNotPlaced(zone.id)) return false;

				const npcID = this.findUnusedNPCForZoneRandomly(zone.id);
				if (npcID < 0)
					return false;

				const requiredItemID = this._puzzles[array[puzzleIndex]].item_1;
				if (!this.ZoneLeadsToRequiredItem(zone.id, requiredItemID))
					return false;

				const findItemID = this._puzzles[array[puzzleIndex + 1]].item_1;
				if (!this.ZoneLeadsToProvidedItem(zone.id, findItemID))
					return false;

				if (!this.DropNPCAtHotspotRandomly(zone.id, npcID))
					return false;

				this.npcID = npcID;
				this.findItemID = findItemID;
				this.requiredItemID = requiredItemID;
				this.puzzleIndex = puzzleIndex;

				this.AddRequiredQuestWithItemID(npcID, distance);
				this.addRequiredItemQuestsFromHotspots(zone.id);

				this.puzzleIDs.push(puzzle2.id);

				this.AddRequiredQuestWithItemID(puzzleID1, distance);
				return true;
			}
			case ZoneType.Find:
			case ZoneType.FindTheForce:
				if (!this.DropItemAtHotspotRandomly(zone.id, providedItem)) {
					return false;
				}

				this.AddRequiredQuestWithItemID(providedItem, distance);
				this.findItemID = providedItem;
				this.addRequiredItemQuestsFromHotspots(zone.id);

				return true;
			default:
				return false;
		}
	}

	DetermineFindZones(world) {
		for (const quest of this.providedItemQuests) {
			const candidates = this.DeterminePuzzleLocationChoices(world, quest.distance);
			const point = candidates[rand() % candidates.length];
			this.errorWhen(!point, `No place to find item ${quest.itemID} found!`);

			const zone = this.GetUnusedZoneRandomly(ZoneType.Find, -1, -1, quest.itemID, -1, quest.distance, false);
			this.errorWhen(!zone, "No zone for puzzle found");
			this.placeZone(point.x, point.y, zone.id, ZoneType.Find, {findItemID: this.findItemID});
			const idx = point.x + 10 * point.y;
			world[idx] = WorldItemType.Puzzle;
		}
	}

	DetermineTeleporters(world) {
		let zone = null;
		let teleporterSource = null;
		let lastZone = null;

		let foundTeleporterTarget = false;
		let teleportersFound = 0;

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const worldItemType = world[x + 10 * y];
				if (worldItemType !== WorldItemType.Empty && worldItemType !== WorldItemType.Candidate && worldItemType !== WorldItemType.Island)
					continue;

				const distance = GetDistanceToCenter(x, y);
				this.field_2E64 = worldItemType === WorldItemType.Island || distance < 2;

				let zone = null;
				if (this.field_2E64 || !foundTeleporterTarget) {
					zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, -1, -1, distance, false);
				} else zone = lastZone;

				this.errorWhen(!zone, "No zone found");
				while (1) {
					if (this.field_2E64) break;

					const hasTeleporter = zone.hotspots.find(htsp => htsp.type === HotspotType.Teleporter);
					if (!hasTeleporter)
						break;

					if (!teleportersFound) {
						teleportersFound++;
						teleporterSource = new Point(x, y);
						break;
					}

					let distance = this._size === WorldSize.LARGE ? 2 : 1;
					if (Math.abs(teleporterSource.x - x) > distance || Math.abs(teleporterSource.y - y) > distance) {
						teleportersFound++;
						teleporterSource = new Point(x, y);
						if (!foundTeleporterTarget)
							break;

						foundTeleporterTarget = false;
						lastZone = null;
						break;
					}

					lastZone = zone;
					foundTeleporterTarget = true;
					zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, -1, -1, distance, false);
					this.errorWhen(!zone, "No zone found");
				}

				this.placeZone(x, y, zone ? zone.id : -1, ZoneType.Empty);
			}
		}

		if (teleportersFound === 1) {
			this.field_2E64 = 1;

			const distance = GetDistanceToCenter(teleporterSource.x, teleporterSource.y);
			const zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, -1, -1, distance, false);
			if (zone) {
				this.placeZone(teleporterSource.x, teleporterSource.y, zone.id, ZoneType.Empty);
			}
		}

		return true;
	}

	WritePlanetValues() {
	}

	PuzzleUsedInLastGame(/*puzzle_id, planet*/) {
		return false;
	}

	hasPuzzleBeenPlaced(puzzle_id) {
		return this.puzzleIDs.contains(puzzle_id);
	}

	ZoneLeadsToRequiredItem(zoneID, targetItemID) {
		return this._traverseZoneUntil(zoneID, ({requiredItemIDs}) => requiredItemIDs.contains(targetItemID), false, identity);
	}

	ZoneLeadsToProvidedItem(zoneID, targetItemID) {
		return this._traverseZoneUntil(zoneID, ({providedItemIDs}) => providedItemIDs.contains(targetItemID), false, identity);
	}

	HasQuestRequiringItem(itemID) {
		return !!this.requiredItemQuests.find(quest => quest.itemID === itemID);
	}

	AddProvidedQuestWithItemID(itemID, maximumDistance) {
		let quest = {itemID: itemID, distance: maximumDistance};
		this.providedItemQuests.unshift(quest);
		return quest;
	}

	AddRequiredQuestWithItemID(itemID, maximumDistance) {
		let quest = {itemID: itemID, distance: maximumDistance};
		this.requiredItemQuests.push(quest);
		return quest;
	}

	RemoveQuestRequiringItem(itemID) {
		this.requiredItemQuests.splice(this.requiredItemQuests.findIndex(t => t.itemID === itemID), 1);
	}

	RemoveQuestProvidingItem(itemID) {
		this.providedItemQuests.splice(this.providedItemQuests.findIndex(t => t.itemID === itemID), 1);
	}

	RequiredItemForZoneWasNotPlaced(zoneID) {
		const zone = this._zones[zoneID];
		for (const hotspot of zone.hotspots) {
			if (hotspot.arg < 0) continue;
			if (hotspot.type.canHoldItem() && this.HasQuestRequiringItem(hotspot.arg)) return false;
			if (hotspot.type === HotspotType.DoorIn && !this.RequiredItemForZoneWasNotPlaced(hotspot.arg)) return false;
		}

		return true;
	}

	addRequiredItemQuestsFromHotspots(zoneID) {
		this._zones[zoneID].hotspots.forEach(hotspot => {
			if (hotspot.arg < 0) return;
			if (hotspot.type.canHoldItem()) this.AddRequiredQuestWithItemID(hotspot.arg, -1);
			if (hotspot.type === HotspotType.DoorIn) this.addRequiredItemQuestsFromHotspots(hotspot.arg);
		});
	}

	ChooseItemIDFromZone(zoneID, itemID, fromAssignedItems) {
		return this._traverseZoneUntil(zoneID, zone => {
			const itemIDs = fromAssignedItems ? zone.assignedItemIDs : zone.requiredItemIDs;
			return itemIDs.contains(itemID);
		}, false, identity);
	}

	findUnusedNPCForZoneRandomly(zoneID) {
		return this._traverseZoneUntil(zoneID, (zone) => {
			const npcCandidates = zone.puzzleNPCTileIDs.filter((npcid) => !this.HasQuestRequiringItem(npcid));
			if (!npcCandidates.length) return -1;
			return npcCandidates[rand() % npcCandidates.length];
		});
	}

	zoneLeadsToNPC(zoneID, npcID) {
		return this._traverseZoneUntil(zoneID, (zone) => zone.puzzleNPCTileIDs.contains(npcID), false, identity);
	}

	GetUnusedRequiredItemForZoneRandomly(zoneID, isGoal) {
		return this._traverseZoneUntil(zoneID, (zone) => {
			const zoneItemIds = isGoal ? zone.assignedItemIDs : zone.requiredItemIDs;
			const itemIDs = zoneItemIds.filter(id => !this.HasQuestRequiringItem(id));

			if (!itemIDs.length) return -1;
			return itemIDs[rand() % itemIDs.length];
		}, -1);
	}

	_traverseZoneUntil(zoneID, callback, defaultReturn = -1, predicate = result => result !== defaultReturn) {
		const zone = this._zones[zoneID];
		const result = callback(zone);
		if (predicate(result)) {
			return result;
		}

		const hotspots = zone.hotspots.withType(HotspotType.DoorIn).filter(htsp => htsp.arg !== -1);
		for (const hotspot of hotspots) {
			const result = this._traverseZoneUntil(hotspot.arg, callback, defaultReturn, predicate);
			if (predicate(result)) return result;
		}

		return defaultReturn;
	}

	DeterminePuzzleLocationChoices(world, maxDistance) {
		const farPoints = [];
		const bestPoints = [];
		const pointsCloseToPuzzles = [];

		this.loopWorld(world, (item, x, y, idx) => {
			const point = new Point(x, y);
			if (GetDistanceToCenter(x, y) > maxDistance) {
				if (item === WorldItemType.Empty) {
					farPoints.push(point);
				}
			} else if (item === WorldItemType.Empty || item === WorldItemType.Candidate) {
				if ((x < 1 || world[idx - 1] !== WorldItemType.Puzzle)
					&& (x > 8 || world[idx + 1] !== WorldItemType.Puzzle)
					&& (y < 1 || world[idx - 10] !== WorldItemType.Puzzle)
					&& (y > 8 || world[idx + 10] !== WorldItemType.Puzzle))
					bestPoints.push(point);
				else
					pointsCloseToPuzzles.push(point);
			}
		});

		if (bestPoints.length) return bestPoints;
		if (pointsCloseToPuzzles.length) return pointsCloseToPuzzles;
		if (farPoints.length) return farPoints;

		return null;
	}

	GetPuzzleCandidates(zoneType) {
		return this._puzzles.filter(puzzle => {
			switch (zoneType) {
				case ZoneType.Find:
				case ZoneType.FindTheForce:
					return false;
				case ZoneType.Use:
				case ZoneType.Trade:
				case ZoneType.Goal:
					return !this.hasPuzzleBeenPlaced(puzzle.id) && puzzle.type === zoneType.toPuzzleType();
				case ZoneType.Unknown:
					return puzzle.type === PuzzleType.End && (!this.PuzzleUsedInLastGame(puzzle.id, this._planet) || this.goalPuzzleID >= 0) && puzzle.id.isGoalOnPlanet(this._planet);
				default:
					return true;
			}
		});
	}

	DropItemAtTriggerHotspotRandomly(zoneID, itemID) {
		return this._traverseZoneUntil(zoneID, zone => {
			if (!zone.providedItemIDs.contains(itemID)) return false;

			const candidates = zone.hotspots.withType(HotspotType.TriggerLocation);
			return this.placeItemAtHotspotRandomly(candidates, itemID);
		}, false, identity);
	}

	placeItemAtHotspotRandomly(candidates, item) {
		if (!candidates.length) return false;

		const hotspot = candidates[rand() % candidates.length];
		return this.DropItemAtHotspot(item, hotspot);
	}

	DropItemAtLockHotspot(zoneID, itemID) {
		return this._traverseZoneUntil(zoneID, (zone) => {
			if (!zone.requiredItemIDs.contains(itemID)) return false;

			const hotspot = zone.hotspots.withType(HotspotType.Lock);
			if (!hotspot.length) return false;

			return this.DropItemAtHotspot(itemID, hotspot);
		}, false, identity);
	}

	DropItemAtHotspot(itemID, hotspot) {
		if (!hotspot) return false;
		hotspot.arg = itemID;
		hotspot.enabled = true;
		return true;
	}

	DropNPCAtHotspotRandomly(zoneID, npcID) {
		const isFree = ({arg}) => arg === -1;

		return this._traverseZoneUntil(zoneID, (zone) => {
			if (!zone.puzzleNPCTileIDs.contains(npcID)) return false;
			const candidates = zone.hotspots.withType(HotspotType.SpawnLocation).filter(isFree);
			return this.placeItemAtHotspotRandomly(candidates, npcID);
		}, false, identity);
	}

	DropItemAtHotspotRandomly(zoneID, itemID) {
		if (!this.RequiredItemForZoneWasNotPlaced(zoneID)) {
			return false;
		}

		return this._traverseZoneUntil(zoneID, (zone) => {
			if (!zone.providedItemIDs.contains(itemID)) return false;
			const hotspotType = this._tiles[itemID].specs.toHotspotType();
			const candidates = zone.hotspots.withType(hotspotType);
			return this.placeItemAtHotspotRandomly(candidates, itemID);
		}, false, identity);
	}

	placeZone(x, y, id, type, options = {}) {
		const idx = x + 10 * y;
		this.worldZones[idx] = this._zones[id] || null;
		this.world.index(idx).zoneID = id;
		this.world.index(idx).zoneType = type;
		this.world.index(idx).puzzleIndex = options.puzzleIndex !== undefined ? options.puzzleIndex : -1;
		this.world.index(idx).requiredItemID = options.requiredItemID !== undefined ? options.requiredItemID : -1;
		this.world.index(idx).npcID = options.npcID !== undefined ? options.npcID : -1;
		this.world.index(idx).findItemID = options.findItemID !== undefined ? options.findItemID : -1;
		this.world.index(idx).additionalRequiredItemID = options.additionalRequiredItemID !== undefined ? options.additionalRequiredItemID : -1;
		if (id >= 0 && type !== ZoneType.Town) this.puzzleZoneIDs.unshift(id);
	}

	errorWhen(condition, message) {
		if (!condition) return;

		const error = new WorldGenerationError(message);
		error.seed = this._seed;
		error.size = this._size;
		error.planet = this._planet;
		throw error;
	}
}

export default WorldGenerator;
