import { HorizontalPointRange, Point, Range, VerticalPointRange, rand, randmod, srand } from "src/util";

import GetDistanceToCenter from "./distance-to-center";
import IslandBuilder from "./island-builder";
import WorldMap from "./map";
import SectorType from "./sector-type";
import { WorldSize } from "../types";
import { max } from "src/std/math";

const MapWidth = 10;
const MapHeight = 10;

const enum IslandOrientation {
	Left,
	Right,
	Up,
	Down
}

class MapGenerator {
	private min: Point = new Point(0, 0);
	private alternate: Point = new Point(0, 0);
	private variance: number = 0;
	private probablility: number = 0;
	private threshold: number = 0;
	private travelThreshold: number = 0;
	private lastType: SectorType = 0;
	private remainingSectors: number = 0;
	private _typeMap: WorldMap = null;
	private placedSectors: number = 0;
	private blockades: number = 0;
	private travels: number = 0;
	private placedTravels: number = 0;
	private puzzles: number = 0;
	private _orderMap: WorldMap = null;

	private blockadeTypeFor(xdiff: number, ydiff: number): SectorType {
		if (xdiff === 0 && ydiff === 1) {
			return SectorType.BlockNorth;
		}
		if (xdiff === 0 && ydiff === -1) {
			return SectorType.BlockSouth;
		}
		if (xdiff === -1 && ydiff === 0) {
			return SectorType.BlockEast;
		}
		if (xdiff === 1 && ydiff === 0) {
			return SectorType.BlockWest;
		}

		return null;
	}

	private _determineCounts(): void {
		this.travels = rand() % 3;
		this.blockades = rand() % 4;

		this.placedSectors = 0;
		this.placedTravels = 0;
	}

	private getIslandOrientation(x: number, y: number, typeMap: WorldMap): IslandOrientation {
		if (typeMap.get(x - 1, y) === SectorType.Island) return IslandOrientation.Left;
		if (typeMap.get(x + 1, y) === SectorType.Island) return IslandOrientation.Right;
		if (typeMap.get(x, y - 1) === SectorType.Island) return IslandOrientation.Up;
		if (typeMap.get(x, y + 1) === SectorType.Island) return IslandOrientation.Down;

		return 0;
	}

	private determineRanges(size: WorldSize): Range[] {
		switch (size) {
			case WorldSize.Small:
				return [new Range(5, 8), new Range(4, 6), new Range(1, 1), new Range(1, 1)];
			case WorldSize.Medium:
				return [new Range(5, 9), new Range(5, 9), new Range(4, 8), new Range(3, 8)];
			case WorldSize.Large:
				return [new Range(6, 12), new Range(6, 12), new Range(6, 11), new Range(4, 11)];
		}
	}

	private placeBlockade(x: number, y: number, xdif: number, ydif: number): void {
		this.typeMap.set(x, y, this.blockadeTypeFor(xdif, ydif));

		this.typeMap.set(x - ydif, y - xdif, SectorType.KeptFree);
		this.typeMap.set(x + ydif, y + xdif, SectorType.KeptFree);
		this.typeMap.set(x - xdif, y - ydif, SectorType.Candidate);
		this.typeMap.set(x - ydif - xdif, y - ydif - xdif, SectorType.KeptFree);
		this.typeMap.set(x + ydif - xdif, y - ydif + xdif, SectorType.KeptFree);

		this.remainingSectors -= 1;
		this.placedSectors += 2;
		this.blockades -= 1;
	}

	private extendBlockade(x: number, y: number, xdif: number, ydif: number): void {
		this.typeMap.set(x, y, SectorType.Candidate);
		this.typeMap.set(x - ydif, y - xdif, SectorType.KeptFree);
		this.typeMap.set(x + ydif, y + xdif, SectorType.KeptFree);

		this.placedSectors += 1;
		this.remainingSectors -= 1;
	}

	private isFree(type: SectorType): boolean {
		return type === SectorType.None || type === SectorType.KeptFree;
	}

	private isLessThanCandidate(type: number): boolean {
		switch (type) {
			case SectorType.None:
			case SectorType.Empty:
			case SectorType.TravelStart:
			case SectorType.TravelEnd:
			case SectorType.Island:
			case SectorType.Spaceport:
				return true;
			default:
				return false;
		}
	}

	private neighbors(map: WorldMap, x: number, y: number) {
		return [map.get(x - 1, y), map.get(x + 1, y), map.get(x, y - 1), map.get(x, y + 1)];
	}

	private isBlockade(type: SectorType): boolean {
		return (
			type === SectorType.BlockWest ||
			type === SectorType.BlockEast ||
			type === SectorType.BlockNorth ||
			type === SectorType.BlockSouth
		);
	}

	private handleNeighbor(x: number, y: number, iteration: number, xdif: number, ydif: number): boolean {
		const itemIdx = x + MapWidth * y;

		const neighbor = this.typeMap.get(x + xdif, y + ydif);
		const neighborOtherAxisBefore = this.typeMap.get(x + ydif, y + xdif);
		const neighborOtherAxisAfter = this.typeMap.get(x - ydif, y - xdif);

		if (this.isFree(neighbor)) return false; // maybe negate isFree

		this.lastType = this.typeMap.get(x + xdif, y + ydif);

		const BlockadeType = this.blockadeTypeFor(xdif, ydif);
		const canPlaceBlockade = this.isFree(neighborOtherAxisBefore) && this.isFree(neighborOtherAxisAfter);
		if ((canPlaceBlockade && neighbor === SectorType.Candidate) || neighbor === BlockadeType) {
			this.extendBlockade(x, y, xdif, ydif);
		}

		if (neighbor === SectorType.Candidate) return true;
		if (this.isBlockade(neighbor)) return true;

		const shouldPlaceBlockade = this.blockades > 0 && rand() % this.probablility < this.threshold;
		const isWithinBlockadeRange = GetDistanceToCenter(x + xdif, y + ydif) < iteration;
		const allNeighborsAreFree = this.neighbors(this.typeMap, x, y).every(this.isLessThanCandidate);

		if (shouldPlaceBlockade && canPlaceBlockade && isWithinBlockadeRange) {
			this.placeBlockade(x, y, xdif, ydif);
			return true;
		}

		if (!allNeighborsAreFree) return true;

		if (!shouldPlaceBlockade || (ydif && !canPlaceBlockade) || (xdif && isWithinBlockadeRange)) {
			this.typeMap[itemIdx] = SectorType.Empty;
			this.placedSectors += 1;
			this.remainingSectors -= 1;
			return true;
		}

		return true;
	}

	private _initializeTypeMap(spaceportX: number, spaceportY: number) {
		this._typeMap = new Uint16Array(MapWidth * MapHeight) as any;
		for (let i = 0; i < MapWidth * MapHeight; i++) this.typeMap[i] = SectorType.None;
		this.typeMap[44] = SectorType.Empty;
		this.typeMap[45] = SectorType.Empty;
		this.typeMap[54] = SectorType.Empty;
		this.typeMap[55] = SectorType.Empty;

		this.typeMap[spaceportX + MapWidth * spaceportY] = SectorType.Spaceport;
	}

	private _initializeOrderMap() {
		this._orderMap = new Int16Array(MapWidth * MapHeight) as any;
		for (let i = 0, len = this.orderMap.length; i < len; i++) {
			this.orderMap[i] = -1;
		}
	}

	public generate(seed: number, size: WorldSize) {
		if (seed >= 0) srand(seed);

		this.travels = 0;
		this.placedTravels = 0;

		this.blockades = 0;
		this.puzzles = 0;
		this.placedSectors = 0;

		this._determineCounts();

		rand(); // waste a random number

		const rand1 = randmod(2) + 4;
		const rand2 = randmod(2) + 4;
		this._initializeTypeMap(rand1, rand2);
		this._initializeOrderMap();

		const ranges = this.determineRanges(size);
		let itemsToPlace = this.travels;
		itemsToPlace += this.blockades;
		itemsToPlace += ranges[0].randomElement();

		this._determinePuzzleLocations(2, Math.min(itemsToPlace, 12));
		this._determinePuzzleLocations(3, ranges[1].randomElement());
		this._determinePuzzleLocations(4, ranges[2].randomElement());
		this._determineAdditionalPuzzleLocations(ranges[3].randomElement());

		const islandBuilder = new IslandBuilder(this.typeMap as any);
		islandBuilder.placeIslands(this.placedTravels);

		this._placeIntermediateWorldThing();

		return this.typeMap;
	}

	private findPuzzleLastPuzzle() {
		for (let y = 0; y < MapHeight; y++) {
			for (let x = 0; x < MapWidth; x++) {
				if (this.orderMap.get(x, y) === this.placedSectors - 1) {
					return new Point(x, y);
				}
			}
		}
		return null;
	}

	private _choosePuzzlesBehindBlockades() {
		const bounds = {
			width: MapWidth,
			height: MapHeight
		};
		let smallStep;
		let largeStep;

		for (let y = 0; y < MapHeight; y++) {
			for (let x = 0; x < MapWidth; x++) {
				switch (this.typeMap.get(x, y)) {
					case SectorType.BlockWest:
						smallStep = new Point(-1, 0);
						largeStep = new Point(-2, 0);
						break;
					case SectorType.BlockEast:
						smallStep = new Point(1, 0);
						largeStep = new Point(2, 0);
						break;
					case SectorType.BlockNorth:
						smallStep = new Point(0, -1);
						largeStep = new Point(0, -2);
						break;
					case SectorType.BlockSouth:
						smallStep = new Point(0, 1);
						largeStep = new Point(0, 2);
						break;
					default:
						continue;
				}

				let point = new Point(x, y);
				const smallStepped = Point.add(point, smallStep);
				const largeStepped = Point.add(point, largeStep);
				if (this.typeMap.get(smallStepped.x, smallStepped.y) !== SectorType.Candidate) continue;

				if (
					!largeStepped.isInBounds(bounds) ||
					this.typeMap.get(largeStepped.x, largeStepped.y) !== SectorType.Candidate
				) {
					point = smallStepped;
				} else {
					point = largeStepped;
				}

				this.typeMap.set(point.x, point.y, SectorType.Puzzle);
				this.orderMap.set(point.x, point.y, this.placedSectors);
				this.placedSectors += 1;
			}
		}
	}

	private _choosePuzzlesOnIslands() {
		const bounds = {
			width: MapWidth,
			height: MapHeight
		};

		let range;
		let step;
		let puzzleLocation;
		const iteration = (point: Point, control: any) => {
			const nextPoint = Point.add(point, control.step);
			if (
				!nextPoint.isInBounds(bounds) ||
				this.typeMap.get(nextPoint.x, nextPoint.y) !== SectorType.Island
			) {
				control.stop = true;
				puzzleLocation = point;
			}
		};

		for (let y = 0; y < MapHeight; y++) {
			for (let x = 0; x < MapWidth; x++) {
				if (this.typeMap.get(x, y) !== SectorType.TravelEnd) continue;

				switch (this.getIslandOrientation(x, y, this.typeMap)) {
					case IslandOrientation.Left:
						range = new HorizontalPointRange(x, 0, y);
						step = -1;
						break;
					case IslandOrientation.Up:
						range = new VerticalPointRange(y, 0, x);
						step = -1;
						break;
					case IslandOrientation.Right:
						range = new HorizontalPointRange(x, 9, y);
						step = 1;
						break;
					case IslandOrientation.Down:
						range = new VerticalPointRange(y, 9, x);
						step = 1;
						break;
				}

				puzzleLocation = range.from;
				range.iterate(iteration, step);

				this.typeMap.set(puzzleLocation.x, puzzleLocation.y, SectorType.Puzzle);
				this.orderMap.set(puzzleLocation.x, puzzleLocation.y, this.placedSectors);
				this.placedSectors += 1;
			}
		}
	}

	private _chooseAdditionalPuzzles(totalPuzzleCount: number): void {
		let doBreak = 0;
		let maxCount = 5000;
		for (let i = 0; i <= 200; i++) {
			let y;
			maxCount--;
			if (maxCount === 0) {
				break;
			}

			if (i > 200) {
				doBreak = 1;
			}
			if (this.placedSectors >= totalPuzzleCount) {
				doBreak = 1;
			}

			const x = rand() % 10;
			if (i >= 50 || x === 0 || x === 9) {
				y = rand() % 10;
			} else {
				y = (rand() & 1) < 1 ? 9 : 0;
			}

			// asm compares something against 400, 150 and maybe blockade_count
			if (this.placedSectors >= totalPuzzleCount) break;

			const distance = GetDistanceToCenter(x, y);
			if (distance >= 3 || i >= 150) {
				const item = this.typeMap.get(x, y);
				if (
					(item === SectorType.Empty || item === SectorType.Candidate) &&
					(x === 0 || this.typeMap.get(x - 1, y) !== SectorType.Puzzle) &&
					(x === 9 || this.typeMap.get(x + 1, y) !== SectorType.Puzzle) &&
					(y === 0 || this.typeMap.get(x, y - 1) !== SectorType.Puzzle) &&
					(y === 9 || this.typeMap.get(x, y + 1) !== SectorType.Puzzle)
				) {
					this.typeMap.set(x, y, SectorType.Puzzle);
					this.orderMap.set(x, y, this.placedSectors);
					this.placedSectors += 1;
				}

				if (this.placedSectors >= totalPuzzleCount) break;
			}

			if (distance < 3 && i < 150) i--;

			if (doBreak) break;
		}
	}

	private _mapCountStuff(): void {
		this.travels = 0;
		this.blockades = 0;
		this.puzzles = 0;
		for (let i = 0; i < MapWidth * MapHeight; i++) {
			switch (this.typeMap[i]) {
				case SectorType.Empty:
				case SectorType.Island:
				case SectorType.Candidate:
					this.puzzles += 1;
					break;
				case SectorType.BlockNorth:
				case SectorType.BlockEast:
				case SectorType.BlockSouth:
				case SectorType.BlockWest:
					this.blockades += 1;
					break;
				case SectorType.TravelStart:
					this.travels += 1;
					break;
				default:
					break;
			}
		}
	}

	private _makeSureLastPuzzleIsNotTooCloseToCenter(): void {
		const getDistanceToCenter = GetDistanceToCenter;
		const lastPuzzle = this.findPuzzleLastPuzzle();
		if (getDistanceToCenter(lastPuzzle.x, lastPuzzle.y) < 3) {
			for (let y = 0; y < MapHeight; y++) {
				for (let x = 0; x < MapWidth; x++) {
					if (
						this.orderMap.get(x, y) >= 0 &&
						getDistanceToCenter(x, y) >= 3 &&
						(x !== lastPuzzle.x || y !== lastPuzzle.y)
					) {
						this.orderMap.set(lastPuzzle.x, lastPuzzle.y, this.orderMap.get(x, y));
						this.orderMap.set(x, y, this.placedSectors - 1);

						return;
					}
				}
			}
		}
	}

	private _placeIntermediateWorldThing(): void {
		this.placedSectors = 0;

		this._mapCountStuff();

		const puzzlesCount = this.puzzles;
		const travelCount = this.travels;
		const blockadesCount = this.blockades;

		let totalPuzzleCount =
			Math.floor(puzzlesCount / 4) +
			(rand() % (Math.floor(puzzlesCount / 5) + 1)) -
			blockadesCount -
			travelCount -
			2;
		if (totalPuzzleCount < 4) totalPuzzleCount = 4;

		this.placedSectors = 0;

		this._choosePuzzlesBehindBlockades();
		this._choosePuzzlesOnIslands();
		this._chooseAdditionalPuzzles(totalPuzzleCount);
		this._makeSureLastPuzzleIsNotTooCloseToCenter();
	}

	private _tryPlacingTravel(itemIdx: number, iteration: number, lastTime: SectorType) {
		if (this.typeMap[itemIdx] !== SectorType.Empty) return;

		if (this.travels <= this.placedTravels) return;
		if ((rand() & 7) >= this.travelThreshold) return;
		if (lastTime === SectorType.TravelStart) return;
		if (iteration <= 2) return;

		this.typeMap[itemIdx] = SectorType.TravelStart;
		this.placedTravels += 1;
	}

	private _determinePuzzleLocations(iteration: number, puzzleCountToPlace: number): void {
		this.remainingSectors = puzzleCountToPlace;

		switch (iteration) {
			case 2:
				this.min = new Point(3, 3);
				this.alternate = new Point(6, 6);
				this.variance = 4;
				this.probablility = 9;
				this.threshold = 2;
				this.travelThreshold = 1;
				break;
			case 3:
				this.min = new Point(2, 2);
				this.alternate = new Point(7, 7);
				this.variance = 6;
				this.probablility = 4;
				this.travelThreshold = 3;
				this.threshold = 2;
				break;
			case 4:
				this.min = new Point(1, 1);
				this.alternate = new Point(8, 8);
				this.variance = 8;
				this.threshold = 1;
				this.probablility = 5;
				this.travelThreshold = 6;
				break;
			default:
				return;
		}

		for (let i = 0; i <= 144 && this.remainingSectors > 0; i++) {
			let x, y;
			if (rand() % 2) {
				x = rand() % 2 ? this.min.x : this.alternate.x;
				y = (rand() % this.variance) + this.min.y;
			} else {
				y = rand() % 2 ? this.min.y : this.alternate.y;
				x = (rand() % this.variance) + this.min.x;
			}

			const itemIdx = x + MapWidth * y;
			if (this.typeMap[itemIdx] !== SectorType.None) continue;

			this.handleNeighbor(x, y, iteration, -1, 0) ||
				this.handleNeighbor(x, y, iteration, 1, 0) ||
				this.handleNeighbor(x, y, iteration, 0, -1) ||
				this.handleNeighbor(x, y, iteration, 0, 1);

			this._tryPlacingTravel(itemIdx, iteration, this.lastType);
		}
	}

	private _determineAdditionalPuzzleLocations(travelsToPlace: number) {
		for (let i = 0; i <= 400 && travelsToPlace > 0; i++) {
			let x, y;
			const isVertical = rand() % 2;
			if (isVertical) {
				x = rand() % 2 ? 0 : 9;
				y = rand() % MapHeight;
			} else {
				y = rand() % 2 ? 0 : 9;
				x = rand() % MapWidth;
			}

			const worldIdx = x + MapWidth * y;
			if (this.typeMap[worldIdx] !== SectorType.None) continue;

			const itemBefore = this.typeMap.get(x - 1, y);
			const itemAfter = this.typeMap.get(x + 1, y);
			const itemAbove = this.typeMap.get(x, y - 1);
			const itemBelow = this.typeMap.get(x, y + 1);

			let yDiff = 0;
			let xDiff = 0;
			if (isVertical && x === 9 && itemBefore !== SectorType.KeptFree) {
				xDiff = 1;
				yDiff = 0;
			} else if (isVertical && x === 0 && itemAfter !== SectorType.KeptFree) {
				xDiff = -1;
				yDiff = 0;
			} else if (!isVertical && y === 9 && itemAbove !== SectorType.KeptFree) {
				xDiff = 0;
				yDiff = 1;
			} else if (!isVertical && y === 0 && itemBelow !== SectorType.KeptFree) {
				xDiff = 0;
				yDiff = -1;
			}

			if (xDiff === 0 && yDiff === 0) continue;

			const itemNeighbor = this.typeMap.get(x - xDiff, y - yDiff);
			if (itemNeighbor === SectorType.None) continue;

			switch (itemNeighbor) {
				case SectorType.Empty:
				case SectorType.TravelStart:
				case SectorType.Spaceport:
					this.typeMap[worldIdx] = SectorType.Empty;
					break;
				case SectorType.Candidate:
					this.typeMap[worldIdx] = SectorType.Candidate;

					if (!xDiff) {
						if (x > 0) this.typeMap[worldIdx - 1] = SectorType.KeptFree;
						if (x < 9) this.typeMap[worldIdx + 1] = SectorType.KeptFree;
					} else if (!yDiff) {
						if (y > 0) this.typeMap[worldIdx - MapWidth] = SectorType.KeptFree;
						if (y < 9) this.typeMap[worldIdx + MapWidth] = SectorType.KeptFree;
					}

					continue;
				case SectorType.BlockEast:
					if (xDiff !== 1) continue;
					if (SectorType.None < itemBelow && itemBelow <= SectorType.BlockNorth) continue;
					if (SectorType.None < itemAbove && itemAbove <= SectorType.BlockNorth) continue;

					this.typeMap[worldIdx] = SectorType.Candidate;

					if (y > 0) this.typeMap[worldIdx - MapWidth] = SectorType.KeptFree;
					if (y < 9) this.typeMap[worldIdx + MapWidth] = SectorType.KeptFree;
					break;
				case SectorType.BlockWest:
					if (xDiff !== -1) continue;
					if (SectorType.None < itemAbove && itemAbove <= SectorType.BlockNorth) continue;
					if (SectorType.None < itemBelow && itemBelow <= SectorType.BlockNorth) continue;

					this.typeMap[worldIdx] = SectorType.Candidate;

					if (y > 0) this.typeMap[worldIdx - MapWidth] = SectorType.KeptFree;
					if (y < 9) this.typeMap[worldIdx + MapWidth] = SectorType.KeptFree;
					break;
				case SectorType.BlockNorth:
					if (yDiff !== -1) continue;
					if (SectorType.None < itemBefore && itemBefore <= SectorType.BlockNorth) continue;
					if (SectorType.None < itemAfter && itemAfter <= SectorType.BlockNorth) continue;

					this.typeMap[worldIdx] = SectorType.Candidate;

					if (x > 0) this.typeMap[worldIdx - 1] = SectorType.KeptFree;
					if (x < 9) this.typeMap[worldIdx + 1] = SectorType.KeptFree;
					break;
				case SectorType.BlockSouth:
					if (yDiff !== 1) continue;
					if (SectorType.None < itemBefore && itemBefore <= SectorType.BlockNorth) continue;
					if (SectorType.None < itemAfter && itemAfter <= SectorType.BlockNorth) continue;

					this.typeMap[worldIdx] = SectorType.Candidate;

					if (x > 0) this.typeMap[worldIdx - 1] = SectorType.KeptFree;
					if (x < 9) this.typeMap[worldIdx + 1] = SectorType.KeptFree;
					break;
				default:
					continue;
			}

			this.placedSectors += 1;
			--travelsToPlace;
		}
	}

	get puzzleCount() {
		return max(...Array.from(this.orderMap)) + 1;
	}

	public get orderMap() {
		return this._orderMap;
	}

	public get typeMap() {
		return this._typeMap;
	}
}

export default MapGenerator;
