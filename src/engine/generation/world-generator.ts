import { Hotspot, HotspotType, Puzzle, PuzzleType, Tile, Zone, ZoneType } from "src/engine/objects";
import { Planet, WorldSize } from "src/engine/types";
import { constantly, HorizontalPointRange, identity, Point, rand, srand, VerticalPointRange } from "src/util";
import { and, not } from "src/util/functional";
import Engine from "../engine";
import * as Type from "../types";
import GetDistanceToCenter from "./distance-to-center";
import MapGenerator from "./map-generator";
import World from "./world";
import WorldGenerationError from "./world-generation-error";
import WorldItem from "./world-item";
import WorldItemType from "./world-item-type";

type Map = Uint16Array;

declare global {
	interface Quest {
		itemID: Tile;
		distance: number;
	}

	interface Array<T> {
		shuffle(): T[];

		withType(type: HotspotType): Hotspot[];
	}
}

class WorldGenerator {
	public goalPuzzleID: Puzzle;
	public world: World;
	public puzzleIDs2: Puzzle[];
	private _seed: number;
	private _size: WorldSize;
	private _planet: Planet;
	private _zones: Zone[];
	private _tiles: Tile[];
	private _puzzles: Puzzle[];
	private puzzleZoneIDs: Zone[];
	private requiredItems: Tile[];
	private providedItems: Tile[];
	private mapGenerator: MapGenerator;
	private additionalRequiredItemID: Tile;
	private providedItemQuests: Quest[];
	private puzzleIDs: Puzzle[];
	private puzzleIDs1: Puzzle[];
	private requiredItemQuests: Quest[];
	private puzzleIndex: number;
	private requiredItemID: Tile;
	private findItemID: Tile;
	private npcID: Tile;
	private worldZones: Zone[];
	private field_2E64: number;
	private puzzles_can_be_reused: number;

	constructor(seed: number, size: WorldSize, planet: Planet, engine: Engine) {
		this._seed = seed | 0;
		this._size = size;
		this._planet = planet;
		const data = engine && engine.data;
		this._zones = data.zones;
		this._tiles = data.tiles;
		this._puzzles = data.puzzles;

		this.puzzleZoneIDs = [];
		this.requiredItems = [];
		this.providedItems = [];
		this.goalPuzzleID = null;

		this.world = null;

		this.mapGenerator = null;
		this.additionalRequiredItemID = null;
		this.providedItemQuests = [];
		this.puzzleIDs = [];
		this.puzzleIDs1 = [];
		this.puzzleIDs2 = [];
		this.requiredItemQuests = [];
		this.puzzleIndex = -1;
		this.requiredItemID = null;
		this.findItemID = null;
		this.npcID = null;
		this.worldZones = [];
		this.field_2E64 = -1;

		this.puzzles_can_be_reused = 0;

		Object.seal(this);
	}

	generate(seed?: number) {
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

		this.puzzleIDs1 = Array(puzzles1Count + 1).fill(-1);
		this.puzzleIDs2 = Array(puzzles2Count + 1).fill(-1);
		this.worldZones = Array(100).fill(null);

		this.puzzleIndex = -1;

		this.puzzleIDs = [];

		this.providedItemQuests = [];
		this.requiredItemQuests = [];

		let goalID = this.goalPuzzleID;
		if (goalID === null) {
			const puzzle = this.GetUnusedPuzzleRandomly(null, ZoneType.Unknown);
			if (puzzle)
				goalID = this.goalPuzzleID = puzzle;
		}
		if (goalID === null) {
			return false;
		}
		this.puzzleIDs.push(goalID);
		this.puzzleIDs1[puzzles1Count] = goalID;
		this.puzzleIDs2[puzzles2Count] = goalID;

		this.DetermineTransportZones();
		this.DetermineGoalZone(puzzleCount, puzzles2Count, <any>mapGenerator.orderMap);

		this.DetermineQuestZones(puzzleCount, <any>mapGenerator.orderMap);
		this.PlacePuzzlesZones(puzzles2Count - 1, <any>mapGenerator.orderMap);
		this.DetermineBlockadeAndTownZones(<any>mapGenerator.typeMap);

		this.AddProvidedQuestWithItemID(this._tiles[Type.THE_FORCE], 2);
		this.AddProvidedQuestWithItemID(this._tiles[Type.LOCATOR], 1);
		this.DetermineFindZones(<any>mapGenerator.typeMap);
		this.DetermineTeleporters(<any>mapGenerator.typeMap);

		// waste another random number
		rand();

		this.WritePlanetValues();

		return true;
	}

	DetermineTransportZones() {
		const typeMap = this.mapGenerator.typeMap;
		const isTravelTarget = (point: Point) => {
			const index = point.x + point.y * 10;
			return typeMap[index] === WorldItemType.TravelEnd.rawValue && !this.worldZones[index];
		};

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (typeMap[x + y * 10] !== WorldItemType.TravelStart.rawValue)
					continue;

				this.resetState();

				const distance = GetDistanceToCenter(x, y);
				const zone = this.GetUnusedZoneRandomly(ZoneType.TravelStart, -1, -1, null, null, distance, true);
				if (!zone) continue;

				this.placeZone(x, y, zone, ZoneType.TravelStart, {requiredItemID: this.requiredItemID});

				const vehicleHotspot = zone.hotspots.find(htsp => htsp.type === HotspotType.VehicleTo);
				const connectedZoneID = vehicleHotspot ? vehicleHotspot.arg : -1;
				if (connectedZoneID === -1)
					continue;

				const connectedZone = this._zones[connectedZoneID];

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
					if (this.puzzleZoneIDs.contains(connectedZone))
						continue;

					this.placeZone(travelTarget.x, travelTarget.y, connectedZone, ZoneType.TravelEnd, {
						requiredItemID: this.requiredItemID
					});
				} else {
					this.RemoveQuestProvidingItem(this.requiredItemID);
					this.placeZone(x, y, null, ZoneType.None);
				}
			}
		}
	}

	loopWorld(map: Map, callback: ((v: WorldItemType, x: number, y: number, id: number, map: Map) => void)) {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				callback(WorldItemType.fromNumber(map[x + 10 * y]), x, y, x + 10 * y, map);
			}
		}
	}

	DetermineBlockadeAndTownZones(map: Map) {
		this.loopWorld(map, (worldItemType, x, y) => {
			const type = worldItemType.toZoneType();
			if (!(type.isBlockadeType() || type === ZoneType.Town))
				return;

			this.resetState();

			const distance = GetDistanceToCenter(x, y);
			let zone = this.GetUnusedZoneRandomly(type, -1, -1, null, null, distance, false);
			if (!zone) zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, null, null, distance, false);
			if (!zone) return;

			let options: Partial<WorldItem> = {};
			if (type !== ZoneType.Town) options.requiredItemID = this.requiredItemID;
			this.placeZone(x, y, zone, zone.type, options);
		});
	}

	findPositionOfPuzzle(orderIdx: number, orderMap: Map) {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (orderMap[x + 10 * y] === orderIdx)
					return new Point(x, y);
			}
		}
		return null;
	}

	PlacePuzzlesZones(puzzleMapIdx: number, puzzles: Map) {
		for (let puzzleIndex = puzzleMapIdx; puzzleIndex > 0; puzzleIndex--) {
			this.resetState();

			const point = this.findPositionOfPuzzle(puzzleIndex - 1, puzzles);
			const distance = GetDistanceToCenter(point.x, point.y);

			const puzzleID = this.puzzleIDs2[puzzleIndex];
			const item_1 = puzzleID.item_1;
			let zone: Zone = null;

			let type = rand() % 2 ? ZoneType.Use : ZoneType.Trade;
			zone = this.GetUnusedZoneRandomly(type, puzzleIndex - 1, -1, item_1, null, distance, false);

			if (!zone) {
				type = type === ZoneType.Use ? ZoneType.Trade : ZoneType.Use;
				zone = this.GetUnusedZoneRandomly(type, puzzleIndex - 1, -1, item_1, null, distance, false);
			}

			this.errorWhen(!zone, "Unable to find suitable puzzle zone");

			this.placeZone(point.x, point.y, zone, zone.type, {
				findItemID: this.findItemID,
				puzzleIndex: this.puzzleIndex,
				requiredItemID: this.requiredItemID,
				npcID: this.npcID
			});

			this.puzzleIndex = -1;
		}
	}

	DetermineGoalZone(puzzleCount: number, puzzles2Count: number, puzzles: Map) {
		this.resetState();

		const puzzleId = this.puzzleIDs1[this.puzzleIDs1.length - 1];
		const pos = this.findPositionOfPuzzle(puzzleCount - 1, puzzles);
		const distance = GetDistanceToCenter(pos.x, pos.y);
		const worldPuzzleIndex = puzzles[pos.x + 10 * pos.y];
		const zone = this.GetUnusedZoneRandomly(ZoneType.Goal, this.puzzleIDs1.length - 2, puzzles2Count - 1, puzzleId.item_1, puzzleId.item_2 ? puzzleId.item_2 : null, distance, true);
		this.errorWhen(!zone, "Unable to find suitable goal zone.");
		this.placeZone(pos.x, pos.y, zone, ZoneType.Goal, {
			findItemID: this.findItemID,
			puzzleIndex: worldPuzzleIndex - 1,
			requiredItemID: this.requiredItemID,
			npcID: null,
			additionalRequiredItemID: this.puzzleIDs[2].item_1
		});
	}

	resetState() {
		this.requiredItemID = null;
		this.findItemID = null;
		this.npcID = null;
		this.puzzleIndex = -1;
		this.additionalRequiredItemID = null;
	}

	DetermineQuestZones(puzzleCount: number, puzzles: Map) {
		let previousPuzzleIndex = puzzleCount - 1;
		for (let puzzleIdIndex = this.puzzleIDs1.length - 2; puzzleIdIndex > 0; puzzleIdIndex--) {
			this.resetState();

			const puzzleId = this.puzzleIDs1[puzzleIdIndex];
			const pos = this.findPositionOfPuzzle(previousPuzzleIndex - 1, puzzles);
			this.errorWhen(pos === null, `Could not find previous puzzle location!`);
			const distance = GetDistanceToCenter(pos.x, pos.y);
			const worldPuzzleIndex = puzzles[pos.x + 10 * pos.y];
			const itemID1 = puzzleId.item_1;

			let zone = null;
			do {
				let type = rand() % 2 ? ZoneType.Trade : ZoneType.Use;
				zone = this.GetUnusedZoneRandomly(type, puzzleIdIndex - 1, -1, itemID1, null, distance, true);

				if (!zone) {
					type = type === ZoneType.Use ? ZoneType.Trade : ZoneType.Use;
					zone = this.GetUnusedZoneRandomly(type, puzzleIdIndex - 1, -1, itemID1, null, distance, true);
				}

				this.errorWhen(!zone, `Unable to find suitable zone for puzzle at ${pos.x}x${pos.y}`);

				this.puzzleIndex = worldPuzzleIndex - 1;

				this.placeZone(pos.x, pos.y, zone, zone.type, {
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

	GetUnusedPuzzleRandomly(itemID: Tile, zoneType: ZoneType): Puzzle {
		let puzzles = this.GetPuzzleCandidates(zoneType).shuffle();
		const puzzleType = zoneType.toPuzzleType();
		const typeIsCompatible = (puzzle: Puzzle) => puzzle.type === puzzleType;
		const hasPuzzleBeenPlaced = (puzzle: Puzzle) => this.hasPuzzleBeenPlaced(puzzle);

		let hasRequiredItem = ({item_1}: Puzzle) => item_1 === itemID;
		if (zoneType === ZoneType.Unknown) hasRequiredItem = constantly(true);

		return puzzles.find(and(typeIsCompatible, not(hasPuzzleBeenPlaced), hasRequiredItem));
	}

	GetUnusedZoneRandomly(zoneType: ZoneType, puzzleIndex: number, puzzleIndex2: number, providedItem: Tile, providedItem2: Tile, distance: number, a8: boolean): Zone {
		let zoneMatchesType = (zone: Zone) => zone.type === zoneType;
		if (zoneType === ZoneType.Find || zoneType === ZoneType.FindTheForce)
			zoneMatchesType = zone => zone.type === ZoneType.Find || zone.type === ZoneType.FindTheForce;
		let zoneMatchesPlanet = (zone: Zone) => zone.planet === this._planet;
		let zoneIsUnused = (zone: Zone) => !this.puzzleZoneIDs.contains(zone) || (zoneType === ZoneType.Goal && this.puzzles_can_be_reused > 0);
		const usableZones = this._zones.filter(and(zoneMatchesPlanet, zoneMatchesType)).shuffle();
		return usableZones.filter(zoneIsUnused).find((zone: Zone) => this.GetUnusedZone(zone, puzzleIndex, puzzleIndex2, providedItem, providedItem2, distance, a8));
	}

	GetUnusedZone(zone: Zone, puzzleIndex: number, puzzleIndex2: number, providedItem: Tile, providedItem2: Tile, distance: number, a8: boolean): boolean {
		switch (zone.type) {
			case ZoneType.Town:
				return true;
			case ZoneType.BlockadeNorth:
			case ZoneType.TravelStart:
			case ZoneType.BlockadeWest:
			case ZoneType.BlockadeSouth:
			case ZoneType.BlockadeEast:
			case ZoneType.TravelEnd:
				if (!this.RequiredItemForZoneWasNotPlaced(zone)) {
					return false;
				}
				const itemCandidates = zone.requiredItems.filter(itemID => !this.HasQuestRequiringItem(itemID));
				if (itemCandidates.length === 0) {
					return false;
				}
				const itemID = itemCandidates[rand() % itemCandidates.length];
				this.AddProvidedQuestWithItemID(itemID, zone.type === ZoneType.TravelStart ? 5 : distance);
				this.AddRequiredQuestWithItemID(itemID, distance);
				this.requiredItemID = itemID;
				this.addRequiredItemQuestsFromHotspots(zone);

				return true;
			case ZoneType.Empty:
				if (this.field_2E64) {
					const count = zone.hotspots.length;
					if (!count) {
						return true;
					}
					// used to iterate through all teleporter hotspots here
					return false;
				}

				return true;
			case ZoneType.Goal:
				if (!this.ZoneLeadsToProvidedItem(zone, providedItem))
					return false;
				if (!this.ZoneLeadsToProvidedItem(zone, providedItem2))
					return false;

				const newPuzzleItem1 = this.GetUnusedRequiredItemForZoneRandomly(zone, false);
				const newPuzzleItem2 = this.GetUnusedRequiredItemForZoneRandomly(zone, true);
				if (newPuzzleItem1 === null || newPuzzleItem2 === null)
					return false;
				const newPuzzle = this.GetUnusedPuzzleRandomly(newPuzzleItem1, ZoneType.Goal);
				if (newPuzzle) this.puzzleIDs.push(newPuzzle);
				const aapuzzle = this.GetUnusedPuzzleRandomly(newPuzzleItem2, ZoneType.Goal);
				if (aapuzzle) {
					this.puzzleIDs.push(aapuzzle);
				}
				if (!newPuzzle || !aapuzzle)
					return false;

				this.puzzleIDs1[puzzleIndex] = newPuzzle;
				this.puzzleIDs2[puzzleIndex2] = aapuzzle;
				if (!this.RequiredItemForZoneWasNotPlaced(zone)) {
					return false;
				}

				const puzzle1 = this.puzzleIDs1[puzzleIndex];
				const puzzle2 = this.puzzleIDs2[puzzleIndex2];
				const puzzle3 = this.puzzleIDs1[puzzleIndex + 1];

				const npcID = this.findUnusedNPCForZoneRandomly(zone);
				const hasPuzzleNPC = npcID !== null ? this.zoneLeadsToNPC(zone, npcID) : 0;

				let hasItem = 1;
				// TODO: this used to be &= which might evaluate the second expression in any case
				hasItem = +hasItem & +this.ZoneLeadsToRequiredItem(zone, puzzle1.item_1);
				// this.ZoneLeadsToRequiredItem(zone, puzzle2.item_1, 1);
				hasItem = +hasItem & +this.ZoneLeadsToProvidedItem(zone, puzzle3.item_1);
				this.ZoneLeadsToProvidedItem(zone, puzzle3.item_2 ? puzzle3.item_2 : null);

				if (!hasItem) {
					return false;
				}

				if (hasPuzzleNPC) {
					this.addRequiredItemQuestsFromHotspots(zone);

					this.npcID = npcID;
					this.findItemID = null;
					this.requiredItemID = puzzle1.item_1;
					this.puzzleIndex = puzzleIndex;
					this.additionalRequiredItemID = <any>puzzleIndex2; /// TODO: this looks broken
					this.addRequiredItemQuestsFromHotspots(zone);
				} else {
					let didAddItem = 1;
					// TODO: this used to be &= which might evaluate the second expression in any case
					didAddItem = didAddItem & +this.ChooseItemIDFromZone(zone, puzzle1.item_1, false);
					didAddItem = didAddItem & +this.DropItemAtTriggerHotspotRandomly(zone, puzzle3.item_1);

					didAddItem = didAddItem & +this.ChooseItemIDFromZone(zone, puzzle2.item_1, true);
					didAddItem = didAddItem & +this.DropItemAtTriggerHotspotRandomly(zone, puzzle3.item_2 ? puzzle3.item_2 : null);

					if (!didAddItem)
						return false;

					this.AddRequiredQuestWithItemID(puzzle1.item_1, distance);
					this.AddRequiredQuestWithItemID(puzzle2.item_1, distance);
					this.AddRequiredQuestWithItemID(puzzle3.item_1, distance);
					this.AddRequiredQuestWithItemID(puzzle3.item_2 ? puzzle3.item_2 : null, distance);

					this.npcID = null;
					this.findItemID = puzzle3.item_1;
					this.requiredItemID = puzzle1.item_1;
					this.puzzleIndex = puzzleIndex;
					this.additionalRequiredItemID = <any>puzzleIndex2; // TODO: this looks broken
					this.addRequiredItemQuestsFromHotspots(zone);
				}
				this.AddRequiredQuestWithItemID(newPuzzleItem1, distance);
				this.AddRequiredQuestWithItemID(newPuzzleItem2, distance);
				return true;
			case ZoneType.Trade:
				if (!this.ZoneLeadsToProvidedItem(zone, providedItem))
					return false;
				const requiredItem = this.GetUnusedRequiredItemForZoneRandomly(zone, false);
				if (requiredItem === null)
					return false;
				const puzzle = this.GetUnusedPuzzleRandomly(requiredItem, ZoneType.Trade);
				if (!puzzle)
					return false;

				const array = a8 ? this.puzzleIDs1 : this.puzzleIDs2;
				array[puzzleIndex] = puzzle;

				const puzzleID1 = array[puzzleIndex];
				const puzzleID2 = array[puzzleIndex + 1];

				const p1 = puzzleID1;
				const p2 = puzzleID2;

				this.AddRequiredQuestWithItemID(p1.item_1, distance);
				this.AddRequiredQuestWithItemID(p2.item_1, distance);

				if (!this.RequiredItemForZoneWasNotPlaced(zone)) {
					this.RemoveQuestRequiringItem(p1.item_1);

					return false;
				}

				if (this.DropItemAtLockHotspot(zone, p1.item_1)) {
					this.AddRequiredQuestWithItemID(p1.item_1, distance);
					this.requiredItemID = p1.item_1;

					if (this.DropItemAtTriggerHotspotRandomly(zone, p2.item_1)) {
						this.AddRequiredQuestWithItemID(p2.item_1, distance);
						this.findItemID = p2.item_1;
					}
				}

				this.addRequiredItemQuestsFromHotspots(zone);

				this.puzzleIDs.push(puzzle);
				this.AddRequiredQuestWithItemID(requiredItem, distance);

				return true;
			case ZoneType.Use: {
				if (!this.ZoneLeadsToProvidedItem(zone, providedItem))
					return false;
				const puzzleID1 = this.GetUnusedRequiredItemForZoneRandomly(zone, false);
				if (puzzleID1 === null)
					return false;

				const puzzle2 = this.GetUnusedPuzzleRandomly(puzzleID1, ZoneType.Use);
				if (!puzzle2)
					return false;

				const array = a8 ? this.puzzleIDs1 : this.puzzleIDs2;
				array[puzzleIndex] = puzzle2;

				if (zone.type !== ZoneType.Use) return false;
				if (!this.RequiredItemForZoneWasNotPlaced(zone)) return false;

				const npcID = this.findUnusedNPCForZoneRandomly(zone);
				if (npcID === null)
					return false;

				const requiredItemID = array[puzzleIndex].item_1;
				if (!this.ZoneLeadsToRequiredItem(zone, requiredItemID))
					return false;

				const findItemID = array[puzzleIndex + 1].item_1;
				if (!this.ZoneLeadsToProvidedItem(zone, findItemID))
					return false;

				if (!this.DropNPCAtHotspotRandomly(zone, npcID))
					return false;

				this.npcID = npcID;
				this.findItemID = findItemID;
				this.requiredItemID = requiredItemID;
				this.puzzleIndex = puzzleIndex;

				this.AddRequiredQuestWithItemID(npcID, distance);
				this.addRequiredItemQuestsFromHotspots(zone);

				this.puzzleIDs.push(puzzle2);

				this.AddRequiredQuestWithItemID(puzzleID1, distance);
				return true;
			}
			case ZoneType.Find:
			case ZoneType.FindTheForce:
				if (!this.DropItemAtHotspotRandomly(zone, providedItem)) {
					return false;
				}

				this.AddRequiredQuestWithItemID(providedItem, distance);
				this.findItemID = providedItem;
				this.addRequiredItemQuestsFromHotspots(zone);

				return true;
			default:
				return false;
		}
	}

	DetermineFindZones(world: Map) {
		for (const quest of this.providedItemQuests) {
			const candidates = this.DeterminePuzzleLocationChoices(world, quest.distance);
			const point = candidates[rand() % candidates.length];
			this.errorWhen(!point, `No place to find item ${quest.itemID} found!`);

			const zone = this.GetUnusedZoneRandomly(ZoneType.Find, -1, -1, quest.itemID, null, quest.distance, false);
			this.errorWhen(!zone, "No zone for puzzle found");
			this.placeZone(point.x, point.y, zone, ZoneType.Find, {findItemID: this.findItemID});
			const idx = point.x + 10 * point.y;
			world[idx] = WorldItemType.Puzzle.rawValue;
		}
	}

	DetermineTeleporters(world: Map) {
		let teleporterSource = null;
		let lastZone = null;

		let foundTeleporterTarget = false;
		let teleportersFound = 0;

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const worldItemType = WorldItemType.fromNumber(world[x + 10 * y]);
				if (worldItemType !== WorldItemType.Empty && worldItemType !== WorldItemType.Candidate && worldItemType !== WorldItemType.Island)
					continue;

				const distance = GetDistanceToCenter(x, y);
				this.field_2E64 = +(worldItemType === WorldItemType.Island || distance < 2);

				let zone = null;
				if (this.field_2E64 || !foundTeleporterTarget) {
					zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, null, null, distance, false);
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

					let distance = this._size === WorldSize.Large ? 2 : 1;
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
					zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, null, null, distance, false);
					this.errorWhen(!zone, "No zone found");
				}

				this.placeZone(x, y, zone ? zone : null, ZoneType.Empty);
			}
		}

		if (teleportersFound === 1) {
			this.field_2E64 = 1;

			const distance = GetDistanceToCenter(teleporterSource.x, teleporterSource.y);
			const zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, null, null, distance, false);
			if (zone) {
				this.placeZone(teleporterSource.x, teleporterSource.y, zone, ZoneType.Empty);
			}
		}

		return true;
	}

	WritePlanetValues() {
	}

	PuzzleUsedInLastGame(puzzle_id: Puzzle, planet: Planet) {
		return false;
	}

	hasPuzzleBeenPlaced(puzzle_id: Puzzle): boolean {
		return this.puzzleIDs.contains(puzzle_id);
	}

	ZoneLeadsToRequiredItem(zoneID: Zone, targetItemID: Tile): boolean {
		return this._traverseZoneUntil(zoneID, ({requiredItems}: Zone) => !!requiredItems.find(t => t === targetItemID), false, identity);
	}

	ZoneLeadsToProvidedItem(zoneID: Zone, targetItemID: Tile): boolean {
		return this._traverseZoneUntil(zoneID, ({providedItems}: Zone) => !!providedItems.find(t => t === targetItemID), false, identity);
	}

	HasQuestRequiringItem(itemID: Tile) {
		return !!this.requiredItemQuests.find(quest => quest.itemID === itemID);
	}

	AddProvidedQuestWithItemID(itemID: Tile, maximumDistance: number): Quest {
		let quest = {itemID: itemID, distance: maximumDistance};
		this.providedItemQuests.unshift(quest);
		return quest;
	}

	AddRequiredQuestWithItemID(itemID: Tile, maximumDistance: number): Quest {
		let quest = {itemID: itemID, distance: maximumDistance};
		this.requiredItemQuests.push(quest);
		return quest;
	}

	RemoveQuestRequiringItem(itemID: Tile): void {
		this.requiredItemQuests.splice(this.requiredItemQuests.findIndex(t => t.itemID === itemID), 1);
	}

	RemoveQuestProvidingItem(itemID: Tile): void {
		this.providedItemQuests.splice(this.providedItemQuests.findIndex(t => t.itemID === itemID), 1);
	}

	RequiredItemForZoneWasNotPlaced(zone: Zone): boolean {
		for (const hotspot of zone.hotspots) {
			if (hotspot.arg === -1) continue;
			if (hotspot.type.canHoldItem() && this.HasQuestRequiringItem(this._tiles[hotspot.arg])) return false;
			if (hotspot.type === HotspotType.DoorIn && !this.RequiredItemForZoneWasNotPlaced(this._zones[hotspot.arg])) return false;
		}

		return true;
	}

	addRequiredItemQuestsFromHotspots(zoneID: Zone): void {
		zoneID.hotspots.forEach(hotspot => {
			if (hotspot.arg === -1) return;
			if (hotspot.type.canHoldItem()) this.AddRequiredQuestWithItemID(this._tiles[hotspot.arg], -1);
			if (hotspot.type === HotspotType.DoorIn) this.addRequiredItemQuestsFromHotspots(this._zones[hotspot.arg]);
		});
	}

	ChooseItemIDFromZone(zoneID: Zone, itemID: Tile, fromAssignedItems: boolean) {
		return this._traverseZoneUntil(zoneID, zone => {
			const itemIDs = fromAssignedItems ? zone.assignedItems : zone.requiredItems;
			return !!itemIDs.find(t => t === itemID);
		}, false, identity);
	}

	findUnusedNPCForZoneRandomly(zoneID: Zone): Tile {
		return this._traverseZoneUntil(zoneID, (zone) => {
			const npcCandidates = zone.puzzleNPCs.filter((npcid) => !this.HasQuestRequiringItem(npcid));
			if (!npcCandidates.length) return null;
			return npcCandidates[rand() % npcCandidates.length];
		}, null);
	}

	zoneLeadsToNPC(zoneID: Zone, npcID: Tile): boolean {
		return this._traverseZoneUntil(zoneID, (zone) => !!zone.puzzleNPCs.find(t => t === npcID), false, identity);
	}

	GetUnusedRequiredItemForZoneRandomly(zoneID: Zone, isGoal: boolean): Tile {
		return this._traverseZoneUntil(zoneID, (zone) => {
			const zoneItemIds = isGoal ? zone.assignedItems : zone.requiredItems;
			const itemIDs = zoneItemIds.filter(id => !this.HasQuestRequiringItem(id));

			if (!itemIDs.length) return null;
			return itemIDs[rand() % itemIDs.length];
		}, null);
	}

	_traverseZoneUntil<T>(zone: Zone, callback: ((_: Zone) => T), defaultReturn: T, predicate = ((result: T) => result !== defaultReturn)): T {
		const result = callback(zone);
		if (predicate(result)) {
			return result;
		}

		const hotspots = zone.hotspots.withType(HotspotType.DoorIn).filter(htsp => htsp.arg !== -1);
		for (const hotspot of hotspots) {
			const result = this._traverseZoneUntil(this._zones[hotspot.arg], callback, defaultReturn, predicate);
			if (predicate(result)) return result;
		}

		return defaultReturn;
	}

	DeterminePuzzleLocationChoices(world: Map, maxDistance: number) {
		const farPoints: Point[] = [];
		const bestPoints: Point[] = [];
		const pointsCloseToPuzzles: Point[] = [];

		this.loopWorld(world, (item, x, y, idx) => {
			const point = new Point(x, y);
			if (GetDistanceToCenter(x, y) > maxDistance) {
				if (item === WorldItemType.Empty) {
					farPoints.push(point);
				}
			} else if (item === WorldItemType.Empty || item === WorldItemType.Candidate) {
				if ((x < 1 || world[idx - 1] !== WorldItemType.Puzzle.rawValue)
					&& (x > 8 || world[idx + 1] !== WorldItemType.Puzzle.rawValue)
					&& (y < 1 || world[idx - 10] !== WorldItemType.Puzzle.rawValue)
					&& (y > 8 || world[idx + 10] !== WorldItemType.Puzzle.rawValue))
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

	GetPuzzleCandidates(zoneType: ZoneType): Puzzle[] {
		return this._puzzles.filter(puzzle => {
			switch (zoneType) {
				case ZoneType.Find:
				case ZoneType.FindTheForce:
					return false;
				case ZoneType.Use:
				case ZoneType.Trade:
				case ZoneType.Goal:
					return !this.hasPuzzleBeenPlaced(puzzle) && puzzle.type === zoneType.toPuzzleType();
				case ZoneType.Unknown:
					return puzzle.type === PuzzleType.End && (!this.PuzzleUsedInLastGame(puzzle, this._planet) || this.goalPuzzleID !== null) && puzzle.isGoalOnPlanet(this._planet);
				default:
					return true;
			}
		});
	}

	DropItemAtTriggerHotspotRandomly(zoneID: Zone, itemID: Tile) {
		return this._traverseZoneUntil(zoneID, zone => {
			if (!zone.providedItems.find(t => t === itemID)) return false;

			const candidates = zone.hotspots.withType(HotspotType.TriggerLocation);
			return this.placeItemAtHotspotRandomly(candidates, itemID);
		}, false, identity);
	}

	placeItemAtHotspotRandomly(candidates: Hotspot[], item: Tile): boolean {
		if (!candidates.length) return false;

		const hotspot = candidates[rand() % candidates.length];
		return this.DropItemAtHotspot(item, hotspot);
	}

	DropItemAtLockHotspot(zoneID: Zone, itemID: Tile) {
		return this._traverseZoneUntil(zoneID, (zone) => {
			if (!zone.requiredItems.find(t => t === itemID)) return false;

			const hotspot = zone.hotspots.withType(HotspotType.Lock);
			if (!hotspot.length) return false;

			return this.DropItemAtHotspot(itemID, hotspot[0]);
		}, false, identity);
	}

	DropItemAtHotspot(itemID: Tile, hotspot: Hotspot): boolean {
		if (!hotspot) return false;
		hotspot.arg = itemID.id;
		hotspot.enabled = true;
		return true;
	}

	DropNPCAtHotspotRandomly(zoneID: Zone, npcID: Tile) {
		const isFree = ({arg}: Hotspot) => arg === -1;

		return this._traverseZoneUntil(zoneID, (zone) => {
			if (!zone.puzzleNPCs.find(t => t === npcID)) return false;
			const candidates = zone.hotspots.withType(HotspotType.SpawnLocation).filter(isFree);
			return this.placeItemAtHotspotRandomly(candidates, npcID);
		}, false, identity);
	}

	DropItemAtHotspotRandomly(zoneID: Zone, itemID: Tile): boolean {
		if (!this.RequiredItemForZoneWasNotPlaced(zoneID)) {
			return false;
		}

		return this._traverseZoneUntil(zoneID, (zone) => {
			if (!zone.providedItems.find(t => t === itemID)) return false;
			const hotspotType = itemID.specs.toHotspotType();
			const candidates = zone.hotspots.withType(hotspotType);
			return this.placeItemAtHotspotRandomly(candidates, itemID);
		}, false, identity);
	}

	placeZone(x: number, y: number, id: Zone, type: ZoneType, options: Partial<WorldItem> = {}) {
		const idx = x + 10 * y;
		this.worldZones[idx] = id;
		this.world.index(idx).zoneID = id;
		this.world.index(idx).zoneType = type;
		this.world.index(idx).puzzleIndex = options.puzzleIndex !== undefined ? options.puzzleIndex : -1;
		this.world.index(idx).requiredItemID = options.requiredItemID !== undefined ? options.requiredItemID : null;
		this.world.index(idx).npcID = options.npcID !== undefined ? options.npcID : null;
		this.world.index(idx).findItemID = options.findItemID !== undefined ? options.findItemID : null;
		this.world.index(idx).additionalRequiredItemID = options.additionalRequiredItemID !== undefined ? options.additionalRequiredItemID : null;
		if (id !== null && type !== ZoneType.Town) this.puzzleZoneIDs.unshift(id);
	}

	errorWhen(condition: boolean, message: string) {
		if (!condition) return;

		const error = new WorldGenerationError(message);
		error.seed = this._seed;
		error.size = this._size;
		error.planet = this._planet;
		throw error;
	}
}

export default WorldGenerator;
