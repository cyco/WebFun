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
import GameData from "src/engine/game-data";
import Map from "./map";
import Quest from "./quest";

declare global {
	interface Array<T> {
		withType(type: HotspotType): Hotspot[];
	}
}

class WorldGenerator {
	public world: World;
	private _seed: number;
	private _size: WorldSize;
	private _planet: Planet;
	private _data: GameData;

	private usedZones: Zone[];
	private requiredItems: Tile[];
	private providedItems: Tile[];
	private mapGenerator: MapGenerator;
	private additionalRequiredItem: Tile;
	private providedItemQuests: Quest[];
	private usedPuzzles: Puzzle[];
	private puzzleStrain1: Puzzle[];
	private puzzleStrain2: Puzzle[];
	private requiredItemQuests: Quest[];
	private currentPuzzleIndex: number;
	private requiredItem: Tile;
	private findItem: Tile;
	private npc: Tile;
	private somethingWithTeleporters: number;
	private puzzles_can_be_reused: number;

	constructor(seed: number, size: WorldSize, planet: Planet, engine: Engine) {
		this._seed = seed | 0;
		this._size = size;
		this._planet = planet;
		this._data = engine && engine.data;

		this.usedZones = [];
		this.requiredItems = [];
		this.providedItems = [];

		this.world = null;

		this.mapGenerator = null;
		this.additionalRequiredItem = null;
		this.providedItemQuests = [];
		this.usedPuzzles = [];
		this.puzzleStrain1 = [];
		this.puzzleStrain2 = [];
		this.requiredItemQuests = [];
		this.currentPuzzleIndex = -1;
		this.requiredItem = null;
		this.findItem = null;
		this.npc = null;
		this.somethingWithTeleporters = -1;

		this.puzzles_can_be_reused = 0;

		Object.seal(this);
	}

	generate(seed?: number) {
		if (seed !== undefined) this._seed = seed;
		srand(this._seed);

		const mapGenerator = (this.mapGenerator = new MapGenerator());
		mapGenerator.generate(-1, this._size);

		this.world = new World();
		this.world.zones = this._data.zones;
		for (let i = 0; i < 100; i++) {
			this.world.index(i).puzzleIdx = mapGenerator.orderMap[i];
		}

		const puzzleCount = mapGenerator.puzzleCount;
		const puzzles1Count = Math.floor(puzzleCount % 2 === 1 ? (puzzleCount + 1) / 2 : puzzleCount / 2 + 1);
		const puzzles2Count = Math.floor(puzzleCount % 2 === 1 ? (puzzleCount + 1) / 2 : puzzleCount / 2);

		this.puzzleStrain1 = Array(puzzles1Count + 1).fill(-1);
		this.puzzleStrain2 = Array(puzzles2Count + 1).fill(-1);

		this.currentPuzzleIndex = -1;

		this.usedPuzzles = [];

		this.providedItemQuests = [];
		this.requiredItemQuests = [];

		let goalPuzzle = null;
		if (goalPuzzle === null) {
			goalPuzzle = this.GetUnusedPuzzleRandomly(null, ZoneType.Unknown);
		}
		if (goalPuzzle === null) {
			return false;
		}
		this.usedPuzzles.push(goalPuzzle);
		this.puzzleStrain1[puzzles1Count] = goalPuzzle;
		this.puzzleStrain2[puzzles2Count] = goalPuzzle;

		this.DetermineTransportZones();
		this.DetermineGoalZone(puzzleCount, puzzles2Count, <any>mapGenerator.orderMap);

		this.DetermineQuestZones(puzzleCount, <any>mapGenerator.orderMap);
		this.PlacePuzzlesZones(puzzles2Count - 1, <any>mapGenerator.orderMap);
		this.DetermineBlockadeAndTownZones(<any>mapGenerator.typeMap);

		this.AddProvidedItemQuest(this.lookupTileById(Type.THE_FORCE), 2);
		this.AddProvidedItemQuest(this.lookupTileById(Type.LOCATOR), 1);
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
			return typeMap[index] === WorldItemType.TravelEnd.rawValue && !this.world.index(index).zone;
		};

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (typeMap[x + y * 10] !== WorldItemType.TravelStart.rawValue) continue;

				this.resetState();

				const distance = GetDistanceToCenter(x, y);
				const zone = this.GetUnusedZoneRandomly(ZoneType.TravelStart, -1, -1, null, null, distance, true);
				if (!zone) continue;

				this.placeZone(x, y, zone, ZoneType.TravelStart, { requiredItem: this.requiredItem });

				const vehicleHotspot = zone.hotspots.find(htsp => htsp.type === HotspotType.VehicleTo);
				const connectedZone = this.lookupZoneById(vehicleHotspot ? vehicleHotspot.arg : -1);
				if (connectedZone === null) continue;

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
					if (this.usedZones.contains(connectedZone)) continue;

					this.placeZone(travelTarget.x, travelTarget.y, connectedZone, ZoneType.TravelEnd, {
						requiredItem: this.requiredItem
					});
				} else {
					this.RemoveQuestProvidingItem(this.requiredItem);
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
			if (!(type.isBlockadeType() || type === ZoneType.Town)) return;

			this.resetState();

			const distance = GetDistanceToCenter(x, y);
			let zone = this.GetUnusedZoneRandomly(type, -1, -1, null, null, distance, false);
			if (!zone) zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, null, null, distance, false);
			if (!zone) return;

			let options: Partial<WorldItem> = {};
			if (type !== ZoneType.Town) options.requiredItem = this.requiredItem;
			this.placeZone(x, y, zone, zone.type, options);
		});
	}

	findPositionOfPuzzle(orderIdx: number, orderMap: Map) {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (orderMap[x + 10 * y] === orderIdx) return new Point(x, y);
			}
		}
		return null;
	}

	PlacePuzzlesZones(puzzleMapIdx: number, puzzles: Map) {
		for (let puzzleIndex = puzzleMapIdx; puzzleIndex > 0; puzzleIndex--) {
			this.resetState();

			const point = this.findPositionOfPuzzle(puzzleIndex - 1, puzzles);
			const distance = GetDistanceToCenter(point.x, point.y);

			const puzzle = this.puzzleStrain2[puzzleIndex];
			const item1 = puzzle.item1;
			let zone: Zone = null;

			let type = rand() % 2 ? ZoneType.Use : ZoneType.Trade;
			zone = this.GetUnusedZoneRandomly(type, puzzleIndex - 1, -1, item1, null, distance, false);

			if (!zone) {
				type = type === ZoneType.Use ? ZoneType.Trade : ZoneType.Use;
				zone = this.GetUnusedZoneRandomly(type, puzzleIndex - 1, -1, item1, null, distance, false);
			}

			this.errorWhen(!zone, "Unable to find suitable puzzle zone");

			this.placeZone(point.x, point.y, zone, zone.type, {
				findItem: this.findItem,
				puzzleIndex: this.currentPuzzleIndex,
				requiredItem: this.requiredItem,
				npc: this.npc
			});

			this.currentPuzzleIndex = -1;
		}
	}

	DetermineGoalZone(puzzleCount: number, puzzles2Count: number, puzzles: Map) {
		this.resetState();

		const puzzle = this.puzzleStrain1[this.puzzleStrain1.length - 1];
		const pos = this.findPositionOfPuzzle(puzzleCount - 1, puzzles);
		const distance = GetDistanceToCenter(pos.x, pos.y);
		const worldPuzzleIndex = puzzles[pos.x + 10 * pos.y];
		const zone = this.GetUnusedZoneRandomly(
			ZoneType.Goal,
			this.puzzleStrain1.length - 2,
			puzzles2Count - 1,
			puzzle.item1,
			puzzle.item2 ? puzzle.item2 : null,
			distance,
			true
		);
		this.errorWhen(!zone, "Unable to find suitable goal zone.");
		this.placeZone(pos.x, pos.y, zone, ZoneType.Goal, {
			findItem: this.findItem,
			puzzleIndex: worldPuzzleIndex - 1,
			requiredItem: this.requiredItem,
			npc: null,
			additionalRequiredItem: this.usedPuzzles[2].item1
		});
	}

	resetState() {
		this.requiredItem = null;
		this.findItem = null;
		this.npc = null;
		this.currentPuzzleIndex = -1;
		this.additionalRequiredItem = null;
	}

	DetermineQuestZones(puzzleCount: number, puzzles: Map) {
		let previousPuzzleIndex = puzzleCount - 1;
		for (let puzzleIdIndex = this.puzzleStrain1.length - 2; puzzleIdIndex > 0; puzzleIdIndex--) {
			this.resetState();

			const puzzle = this.puzzleStrain1[puzzleIdIndex];
			const pos = this.findPositionOfPuzzle(previousPuzzleIndex - 1, puzzles);
			this.errorWhen(pos === null, `Could not find previous puzzle location!`);
			const distance = GetDistanceToCenter(pos.x, pos.y);
			const worldPuzzleIndex = puzzles[pos.x + 10 * pos.y];
			const item1 = puzzle.item1;

			let zone = null;
			do {
				let type = rand() % 2 ? ZoneType.Trade : ZoneType.Use;
				zone = this.GetUnusedZoneRandomly(type, puzzleIdIndex - 1, -1, item1, null, distance, true);

				if (!zone) {
					type = type === ZoneType.Use ? ZoneType.Trade : ZoneType.Use;
					zone = this.GetUnusedZoneRandomly(type, puzzleIdIndex - 1, -1, item1, null, distance, true);
				}

				this.errorWhen(!zone, `Unable to find suitable zone for puzzle at ${pos.x}x${pos.y}`);

				this.currentPuzzleIndex = worldPuzzleIndex - 1;

				this.placeZone(pos.x, pos.y, zone, zone.type, {
					findItem: this.findItem,
					puzzleIndex: this.currentPuzzleIndex,
					requiredItem: this.requiredItem,
					npc: this.npc,
					additionalRequiredItem: this.additionalRequiredItem
				});

				if (puzzleIdIndex === 1) {
					this.AddProvidedItemQuest(this.requiredItem, distance);
					break;
				}
			} while (!zone);
			previousPuzzleIndex--;
		}
	}

	GetUnusedPuzzleRandomly(item: Tile, zoneType: ZoneType): Puzzle {
		let puzzles = this.GetPuzzleCandidates(zoneType).shuffle();
		const puzzleType = zoneType.toPuzzleType();
		const typeIsCompatible = (puzzle: Puzzle) => puzzle.type === puzzleType;
		const hasPuzzleBeenPlaced = (puzzle: Puzzle) => this.hasPuzzleBeenPlaced(puzzle);

		let hasRequiredItem = ({ item1 }: Puzzle) => item1 === item;
		if (zoneType === ZoneType.Unknown) hasRequiredItem = constantly(true);

		return puzzles.find(and(typeIsCompatible, not(hasPuzzleBeenPlaced), hasRequiredItem));
	}

	GetUnusedZoneRandomly(
		zoneType: ZoneType,
		puzzleIndex: number,
		puzzleIndex2: number,
		providedItem: Tile,
		providedItem2: Tile,
		distance: number,
		a8: boolean
	): Zone {
		let zoneMatchesType = (zone: Zone) => zone.type === zoneType;
		if (zoneType === ZoneType.Find || zoneType === ZoneType.FindTheForce)
			zoneMatchesType = zone => zone.type === ZoneType.Find || zone.type === ZoneType.FindTheForce;
		let zoneMatchesPlanet = (zone: Zone) => zone.planet === this._planet;
		let zoneIsUnused = (zone: Zone) =>
			!this.usedZones.contains(zone) || (zoneType === ZoneType.Goal && this.puzzles_can_be_reused > 0);
		const usableZones = this._data.zones.filter(and(zoneMatchesPlanet, zoneMatchesType)).shuffle();
		return usableZones
			.filter(zoneIsUnused)
			.find((zone: Zone) =>
				this.GetUnusedZone(zone, puzzleIndex, puzzleIndex2, providedItem, providedItem2, distance, a8)
			);
	}

	GetUnusedZone(
		zone: Zone,
		puzzleIndex: number,
		puzzleIndex2: number,
		providedItem: Tile,
		providedItem2: Tile,
		distance: number,
		a8: boolean
	): boolean {
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
				const item = itemCandidates[rand() % itemCandidates.length];
				this.AddProvidedItemQuest(item, zone.type === ZoneType.TravelStart ? 5 : distance);
				this.AddRequiredItemQuest(item, distance);
				this.requiredItem = item;
				this.addRequiredItemQuestsFromHotspots(zone);

				return true;
			case ZoneType.Empty:
				if (this.somethingWithTeleporters) {
					const count = zone.hotspots.length;
					if (!count) {
						return true;
					}
					// used to iterate through all teleporter hotspots here
					return false;
				}

				return true;
			case ZoneType.Goal:
				if (!this.ZoneLeadsToProvidedItem(zone, providedItem)) return false;
				if (!this.ZoneLeadsToProvidedItem(zone, providedItem2)) return false;

				const newPuzzleItem1 = this.GetUnusedRequiredItemForZoneRandomly(zone, false);
				const newPuzzleItem2 = this.GetUnusedRequiredItemForZoneRandomly(zone, true);
				if (newPuzzleItem1 === null || newPuzzleItem2 === null) return false;
				const newPuzzle = this.GetUnusedPuzzleRandomly(newPuzzleItem1, ZoneType.Goal);
				if (newPuzzle) this.usedPuzzles.push(newPuzzle);
				const aapuzzle = this.GetUnusedPuzzleRandomly(newPuzzleItem2, ZoneType.Goal);
				if (aapuzzle) {
					this.usedPuzzles.push(aapuzzle);
				}
				if (!newPuzzle || !aapuzzle) return false;

				this.puzzleStrain1[puzzleIndex] = newPuzzle;
				this.puzzleStrain2[puzzleIndex2] = aapuzzle;
				if (!this.RequiredItemForZoneWasNotPlaced(zone)) {
					return false;
				}

				const puzzle1 = this.puzzleStrain1[puzzleIndex];
				const puzzle2 = this.puzzleStrain2[puzzleIndex2];
				const puzzle3 = this.puzzleStrain1[puzzleIndex + 1];

				const npc = this.findUnusedNPCForZoneRandomly(zone);
				const hasPuzzleNPC = npc !== null ? this.zoneLeadsToNPC(zone, npc) : 0;

				let hasItem = 1;
				// TODO: this used to be &= which might evaluate the second expression in any case
				hasItem = +hasItem & +this.ZoneLeadsToRequiredItem(zone, puzzle1.item1);
				// this.ZoneLeadsToRequiredItem(zone, puzzle2.item_1, 1);
				hasItem = +hasItem & +this.ZoneLeadsToProvidedItem(zone, puzzle3.item1);
				this.ZoneLeadsToProvidedItem(zone, puzzle3.item2 ? puzzle3.item2 : null);

				if (!hasItem) {
					return false;
				}

				if (hasPuzzleNPC) {
					this.addRequiredItemQuestsFromHotspots(zone);

					this.npc = npc;
					this.findItem = null;
					this.requiredItem = puzzle1.item1;
					this.currentPuzzleIndex = puzzleIndex;
					this.additionalRequiredItem = <any>puzzleIndex2; /// TODO: this looks broken
					this.addRequiredItemQuestsFromHotspots(zone);
				} else {
					let didAddItem = 1;
					// TODO: this used to be &= which might evaluate the second expression in any case
					didAddItem = didAddItem & +this.ChooseItemFromZone(zone, puzzle1.item1, false);
					didAddItem = didAddItem & +this.DropItemAtTriggerHotspotRandomly(zone, puzzle3.item1);

					didAddItem = didAddItem & +this.ChooseItemFromZone(zone, puzzle2.item1, true);
					didAddItem =
						didAddItem & +this.DropItemAtTriggerHotspotRandomly(zone, puzzle3.item2 ? puzzle3.item2 : null);

					if (!didAddItem) return false;

					this.AddRequiredItemQuest(puzzle1.item1, distance);
					this.AddRequiredItemQuest(puzzle2.item1, distance);
					this.AddRequiredItemQuest(puzzle3.item1, distance);
					this.AddRequiredItemQuest(puzzle3.item2 ? puzzle3.item2 : null, distance);

					this.npc = null;
					this.findItem = puzzle3.item1;
					this.requiredItem = puzzle1.item1;
					this.currentPuzzleIndex = puzzleIndex;
					this.additionalRequiredItem = <any>puzzleIndex2; // TODO: this looks broken
					this.addRequiredItemQuestsFromHotspots(zone);
				}
				this.AddRequiredItemQuest(newPuzzleItem1, distance);
				this.AddRequiredItemQuest(newPuzzleItem2, distance);
				return true;
			case ZoneType.Trade:
				if (!this.ZoneLeadsToProvidedItem(zone, providedItem)) return false;
				const requiredItem = this.GetUnusedRequiredItemForZoneRandomly(zone, false);
				if (requiredItem === null) return false;
				const puzzle = this.GetUnusedPuzzleRandomly(requiredItem, ZoneType.Trade);
				if (!puzzle) return false;

				const array = a8 ? this.puzzleStrain1 : this.puzzleStrain2;
				array[puzzleIndex] = puzzle;

				const p1 = array[puzzleIndex];
				const p2 = array[puzzleIndex + 1];

				this.AddRequiredItemQuest(p1.item1, distance);
				this.AddRequiredItemQuest(p2.item1, distance);

				if (!this.RequiredItemForZoneWasNotPlaced(zone)) {
					this.RemoveQuestRequiringItem(p1.item1);

					return false;
				}

				if (this.DropItemAtLockHotspot(zone, p1.item1)) {
					this.AddRequiredItemQuest(p1.item1, distance);
					this.requiredItem = p1.item1;

					if (this.DropItemAtTriggerHotspotRandomly(zone, p2.item1)) {
						this.AddRequiredItemQuest(p2.item1, distance);
						this.findItem = p2.item1;
					}
				}

				this.addRequiredItemQuestsFromHotspots(zone);

				this.usedPuzzles.push(puzzle);
				this.AddRequiredItemQuest(requiredItem, distance);

				return true;
			case ZoneType.Use: {
				if (!this.ZoneLeadsToProvidedItem(zone, providedItem)) return false;
				const puzzleItem = this.GetUnusedRequiredItemForZoneRandomly(zone, false);
				if (puzzleItem === null) return false;

				const puzzle2 = this.GetUnusedPuzzleRandomly(puzzleItem, ZoneType.Use);
				if (!puzzle2) return false;

				const array = a8 ? this.puzzleStrain1 : this.puzzleStrain2;
				array[puzzleIndex] = puzzle2;

				if (zone.type !== ZoneType.Use) return false;
				if (!this.RequiredItemForZoneWasNotPlaced(zone)) return false;

				const npc = this.findUnusedNPCForZoneRandomly(zone);
				if (npc === null) return false;

				const requiredItem = array[puzzleIndex].item1;
				if (!this.ZoneLeadsToRequiredItem(zone, requiredItem)) return false;

				const findItem = array[puzzleIndex + 1].item1;
				if (!this.ZoneLeadsToProvidedItem(zone, findItem)) return false;

				if (!this.DropNPCAtHotspotRandomly(zone, npc)) return false;

				this.npc = npc;
				this.findItem = findItem;
				this.requiredItem = requiredItem;
				this.currentPuzzleIndex = puzzleIndex;

				this.AddRequiredItemQuest(npc, distance);
				this.addRequiredItemQuestsFromHotspots(zone);

				this.usedPuzzles.push(puzzle2);

				this.AddRequiredItemQuest(puzzleItem, distance);
				return true;
			}
			case ZoneType.Find:
			case ZoneType.FindTheForce:
				if (!this.DropItemAtHotspotRandomly(zone, providedItem)) {
					return false;
				}

				this.AddRequiredItemQuest(providedItem, distance);
				this.findItem = providedItem;
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
			this.errorWhen(!point, `No place to find item ${quest.item} found!`);

			const zone = this.GetUnusedZoneRandomly(ZoneType.Find, -1, -1, quest.item, null, quest.distance, false);
			this.errorWhen(!zone, "No zone for puzzle found");
			this.placeZone(point.x, point.y, zone, ZoneType.Find, { findItem: this.findItem });
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
				if (
					worldItemType !== WorldItemType.Empty &&
					worldItemType !== WorldItemType.Candidate &&
					worldItemType !== WorldItemType.Island
				)
					continue;

				const distance = GetDistanceToCenter(x, y);
				this.somethingWithTeleporters = +(worldItemType === WorldItemType.Island || distance < 2);

				let zone = null;
				if (this.somethingWithTeleporters || !foundTeleporterTarget) {
					zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, null, null, distance, false);
				} else zone = lastZone;

				this.errorWhen(!zone, "No zone found");
				while (1) {
					if (this.somethingWithTeleporters) break;

					const hasTeleporter = zone.hotspots.find(htsp => htsp.type === HotspotType.Teleporter);
					if (!hasTeleporter) break;

					if (!teleportersFound) {
						teleportersFound++;
						teleporterSource = new Point(x, y);
						break;
					}

					let distance = this._size === WorldSize.Large ? 2 : 1;
					if (Math.abs(teleporterSource.x - x) > distance || Math.abs(teleporterSource.y - y) > distance) {
						teleportersFound++;
						teleporterSource = new Point(x, y);
						if (!foundTeleporterTarget) break;

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
			this.somethingWithTeleporters = 1;

			const distance = GetDistanceToCenter(teleporterSource.x, teleporterSource.y);
			const zone = this.GetUnusedZoneRandomly(ZoneType.Empty, -1, -1, null, null, distance, false);
			if (zone) {
				this.placeZone(teleporterSource.x, teleporterSource.y, zone, ZoneType.Empty);
			}
		}

		return true;
	}

	WritePlanetValues() {}

	PuzzleUsedInLastGame(puzzle: Puzzle, planet: Planet) {
		return false;
	}

	hasPuzzleBeenPlaced(puzzle: Puzzle): boolean {
		return this.usedPuzzles.contains(puzzle);
	}

	ZoneLeadsToRequiredItem(zone: Zone, targetItem: Tile): boolean {
		return this._traverseZoneUntil(
			zone,
			({ requiredItems }: Zone) => requiredItems.contains(targetItem),
			false,
			identity
		);
	}

	ZoneLeadsToProvidedItem(zone: Zone, targetItem: Tile): boolean {
		return this._traverseZoneUntil(
			zone,
			({ providedItems }: Zone) => providedItems.contains(targetItem),
			false,
			identity
		);
	}

	HasQuestRequiringItem(item: Tile) {
		return this.requiredItemQuests.find(quest => quest.item === item);
	}

	AddProvidedItemQuest(item: Tile, maximumDistance: number): Quest {
		const quest = new Quest(item, maximumDistance);
		this.providedItemQuests.unshift(quest);
		return quest;
	}

	AddRequiredItemQuest(item: Tile, maximumDistance: number): Quest {
		const quest = new Quest(item, maximumDistance);
		this.requiredItemQuests.push(quest);
		return quest;
	}

	RemoveQuestRequiringItem(item: Tile): void {
		this.requiredItemQuests.splice(this.requiredItemQuests.findIndex(t => t.item === item), 1);
	}

	RemoveQuestProvidingItem(item: Tile): void {
		this.providedItemQuests.splice(this.providedItemQuests.findIndex(t => t.item === item), 1);
	}

	RequiredItemForZoneWasNotPlaced(zone: Zone): boolean {
		for (const hotspot of zone.hotspots) {
			if (hotspot.arg === -1) continue;
			if (hotspot.type.canHoldItem() && this.HasQuestRequiringItem(this.lookupTileById(hotspot.arg)))
				return false;
			if (
				hotspot.type === HotspotType.DoorIn &&
				!this.RequiredItemForZoneWasNotPlaced(this.lookupZoneById(hotspot.arg))
			)
				return false;
		}

		return true;
	}

	addRequiredItemQuestsFromHotspots(zone: Zone): void {
		zone.hotspots.forEach(hotspot => {
			if (hotspot.arg === -1) return;
			if (hotspot.type.canHoldItem()) this.AddRequiredItemQuest(this.lookupTileById(hotspot.arg), -1);
			if (hotspot.type === HotspotType.DoorIn)
				this.addRequiredItemQuestsFromHotspots(this.lookupZoneById(hotspot.arg));
		});
	}

	ChooseItemFromZone(zone: Zone, item: Tile, fromAssignedItems: boolean) {
		return this._traverseZoneUntil(
			zone,
			zone => {
				const items = fromAssignedItems ? zone.goalItems : zone.requiredItems;
				return items.contains(item);
			},
			false,
			identity
		);
	}

	findUnusedNPCForZoneRandomly(zone: Zone): Tile {
		return this._traverseZoneUntil(
			zone,
			zone => {
				const npcCandidates = zone.puzzleNPCs.filter(npc => !this.HasQuestRequiringItem(npc));
				if (!npcCandidates.length) return null;

				return npcCandidates[rand() % npcCandidates.length];
			},
			null
		);
	}

	zoneLeadsToNPC(zone: Zone, npc: Tile): boolean {
		return this._traverseZoneUntil(zone, zone => !!zone.puzzleNPCs.find(t => t === npc), false, identity);
	}

	GetUnusedRequiredItemForZoneRandomly(zone: Zone, isGoal: boolean): Tile {
		return this._traverseZoneUntil(
			zone,
			zone => {
				const items = isGoal ? zone.goalItems : zone.requiredItems;
				const item = items.filter(id => !this.HasQuestRequiringItem(id));
				if (!item.length) return null;

				return item[rand() % item.length];
			},
			null
		);
	}

	_traverseZoneUntil<T>(
		zone: Zone,
		callback: ((_: Zone) => T),
		defaultReturn: T,
		predicate = (result: T) => result !== defaultReturn
	): T {
		const result = callback(zone);
		if (predicate(result)) {
			return result;
		}

		const hotspots = zone.hotspots.withType(HotspotType.DoorIn).filter(htsp => htsp.arg !== -1);
		for (const hotspot of hotspots) {
			const result = this._traverseZoneUntil(
				this.lookupZoneById(hotspot.arg),
				callback,
				defaultReturn,
				predicate
			);
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
				if (
					(x < 1 || world[idx - 1] !== WorldItemType.Puzzle.rawValue) &&
					(x > 8 || world[idx + 1] !== WorldItemType.Puzzle.rawValue) &&
					(y < 1 || world[idx - 10] !== WorldItemType.Puzzle.rawValue) &&
					(y > 8 || world[idx + 10] !== WorldItemType.Puzzle.rawValue)
				)
					bestPoints.push(point);
				else pointsCloseToPuzzles.push(point);
			}
		});

		if (bestPoints.length) return bestPoints;
		if (pointsCloseToPuzzles.length) return pointsCloseToPuzzles;
		if (farPoints.length) return farPoints;

		return null;
	}

	GetPuzzleCandidates(zoneType: ZoneType): Puzzle[] {
		return this._data.puzzles.filter(puzzle => {
			switch (zoneType) {
				case ZoneType.Find:
				case ZoneType.FindTheForce:
					return false;
				case ZoneType.Use:
				case ZoneType.Trade:
				case ZoneType.Goal:
					return !this.hasPuzzleBeenPlaced(puzzle) && puzzle.type === zoneType.toPuzzleType();
				case ZoneType.Unknown:
					return (
						puzzle.type === PuzzleType.End &&
						(!this.PuzzleUsedInLastGame(puzzle, this._planet) || this.goalPuzzle !== null) &&
						puzzle.isGoalOnPlanet(this._planet)
					);
				default:
					return true;
			}
		});
	}

	DropItemAtTriggerHotspotRandomly(zone: Zone, item: Tile) {
		return this._traverseZoneUntil(
			zone,
			zone => {
				if (!zone.providedItems.find(t => t === item)) return false;

				const candidates = zone.hotspots.withType(HotspotType.TriggerLocation);
				return this.placeItemAtHotspotRandomly(candidates, item);
			},
			false,
			identity
		);
	}

	placeItemAtHotspotRandomly(candidates: Hotspot[], item: Tile): boolean {
		if (!candidates.length) return false;

		const hotspot = candidates[rand() % candidates.length];
		return this.DropItemAtHotspot(item, hotspot);
	}

	DropItemAtLockHotspot(zone: Zone, item: Tile) {
		return this._traverseZoneUntil(
			zone,
			zone => {
				if (!zone.requiredItems.find(t => t === item)) return false;

				const hotspot = zone.hotspots.withType(HotspotType.Lock);
				if (!hotspot.length) return false;

				return this.DropItemAtHotspot(item, hotspot[0]);
			},
			false,
			identity
		);
	}

	DropItemAtHotspot(item: Tile, hotspot: Hotspot): boolean {
		if (!hotspot) return false;
		hotspot.arg = item.id;
		hotspot.enabled = true;
		return true;
	}

	DropNPCAtHotspotRandomly(zone: Zone, npc: Tile) {
		const isFree = ({ arg }: Hotspot) => arg === -1;

		return this._traverseZoneUntil(
			zone,
			zone => {
				if (!zone.puzzleNPCs.find(t => t === npc)) return false;
				const candidates = zone.hotspots.withType(HotspotType.SpawnLocation).filter(isFree);
				return this.placeItemAtHotspotRandomly(candidates, npc);
			},
			false,
			identity
		);
	}

	DropItemAtHotspotRandomly(zone: Zone, item: Tile): boolean {
		if (!this.RequiredItemForZoneWasNotPlaced(zone)) {
			return false;
		}

		return this._traverseZoneUntil(
			zone,
			zone => {
				if (!zone.providedItems.find(t => t === item)) return false;
				const hotspotType = item.attributes.toHotspotType();
				const candidates = zone.hotspots.withType(hotspotType);
				return this.placeItemAtHotspotRandomly(candidates, item);
			},
			false,
			identity
		);
	}

	placeZone(x: number, y: number, zone: Zone, type: ZoneType, options: Partial<WorldItem> = {}) {
		const idx = x + 10 * y;
		this.world.index(idx).zone = zone;
		this.world.index(idx).zoneType = type;
		this.world.index(idx).puzzleIndex = options.puzzleIndex !== undefined ? options.puzzleIndex : -1;
		this.world.index(idx).requiredItem = options.requiredItem !== undefined ? options.requiredItem : null;
		this.world.index(idx).npc = options.npc !== undefined ? options.npc : null;
		this.world.index(idx).findItem = options.findItem !== undefined ? options.findItem : null;
		this.world.index(idx).additionalRequiredItem =
			options.additionalRequiredItem !== undefined ? options.additionalRequiredItem : null;
		if (zone !== null && type !== ZoneType.Town) this.usedZones.unshift(zone);
	}

	errorWhen(condition: boolean, message: string) {
		if (!condition) return;

		const error = new WorldGenerationError(message);
		error.seed = this._seed;
		error.size = this._size;
		error.planet = this._planet;
		throw error;
	}

	get initialItem(): Tile {
		return this.puzzleStrain2[0].item1;
	}

	get goalPuzzle(): Puzzle {
		return this.usedPuzzles[0] || null;
	}

	private lookupTileById(id: number): Tile {
		return this._data.tiles[id] || null;
	}

	private lookupZoneById(id: number): Zone {
		return this._data.zones[id] || null;
	}
}

export default WorldGenerator;
