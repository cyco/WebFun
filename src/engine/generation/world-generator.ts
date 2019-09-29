import { HorizontalPointRange, Point, VerticalPointRange, constantly, identity, rand, srand } from "src/util";
import { Hotspot, Puzzle, Tile, Zone } from "src/engine/objects";
import { Planet, WorldSize } from "src/engine/types";
import { abs, floor } from "src/std/math";
import { and, not } from "src/util/functional";

import AssetManager, { NullIfMissing } from "src/engine/asset-manager";
import GetDistanceToCenter from "./distance-to-center";
import Map from "./map";
import MapGenerator from "./map-generator";
import Quest from "./quest";
import World from "src/engine/world";
import WorldGenerationError from "./world-generation-error";
import Sector from "src/engine/sector";
import SectorType from "./sector-type";
import RoomIterator from "../room-iterator";
import { Yoda } from "src/engine/type";
import { MutablePuzzle } from "src/engine/mutable-objects";

declare global {
	interface Array<T> {
		withType(type: Hotspot.Type): Hotspot[];
	}
}

class WorldGenerator {
	public world: World = null;
	private _seed: number = 0;
	private _size: WorldSize;
	private _planet: Planet;
	private _assets: AssetManager;

	private usedZones: Zone[] = [];
	private mapGenerator: MapGenerator = null;
	private additionalRequiredItem: Tile = null;
	private providedItemQuests: Quest[] = [];
	private usedPuzzles: Puzzle[] = [];
	private puzzleStrain1: Puzzle[] = [];
	private puzzleStrain2: Puzzle[] = [];
	private requiredItemQuests: Quest[] = [];
	private currentPuzzleIndex: number = -1;
	private requiredItem: Tile = null;
	private findItem: Tile = null;
	private npc: Tile = null;
	private somethingWithTeleporters: number = -1;
	private puzzlesCanBeReused: number = 0;
	private usedAlternateStrain: boolean = false;

	constructor(size: WorldSize, planet: Planet, assets: AssetManager) {
		this._size = size;
		this._planet = planet;
		this._assets = assets;
	}

	public generate(seed: number, gamesWon: number = 0): boolean {
		this._seed = seed;
		srand(this._seed);

		const mapGenerator = (this.mapGenerator = new MapGenerator());
		mapGenerator.generate(-1, this._size);

		this.world = new World(this._assets);
		for (let i = 0; i < 100; i++) {
			this.world.at(i).puzzleIndex = mapGenerator.orderMap[i];
		}

		const puzzleCount = mapGenerator.puzzleCount;
		const puzzles1Count = floor(puzzleCount % 2 === 1 ? (puzzleCount + 1) / 2 : puzzleCount / 2 + 1);
		const puzzles2Count = floor(puzzleCount % 2 === 1 ? (puzzleCount + 1) / 2 : puzzleCount / 2);

		this.puzzleStrain1 = Array.Repeat(null, puzzles1Count + 1);
		this.puzzleStrain2 = Array.Repeat(null, puzzles2Count + 1);

		this.currentPuzzleIndex = -1;

		this.usedPuzzles = [];

		this.providedItemQuests = [];
		this.requiredItemQuests = [];

		// FIXME: Two puzzles are only available after a certain amount of games have been won. This is basically
		// what the original implementation did, but there's got to be a better way.
		if (gamesWon >= 1) {
			const puzzle: MutablePuzzle = this._assets.get(Puzzle, Yoda.goalIDs.RESCUE_YODA) as any;
			puzzle.type = Puzzle.Type.End;
		}

		if (gamesWon >= 10) {
			const puzzle: MutablePuzzle = this._assets.get(Puzzle, Yoda.goalIDs.CAR) as any;
			puzzle.type = Puzzle.Type.End;
		}

		const goalPuzzle = this.getUnusedPuzzleRandomly(null, Zone.Type.Unknown);
		if (goalPuzzle === null) {
			return false;
		}
		this.usedPuzzles.push(goalPuzzle);
		this.puzzleStrain1[puzzles1Count] = goalPuzzle;
		this.puzzleStrain2[puzzles2Count] = goalPuzzle;

		this.determineTransportZones();
		this.determineGoalZone(puzzleCount, puzzles2Count, mapGenerator.orderMap);

		this.determineQuestZones(puzzleCount, mapGenerator.orderMap);
		this.placePuzzlesZones(puzzles2Count - 1, mapGenerator.orderMap);
		this.determineBlockadeAndTownZones(mapGenerator.typeMap);

		this.addProvidedItemQuest(this.lookupTileById(Yoda.tileIDs.TheForce), 2);
		this.addProvidedItemQuest(this.lookupTileById(Yoda.tileIDs.Locator), 1);
		this.determineFindZones(mapGenerator.typeMap);
		this.determineTeleporters(mapGenerator.typeMap);

		// waste another random number
		rand();

		this.writePlanetValues();

		return true;
	}

	private determineTransportZones(): void {
		const typeMap = this.mapGenerator.typeMap;
		const isTravelTarget = (point: Point) => {
			const index = point.x + point.y * 10;
			return typeMap[index] === SectorType.TravelEnd && !this.world.at(index).zone;
		};

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (typeMap[x + y * 10] !== SectorType.TravelStart) continue;

				this.resetState();

				const distance = GetDistanceToCenter(x, y);
				const zone = this.getUnusedZoneRandomly(
					Zone.Type.TravelStart,
					-1,
					-1,
					null,
					null,
					distance,
					true
				);
				if (!zone) continue;

				this.placeZone(x, y, zone, Zone.Type.TravelStart, {
					requiredItem: this.requiredItem
				});

				const vehicleHotspot = zone.hotspots.withType(Hotspot.Type.VehicleTo).first();
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

					this.placeZone(travelTarget.x, travelTarget.y, connectedZone, Zone.Type.TravelEnd, {
						requiredItem: this.requiredItem
					});
				} else {
					this.removeQuestProvidingItem(this.requiredItem);
					this.placeZone(x, y, null, Zone.Type.None);
				}
			}
		}
	}

	private loopWorld(
		map: Map,
		callback: (v: SectorType, x: number, y: number, id: number, map: Map) => void
	): void {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				callback(map[x + 10 * y], x, y, x + 10 * y, map);
			}
		}
	}

	private zoneTypeForSectorType(t: SectorType): Zone.Type {
		switch (t) {
			case SectorType.Spaceport:
				return Zone.Type.Town;
			case SectorType.BlockEast:
				return Zone.Type.BlockadeEast;
			case SectorType.BlockWest:
				return Zone.Type.BlockadeWest;
			case SectorType.BlockNorth:
				return Zone.Type.BlockadeNorth;
			case SectorType.BlockSouth:
				return Zone.Type.BlockadeSouth;
			default:
				return Zone.Type.Empty;
		}

		return Zone.Type.None;
	}

	private determineBlockadeAndTownZones(map: Map): void {
		this.loopWorld(map, (sectorType, x, y) => {
			const type = this.zoneTypeForSectorType(sectorType);
			if (!(type.isBlockadeType() || type === Zone.Type.Town)) return;

			this.resetState();

			const distance = GetDistanceToCenter(x, y);
			let zone = this.getUnusedZoneRandomly(type, -1, -1, null, null, distance, false);
			if (!zone)
				zone = this.getUnusedZoneRandomly(Zone.Type.Empty, -1, -1, null, null, distance, false);
			if (!zone) return;

			const options: Partial<Sector> = {};
			if (type !== Zone.Type.Town) options.requiredItem = this.requiredItem;
			this.placeZone(x, y, zone, zone.type, options);
		});
	}

	private findPositionOfPuzzle(orderIdx: number, orderMap: Map): Point {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (orderMap[x + 10 * y] === orderIdx) return new Point(x, y);
			}
		}
		return null;
	}

	private placePuzzlesZones(puzzleMapIdx: number, puzzles: Map): void {
		for (let puzzleIndex = puzzleMapIdx; puzzleIndex > 0; puzzleIndex--) {
			this.resetState();

			const point = this.findPositionOfPuzzle(puzzleIndex - 1, puzzles);
			const distance = GetDistanceToCenter(point.x, point.y);

			const puzzle = this.puzzleStrain2[puzzleIndex];
			const item1 = puzzle.item1;

			let type = rand() % 2 ? Zone.Type.Use : Zone.Type.Trade;
			let zone = this.getUnusedZoneRandomly(type, puzzleIndex - 1, -1, item1, null, distance, false);

			if (!zone) {
				type = type === Zone.Type.Use ? Zone.Type.Trade : Zone.Type.Use;
				zone = this.getUnusedZoneRandomly(type, puzzleIndex - 1, -1, item1, null, distance, false);
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

	private determineGoalZone(puzzleCount: number, puzzles2Count: number, puzzles: Map): void {
		this.resetState();

		const puzzle = this.puzzleStrain1[this.puzzleStrain1.length - 1];
		const pos = this.findPositionOfPuzzle(puzzleCount - 1, puzzles);
		const distance = GetDistanceToCenter(pos.x, pos.y);
		const worldPuzzleIndex = puzzles[pos.x + 10 * pos.y];
		const zone = this.getUnusedZoneRandomly(
			Zone.Type.Goal,
			this.puzzleStrain1.length - 2,
			puzzles2Count - 1,
			puzzle.item1,
			puzzle.item2 ? puzzle.item2 : null,
			distance,
			true
		);
		this.errorWhen(!zone, "Unable to find suitable goal zone.");
		this.placeZone(pos.x, pos.y, zone, Zone.Type.Goal, {
			findItem: this.findItem,
			puzzleIndex: worldPuzzleIndex - 1,
			requiredItem: this.requiredItem,
			npc: null,
			additionalRequiredItem: this.usedPuzzles[2].item1
		});
	}

	private resetState(): void {
		this.requiredItem = null;
		this.findItem = null;
		this.npc = null;
		this.currentPuzzleIndex = -1;
		this.additionalRequiredItem = null;
	}

	private determineQuestZones(puzzleCount: number, puzzles: Map): void {
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
			let maxCount = 10000;
			do {
				maxCount--;
				if (maxCount === 0) {
					break;
				}
				let type = rand() % 2 ? Zone.Type.Trade : Zone.Type.Use;
				zone = this.getUnusedZoneRandomly(type, puzzleIdIndex - 1, -1, item1, null, distance, true);

				if (!zone) {
					type = type === Zone.Type.Use ? Zone.Type.Trade : Zone.Type.Use;
					zone = this.getUnusedZoneRandomly(
						type,
						puzzleIdIndex - 1,
						-1,
						item1,
						null,
						distance,
						true
					);
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
					this.addProvidedItemQuest(this.requiredItem, distance);
					break;
				}
			} while (!zone);
			previousPuzzleIndex--;
		}
	}

	private getUnusedPuzzleRandomly(item: Tile, zoneType: Zone.Type): Puzzle {
		const puzzles = this.getPuzzleCandidates(zoneType).shuffle();
		const puzzleType = zoneType.toPuzzleType();
		const typeIsCompatible = (puzzle: Puzzle) => puzzle.type === puzzleType;
		const hasPuzzleBeenPlaced = (puzzle: Puzzle) => this.hasPuzzleBeenPlaced(puzzle);

		let hasRequiredItem = ({ item1 }: Puzzle) => item1 === item;
		if (zoneType === Zone.Type.Unknown) hasRequiredItem = constantly(true);

		return puzzles.find(and(typeIsCompatible, not(hasPuzzleBeenPlaced), hasRequiredItem));
	}

	private getUnusedZoneRandomly(
		zoneType: Zone.Type,
		puzzleIndex: number,
		puzzleIndex2: number,
		providedItem: Tile,
		providedItem2: Tile,
		distance: number,
		a8: boolean
	): Zone {
		this.usedAlternateStrain = a8;
		let zoneMatchesType = (zone: Zone) => zone.type === zoneType;
		if (zoneType === Zone.Type.Find || zoneType === Zone.Type.FindUniqueWeapon)
			zoneMatchesType = zone =>
				zone.type === Zone.Type.Find || zone.type === Zone.Type.FindUniqueWeapon;
		const zoneMatchesPlanet = (zone: Zone) => zone.planet === this._planet;
		const zoneIsUnused = (zone: Zone) =>
			!this.usedZones.contains(zone) || (zoneType === Zone.Type.Goal && this.puzzlesCanBeReused > 0);
		const usableZones = this._assets.getFiltered(Zone, and(zoneMatchesPlanet, zoneMatchesType)).shuffle();
		return usableZones
			.filter(zoneIsUnused)
			.find((zone: Zone) =>
				this.getUnusedZone(zone, puzzleIndex, puzzleIndex2, providedItem, providedItem2, distance, a8)
			);
	}

	private getUnusedZone(
		zone: Zone,
		puzzleIndex: number,
		puzzleIndex2: number,
		providedItem: Tile,
		providedItem2: Tile,
		distance: number,
		a8: boolean
	): boolean {
		this.usedAlternateStrain = a8;
		switch (zone.type) {
			case Zone.Type.Town:
				return true;
			case Zone.Type.BlockadeNorth:
			case Zone.Type.TravelStart:
			case Zone.Type.BlockadeWest:
			case Zone.Type.BlockadeSouth:
			case Zone.Type.BlockadeEast:
			case Zone.Type.TravelEnd:
				if (!this.requiredItemForZoneWasNotPlaced(zone)) {
					return false;
				}
				const itemCandidates = zone.requiredItems.filter(
					itemID => !this.hasQuestRequiringItem(itemID)
				);
				if (itemCandidates.length === 0) {
					return false;
				}
				const item = itemCandidates[rand() % itemCandidates.length];
				this.addProvidedItemQuest(item, zone.type === Zone.Type.TravelStart ? 5 : distance);
				this.addRequiredItemQuest(item, distance);
				this.requiredItem = item;
				this.addRequiredItemQuestsFromHotspots(zone);

				return true;
			case Zone.Type.Empty:
				if (this.somethingWithTeleporters) {
					const count = zone.hotspots.length;
					if (!count) {
						return true;
					}
					// used to iterate through all teleporter hotspots here
					return false;
				}

				return true;
			case Zone.Type.Goal:
				if (!this.zoneLeadsToProvidedItem(zone, providedItem)) return false;
				if (!this.zoneLeadsToProvidedItem(zone, providedItem2)) return false;

				const newPuzzleItem1 = this.getUnusedRequiredItemForZoneRandomly(zone, false);
				const newPuzzleItem2 = this.getUnusedRequiredItemForZoneRandomly(zone, true);
				if (newPuzzleItem1 === null || newPuzzleItem2 === null) return false;
				const newPuzzle = this.getUnusedPuzzleRandomly(newPuzzleItem1, Zone.Type.Goal);
				if (newPuzzle) this.usedPuzzles.push(newPuzzle);
				const aapuzzle = this.getUnusedPuzzleRandomly(newPuzzleItem2, Zone.Type.Goal);
				if (aapuzzle) {
					this.usedPuzzles.push(aapuzzle);
				}
				if (!newPuzzle || !aapuzzle) return false;

				this.puzzleStrain1[puzzleIndex] = newPuzzle;
				this.puzzleStrain2[puzzleIndex2] = aapuzzle;
				if (!this.requiredItemForZoneWasNotPlaced(zone)) {
					return false;
				}

				const puzzle1 = this.puzzleStrain1[puzzleIndex];
				const puzzle2 = this.puzzleStrain2[puzzleIndex2];
				const puzzle3 = this.puzzleStrain1[puzzleIndex + 1];

				const npc = this.findUnusedNPCForZoneRandomly(zone);
				const hasNPC = npc !== null ? this.zoneLeadsToNPC(zone, npc) : 0;

				let hasItem = 1;
				// TODO: this used to be &= which might evaluate the second expression in any case
				hasItem = +hasItem & +this.zoneLeadsToRequiredItem(zone, puzzle1.item1);
				// this.ZoneLeadsToRequiredItem(zone, puzzle2.item_1, 1);
				hasItem = +hasItem & +this.zoneLeadsToProvidedItem(zone, puzzle3.item1);
				this.zoneLeadsToProvidedItem(zone, puzzle3.item2 ? puzzle3.item2 : null);

				if (!hasItem) {
					return false;
				}

				if (hasNPC) {
					this.addRequiredItemQuestsFromHotspots(zone);

					this.npc = npc;
					this.findItem = null;
					this.requiredItem = puzzle1.item1;
					this.currentPuzzleIndex = puzzleIndex;
					this.additionalRequiredItem = null;
					this.addRequiredItemQuestsFromHotspots(zone);
				} else {
					let didAddItem = 1;
					// TODO: this used to be &= which might evaluate the second expression in any case
					didAddItem = didAddItem & +this.chooseItemFromZone(zone, puzzle1.item1, false);
					didAddItem = didAddItem & +this.placeQuestItem(zone, puzzle3.item1);

					didAddItem = didAddItem & +this.chooseItemFromZone(zone, puzzle2.item1, true);
					didAddItem =
						didAddItem & +this.placeQuestItem(zone, puzzle3.item2 ? puzzle3.item2 : null);

					if (!didAddItem) return false;

					this.addRequiredItemQuest(puzzle1.item1, distance);
					this.addRequiredItemQuest(puzzle2.item1, distance);
					this.addRequiredItemQuest(puzzle3.item1, distance);
					this.addRequiredItemQuest(puzzle3.item2 ? puzzle3.item2 : null, distance);

					this.npc = null;
					this.findItem = puzzle3.item1;
					this.requiredItem = puzzle1.item1;
					this.currentPuzzleIndex = puzzleIndex;
					this.additionalRequiredItem = null;
					this.addRequiredItemQuestsFromHotspots(zone);
				}
				this.addRequiredItemQuest(newPuzzleItem1, distance);
				this.addRequiredItemQuest(newPuzzleItem2, distance);
				return true;
			case Zone.Type.Trade:
				if (!this.zoneLeadsToProvidedItem(zone, providedItem)) return false;
				const requiredItem = this.getUnusedRequiredItemForZoneRandomly(zone, false);
				if (requiredItem === null) return false;
				const puzzle = this.getUnusedPuzzleRandomly(requiredItem, Zone.Type.Trade);
				if (!puzzle) return false;

				const array = a8 ? this.puzzleStrain1 : this.puzzleStrain2;
				array[puzzleIndex] = puzzle;

				const p1 = array[puzzleIndex];
				const p2 = array[puzzleIndex + 1];

				this.addRequiredItemQuest(p1.item1, distance);
				this.addRequiredItemQuest(p2.item1, distance);

				if (!this.requiredItemForZoneWasNotPlaced(zone)) {
					this.removeQuestRequiringItem(p1.item1);

					return false;
				}

				if (this.dropItemAtLockHotspot(zone, p1.item1)) {
					this.addRequiredItemQuest(p1.item1, distance);
					this.requiredItem = p1.item1;

					if (this.placeQuestItem(zone, p2.item1)) {
						this.addRequiredItemQuest(p2.item1, distance);
						this.findItem = p2.item1;
					}
				}

				this.addRequiredItemQuestsFromHotspots(zone);

				this.usedPuzzles.push(puzzle);
				this.addRequiredItemQuest(requiredItem, distance);

				return true;
			case Zone.Type.Use: {
				if (!this.zoneLeadsToProvidedItem(zone, providedItem)) return false;
				const puzzleItem = this.getUnusedRequiredItemForZoneRandomly(zone, false);
				if (puzzleItem === null) return false;

				const puzzle2 = this.getUnusedPuzzleRandomly(puzzleItem, Zone.Type.Use);
				if (!puzzle2) return false;

				const array = a8 ? this.puzzleStrain1 : this.puzzleStrain2;
				array[puzzleIndex] = puzzle2;

				if (zone.type !== Zone.Type.Use) return false;
				if (!this.requiredItemForZoneWasNotPlaced(zone)) return false;

				const npc = this.findUnusedNPCForZoneRandomly(zone);
				if (npc === null) return false;

				const requiredItem = array[puzzleIndex].item1;
				if (!this.zoneLeadsToRequiredItem(zone, requiredItem)) return false;

				const findItem = array[puzzleIndex + 1].item1;
				if (!this.zoneLeadsToProvidedItem(zone, findItem)) return false;

				if (!this.dropNPCAtHotspotRandomly(zone, npc)) return false;

				this.npc = npc;
				this.findItem = findItem;
				this.requiredItem = requiredItem;
				this.currentPuzzleIndex = puzzleIndex;

				this.addRequiredItemQuest(npc, distance);
				this.addRequiredItemQuestsFromHotspots(zone);

				this.usedPuzzles.push(puzzle2);

				this.addRequiredItemQuest(puzzleItem, distance);
				return true;
			}
			case Zone.Type.Find:
			case Zone.Type.FindUniqueWeapon:
				if (!this.dropItemAtHotspotRandomly(zone, providedItem)) {
					return false;
				}

				this.addRequiredItemQuest(providedItem, distance);
				this.findItem = providedItem;
				this.addRequiredItemQuestsFromHotspots(zone);

				return true;
			default:
				return false;
		}
	}

	private determineFindZones(world: Map): void {
		for (const quest of this.providedItemQuests) {
			const candidates = this.determinePuzzleLocationChoices(world, quest.distance);
			const point = candidates[rand() % candidates.length];
			this.errorWhen(!point, `No place to find item ${quest.item} found!`);

			const zone = this.getUnusedZoneRandomly(
				Zone.Type.Find,
				-1,
				-1,
				quest.item,
				null,
				quest.distance,
				false
			);
			this.errorWhen(!zone, "No zone for puzzle found");
			this.placeZone(point.x, point.y, zone, Zone.Type.Find, { findItem: this.findItem });
			const idx = point.x + 10 * point.y;
			world[idx] = SectorType.Puzzle;
		}
	}

	private determineTeleporters(world: Map): boolean {
		let teleporterSource = null;
		let lastZone = null;

		let foundTeleporterTarget = false;
		let teleportersFound = 0;

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const sectorType = world[x + 10 * y];
				if (
					sectorType !== SectorType.Empty &&
					sectorType !== SectorType.Candidate &&
					sectorType !== SectorType.Island
				)
					continue;

				const distance = GetDistanceToCenter(x, y);
				this.somethingWithTeleporters = +(sectorType === SectorType.Island || distance < 2);

				let zone = null;
				if (this.somethingWithTeleporters || !foundTeleporterTarget) {
					zone = this.getUnusedZoneRandomly(Zone.Type.Empty, -1, -1, null, null, distance, false);
				} else zone = lastZone;

				this.errorWhen(!zone, "No zone found");
				let maxCount = 5000;
				while (true) {
					maxCount--;
					if (maxCount === 0) {
						break;
					}
					if (this.somethingWithTeleporters) break;

					const hasTeleporter = zone.hotspots.withType(Hotspot.Type.Teleporter).first();
					if (!hasTeleporter) break;

					if (!teleportersFound) {
						teleportersFound++;
						teleporterSource = new Point(x, y);
						break;
					}

					const distance = this._size === WorldSize.Large ? 2 : 1;
					if (abs(teleporterSource.x - x) > distance || abs(teleporterSource.y - y) > distance) {
						teleportersFound++;
						teleporterSource = new Point(x, y);
						if (!foundTeleporterTarget) break;

						foundTeleporterTarget = false;
						lastZone = null;
						break;
					}

					lastZone = zone;
					foundTeleporterTarget = true;
					zone = this.getUnusedZoneRandomly(Zone.Type.Empty, -1, -1, null, null, distance, false);
					this.errorWhen(!zone, "No zone found");
				}

				this.placeZone(x, y, zone ? zone : null, Zone.Type.Empty);
			}
		}

		if (teleportersFound === 1) {
			this.somethingWithTeleporters = 1;

			const distance = GetDistanceToCenter(teleporterSource.x, teleporterSource.y);
			const zone = this.getUnusedZoneRandomly(Zone.Type.Empty, -1, -1, null, null, distance, false);
			if (zone) {
				this.placeZone(teleporterSource.x, teleporterSource.y, zone, Zone.Type.Empty);
			}
		}

		return true;
	}

	private writePlanetValues(): void {}

	private puzzleUsedInLastGame(_: Puzzle, _2: Planet): boolean {
		return false;
	}

	private hasPuzzleBeenPlaced(puzzle: Puzzle): boolean {
		return this.usedPuzzles.contains(puzzle);
	}

	private zoneLeadsToRequiredItem(zone: Zone, targetItem: Tile): boolean {
		return this._traverseZoneUntil(
			zone,
			({ requiredItems }: Zone) => requiredItems.contains(targetItem),
			false,
			identity
		);
	}

	private zoneLeadsToProvidedItem(zone: Zone, targetItem: Tile): boolean {
		return this._traverseZoneUntil(
			zone,
			({ providedItems }: Zone) => providedItems.contains(targetItem),
			false,
			identity
		);
	}

	private hasQuestRequiringItem(item: Tile): boolean {
		return !!this.requiredItemQuests.find(quest => quest.item === item);
	}

	private addProvidedItemQuest(item: Tile, maximumDistance: number): Quest {
		const quest = new Quest(item, maximumDistance);
		this.providedItemQuests.unshift(quest);
		return quest;
	}

	private addRequiredItemQuest(item: Tile, maximumDistance: number): Quest {
		const quest = new Quest(item, maximumDistance);
		this.requiredItemQuests.push(quest);
		return quest;
	}

	private removeQuestRequiringItem(item: Tile): void {
		const index = this.requiredItemQuests.findIndex(t => t.item === item);
		if (index === -1) return;
		this.requiredItemQuests.splice(index, 1);
	}

	private removeQuestProvidingItem(item: Tile): void {
		const index = this.providedItemQuests.findIndex(t => t.item === item);
		if (index === -1) return;
		this.providedItemQuests.splice(index, 1);
	}

	private requiredItemForZoneWasNotPlaced(zone: Zone): boolean {
		for (const hotspot of zone.hotspots) {
			if (hotspot.arg === -1) continue;
			if (hotspot.type.canHoldItem() && this.hasQuestRequiringItem(this.lookupTileById(hotspot.arg)))
				return false;
			if (
				hotspot.type === Hotspot.Type.DoorIn &&
				!this.requiredItemForZoneWasNotPlaced(this.lookupZoneById(hotspot.arg))
			)
				return false;
		}

		return true;
	}

	private addRequiredItemQuestsFromHotspots(zone: Zone): void {
		zone.hotspots.forEach(hotspot => {
			if (hotspot.arg === -1) return;
			if (hotspot.type.canHoldItem()) this.addRequiredItemQuest(this.lookupTileById(hotspot.arg), -1);
			if (hotspot.type === Hotspot.Type.DoorIn)
				this.addRequiredItemQuestsFromHotspots(this.lookupZoneById(hotspot.arg));
		});
	}

	private chooseItemFromZone(zone: Zone, item: Tile, fromAssignedItems: boolean): boolean {
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

	private findUnusedNPCForZoneRandomly(zone: Zone): Tile {
		return this._traverseZoneUntil(
			zone,
			zone => {
				const npcCandidates = zone.npcs.filter(npc => !this.hasQuestRequiringItem(npc));
				if (!npcCandidates.length) return null;

				return npcCandidates[rand() % npcCandidates.length];
			},
			null
		);
	}

	private zoneLeadsToNPC(zone: Zone, npc: Tile): boolean {
		return this._traverseZoneUntil(zone, zone => zone.npcs.includes(npc), false, identity);
	}

	private getUnusedRequiredItemForZoneRandomly(zone: Zone, isGoal: boolean): Tile {
		return this._traverseZoneUntil(
			zone,
			zone => {
				const items = isGoal ? zone.goalItems : zone.requiredItems;
				const item = items.filter(id => !this.hasQuestRequiringItem(id));
				if (!item.length) return null;

				return item[rand() % item.length];
			},
			null
		);
	}

	private _traverseZoneUntil<T>(
		zone: Zone,
		callback: (_: Zone) => T,
		defaultReturn: T,
		predicate = (result: T) => result !== defaultReturn
	): T {
		for (const room of RoomIterator(zone, this._assets)) {
			const result = callback(room);
			if (predicate(result)) {
				return result;
			}
		}

		return defaultReturn;
	}

	private determinePuzzleLocationChoices(world: Map, maxDistance: number): Point[] {
		const farPoints: Point[] = [];
		const bestPoints: Point[] = [];
		const pointsCloseToPuzzles: Point[] = [];

		this.loopWorld(world, (item, x, y, idx) => {
			const point = new Point(x, y);
			if (GetDistanceToCenter(x, y) > maxDistance) {
				if (item === SectorType.Empty) {
					farPoints.push(point);
				}
			} else if (item === SectorType.Empty || item === SectorType.Candidate) {
				if (
					(x < 1 || world[idx - 1] !== SectorType.Puzzle) &&
					(x > 8 || world[idx + 1] !== SectorType.Puzzle) &&
					(y < 1 || world[idx - 10] !== SectorType.Puzzle) &&
					(y > 8 || world[idx + 10] !== SectorType.Puzzle)
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

	private getPuzzleCandidates(zoneType: Zone.Type): Puzzle[] {
		return this._assets.getFiltered(Puzzle, puzzle => {
			switch (zoneType) {
				case Zone.Type.Find:
				case Zone.Type.FindUniqueWeapon:
					return false;
				case Zone.Type.Use:
				case Zone.Type.Trade:
				case Zone.Type.Goal:
					return !this.hasPuzzleBeenPlaced(puzzle) && puzzle.type === zoneType.toPuzzleType();
				case Zone.Type.Unknown:
					return (
						puzzle.type === Puzzle.Type.End &&
						(!this.puzzleUsedInLastGame(puzzle, this._planet) || this.goalPuzzle !== null) &&
						puzzle.isGoalOnPlanet(this._planet)
					);
				default:
					return true;
			}
		});
	}

	private placeQuestItem(zone: Zone, item: Tile): boolean {
		return this._traverseZoneUntil(
			zone,
			zone => {
				if (!zone.providedItems.includes(item)) return false;

				const candidates = zone.hotspots.withType(Hotspot.Type.DropQuestItem);
				return this.placeItemAtHotspotRandomly(candidates, item);
			},
			false,
			identity
		);
	}

	private placeItemAtHotspotRandomly(candidates: Hotspot[], item: Tile): boolean {
		if (!candidates.length) return false;

		const hotspot = candidates[rand() % candidates.length];
		return this.dropItemAtHotspot(item, hotspot);
	}

	private dropItemAtLockHotspot(zone: Zone, item: Tile): boolean {
		return this._traverseZoneUntil(
			zone,
			zone => {
				if (!zone.requiredItems.includes(item)) return false;

				const hotspot = zone.hotspots.withType(Hotspot.Type.Lock);
				if (!hotspot.length) return false;

				return this.dropItemAtHotspot(item, hotspot[0]);
			},
			false,
			identity
		);
	}

	private dropItemAtHotspot(item: Tile, hotspot: Hotspot): boolean {
		if (!hotspot) return false;
		hotspot.arg = item.id;
		hotspot.enabled = true;
		return true;
	}

	private dropNPCAtHotspotRandomly(zone: Zone, npc: Tile): boolean {
		const isFree = ({ arg }: Hotspot) => arg === -1;

		return this._traverseZoneUntil(
			zone,
			zone => {
				if (!zone.npcs.includes(npc)) return false;
				const candidates = zone.hotspots.withType(Hotspot.Type.SpawnLocation).filter(isFree);
				return this.placeItemAtHotspotRandomly(candidates, npc);
			},
			false,
			identity
		);
	}

	private dropItemAtHotspotRandomly(zone: Zone, item: Tile): boolean {
		if (!this.requiredItemForZoneWasNotPlaced(zone)) {
			return false;
		}

		return this._traverseZoneUntil(
			zone,
			zone => {
				if (!zone.providedItems.includes(item)) return false;
				const hotspotType = this.hotspotTypeForTileAttributes(item.attributes);
				const candidates = zone.hotspots.withType(hotspotType);
				return this.placeItemAtHotspotRandomly(candidates, item);
			},
			false,
			identity
		);
	}

	private hotspotTypeForTileAttributes(input: number): Hotspot.Type {
		if ((input & Tile.Attributes.Weapon) !== 0) {
			return Hotspot.Type.DropUniqueWeapon;
		} else if ((input & (1 << Tile.Subtype.Item.Locator)) !== 0) {
			return Hotspot.Type.DropMap;
		} else if ((input & Tile.Attributes.Item) !== 0) {
			return Hotspot.Type.DropQuestItem;
		}
	}

	private placeZone(
		x: number,
		y: number,
		zone: Zone,
		type: Zone.Type,
		options: Partial<Sector> = {}
	): void {
		const idx = x + 10 * y;
		const sector = this.world.at(idx);
		sector.zone = zone;
		sector.zoneType = type;
		sector.puzzleIndex = options.puzzleIndex !== undefined ? options.puzzleIndex : -1;
		sector.requiredItem = options.requiredItem !== undefined ? options.requiredItem : null;
		sector.npc = options.npc !== undefined ? options.npc : null;
		sector.findItem = options.findItem !== undefined ? options.findItem : null;
		sector.additionalRequiredItem =
			options.additionalRequiredItem !== undefined ? options.additionalRequiredItem : null;
		sector.usedAlternateStrain = this.usedAlternateStrain;
		if (zone !== null && type !== Zone.Type.Town) this.usedZones.unshift(zone);
	}

	private errorWhen(condition: boolean, message: string): void {
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

	get puzzles(): [Puzzle[], Puzzle[]] {
		return [this.puzzleStrain1, this.puzzleStrain2];
	}

	private lookupTileById(id: number): Tile {
		return this._assets.get(Tile, id, NullIfMissing);
	}

	private lookupZoneById(id: number): Zone {
		return this._assets.get(Zone, id, NullIfMissing);
	}
}

export default WorldGenerator;
