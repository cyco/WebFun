import { HorizontalPointRange, Point, Range, VerticalPointRange, rand, randmod, srand } from "src/util";

import GetDistanceToCenter from "./distance-to-center";
import IslandBuilder from "./island-builder";
import Map from "./map";
import WorldItemType from "./world-item-type";
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

let min: Point = new Point(0, 0);
let alternate: Point = new Point(0, 0);
let variance: number;
let probablility: number;
let threshold: number;
let travelThreshold: number;
let lastTime: WorldItemType;
let remainingCountToPlace: number;
let typeMap: Map;
let placedPuzzles: number;
let blockades: number;
let travels: number;
let placedTravels: number;
let puzzles: number;
let orderMap: Map;

function blockadeTypeFor(xdiff: number, ydiff: number): WorldItemType {
	if (xdiff === 0 && ydiff === 1) {
		return WorldItemType.BlockNorth;
	}
	if (xdiff === 0 && ydiff === -1) {
		return WorldItemType.BlockSouth;
	}
	if (xdiff === -1 && ydiff === 0) {
		return WorldItemType.BlockEast;
	}
	if (xdiff === 1 && ydiff === 0) {
		return WorldItemType.BlockWest;
	}

	return null;
}

function _determineCounts(): void {
	travels = rand() % 3;
	blockades = rand() % 4;

	placedPuzzles = 0;
	placedTravels = 0;
}

function getIslandOrientation(x: number, y: number, typeMap: Map): IslandOrientation {
	if (typeMap.get(x - 1, y) === WorldItemType.Island) return IslandOrientation.Left;
	if (typeMap.get(x + 1, y) === WorldItemType.Island) return IslandOrientation.Right;
	if (typeMap.get(x, y - 1) === WorldItemType.Island) return IslandOrientation.Up;
	if (typeMap.get(x, y + 1) === WorldItemType.Island) return IslandOrientation.Down;

	return 0;
}

function determineRanges(size: WorldSize): Range[] {
	switch (size) {
		case WorldSize.Small:
			return [new Range(5, 8), new Range(4, 6), new Range(1, 1), new Range(1, 1)];
		case WorldSize.Medium:
			return [new Range(5, 9), new Range(5, 9), new Range(4, 8), new Range(3, 8)];
		case WorldSize.Large:
			return [new Range(6, 12), new Range(6, 12), new Range(6, 11), new Range(4, 11)];
	}
}

function placeBlockade(x: number, y: number, xdif: number, ydif: number): void {
	typeMap.set(x, y, blockadeTypeFor(xdif, ydif));

	typeMap.set(x - ydif, y - xdif, WorldItemType.KeptFree);
	typeMap.set(x + ydif, y + xdif, WorldItemType.KeptFree);
	typeMap.set(x - xdif, y - ydif, WorldItemType.Candidate);
	typeMap.set(x - ydif - xdif, y - ydif - xdif, WorldItemType.KeptFree);
	typeMap.set(x + ydif - xdif, y - ydif + xdif, WorldItemType.KeptFree);

	--remainingCountToPlace;
	placedPuzzles += 2;
	--blockades;
}

function extendBlockade(x: number, y: number, xdif: number, ydif: number): void {
	typeMap.set(x, y, WorldItemType.Candidate);
	typeMap.set(x - ydif, y - xdif, WorldItemType.KeptFree);
	typeMap.set(x + ydif, y + xdif, WorldItemType.KeptFree);

	++placedPuzzles;
	--remainingCountToPlace;
}

function isFree(type: WorldItemType): boolean {
	return type === WorldItemType.None || type === WorldItemType.KeptFree;
}

function isLessThanCandidate(type: number): boolean {
	switch (type) {
		case WorldItemType.None:
		case WorldItemType.Empty:
		case WorldItemType.TravelStart:
		case WorldItemType.TravelEnd:
		case WorldItemType.Island:
		case WorldItemType.Spaceport:
			return true;
		default:
			return false;
	}
}

function neighbors(map: Map, x: number, y: number) {
	return [map.get(x - 1, y), map.get(x + 1, y), map.get(x, y - 1), map.get(x, y + 1)];
}

function isBlockade(type: WorldItemType): boolean {
	return (
		type === WorldItemType.BlockWest ||
		type === WorldItemType.BlockEast ||
		type === WorldItemType.BlockNorth ||
		type === WorldItemType.BlockSouth
	);
}

function handleNeighbor(x: number, y: number, iteration: number, xdif: number, ydif: number): boolean {
	const itemIdx = x + MapWidth * y;

	const neighbor = typeMap.get(x + xdif, y + ydif);
	const neighborOtherAxisBefore = typeMap.get(x + ydif, y + xdif);
	const neighborOtherAxisAfter = typeMap.get(x - ydif, y - xdif);

	if (isFree(neighbor)) return false; // maybe negate isFree

	lastTime = typeMap.get(x + xdif, y + ydif);

	const BlockadeType = blockadeTypeFor(xdif, ydif);
	const canPlaceBlockade = isFree(neighborOtherAxisBefore) && isFree(neighborOtherAxisAfter);
	if ((canPlaceBlockade && neighbor === WorldItemType.Candidate) || neighbor === BlockadeType) {
		extendBlockade(x, y, xdif, ydif);
	}

	if (neighbor === WorldItemType.Candidate) return true;
	if (isBlockade(neighbor)) return true;

	const shouldPlaceBlockade = blockades > 0 && rand() % probablility < threshold;
	const isWithinBlockadeRange = GetDistanceToCenter(x + xdif, y + ydif) < iteration;
	const allNeighborsAreFree = neighbors(typeMap, x, y).every(isLessThanCandidate);

	if (shouldPlaceBlockade && canPlaceBlockade && isWithinBlockadeRange) {
		placeBlockade(x, y, xdif, ydif);
		return true;
	}

	if (!allNeighborsAreFree) return true;

	if (!shouldPlaceBlockade || (ydif && !canPlaceBlockade) || (xdif && isWithinBlockadeRange)) {
		typeMap[itemIdx] = WorldItemType.Empty;
		++placedPuzzles;
		--remainingCountToPlace;
		return true;
	}

	return true;
}

function constructor() {
	travels = 0;
	placedTravels = 0;

	blockades = 0;
	puzzles = 0;
	placedPuzzles = 0;

	typeMap = null;
	orderMap = null;
}

function _initializeTypeMap(spaceportX: number, spaceportY: number) {
	typeMap = new Uint16Array(MapWidth * MapHeight) as any;
	for (let i = 0; i < MapWidth * MapHeight; i++) typeMap[i] = WorldItemType.None;
	typeMap[44] = WorldItemType.Empty;
	typeMap[45] = WorldItemType.Empty;
	typeMap[54] = WorldItemType.Empty;
	typeMap[55] = WorldItemType.Empty;

	typeMap[spaceportX + MapWidth * spaceportY] = WorldItemType.Spaceport;
}

function _initializeOrderMap() {
	orderMap = new Int16Array(MapWidth * MapHeight) as any;
	for (let i = 0, len = orderMap.length; i < len; i++) {
		orderMap[i] = -1;
	}
}

function generate(seed: number, size: WorldSize) {
	if (seed >= 0) srand(seed);

	_determineCounts();

	rand(); // waste a random number

	const rand1 = randmod(2) + 4;
	const rand2 = randmod(2) + 4;
	_initializeTypeMap(rand1, rand2);
	_initializeOrderMap();

	const ranges = determineRanges(size);
	let itemsToPlace = travels;
	itemsToPlace += blockades;
	itemsToPlace += ranges[0].randomElement();

	_determinePuzzleLocations(2, Math.min(itemsToPlace, 12));
	_determinePuzzleLocations(3, ranges[1].randomElement());
	_determinePuzzleLocations(4, ranges[2].randomElement());
	_determineAdditionalPuzzleLocations(ranges[3].randomElement());

	const islandBuilder = new IslandBuilder(typeMap as any);
	islandBuilder.placeIslands(placedTravels);

	_placeIntermediateWorldThing();

	return typeMap;
}

function findPuzzleLastPuzzle() {
	for (let y = 0; y < MapHeight; y++) {
		for (let x = 0; x < MapWidth; x++) {
			if (orderMap.get(x, y) === placedPuzzles - 1) {
				return new Point(x, y);
			}
		}
	}
	return null;
}

function _choosePuzzlesBehindBlockades() {
	const bounds = {
		width: MapWidth,
		height: MapHeight
	};
	let smallStep;
	let largeStep;

	for (let y = 0; y < MapHeight; y++) {
		for (let x = 0; x < MapWidth; x++) {
			switch (typeMap.get(x, y)) {
				case WorldItemType.BlockWest:
					smallStep = new Point(-1, 0);
					largeStep = new Point(-2, 0);
					break;
				case WorldItemType.BlockEast:
					smallStep = new Point(1, 0);
					largeStep = new Point(2, 0);
					break;
				case WorldItemType.BlockNorth:
					smallStep = new Point(0, -1);
					largeStep = new Point(0, -2);
					break;
				case WorldItemType.BlockSouth:
					smallStep = new Point(0, 1);
					largeStep = new Point(0, 2);
					break;
				default:
					continue;
			}

			let point = new Point(x, y);
			const smallStepped = Point.add(point, smallStep);
			const largeStepped = Point.add(point, largeStep);
			if (typeMap.get(smallStepped.x, smallStepped.y) !== WorldItemType.Candidate) continue;

			if (
				!largeStepped.isInBounds(bounds) ||
				typeMap.get(largeStepped.x, largeStepped.y) !== WorldItemType.Candidate
			) {
				point = smallStepped;
			} else {
				point = largeStepped;
			}

			typeMap.set(point.x, point.y, WorldItemType.Puzzle);
			orderMap.set(point.x, point.y, placedPuzzles++);
		}
	}
}

function _choosePuzzlesOnIslands() {
	const bounds = {
		width: MapWidth,
		height: MapHeight
	};

	let range;
	let step;
	let puzzleLocation;
	const iteration = (point: Point, control: any) => {
		const nextPoint = Point.add(point, control.step);
		if (!nextPoint.isInBounds(bounds) || typeMap.get(nextPoint.x, nextPoint.y) !== WorldItemType.Island) {
			control.stop = true;
			puzzleLocation = point;
		}
	};

	for (let y = 0; y < MapHeight; y++) {
		for (let x = 0; x < MapWidth; x++) {
			if (typeMap.get(x, y) !== WorldItemType.TravelEnd) continue;

			switch (getIslandOrientation(x, y, typeMap)) {
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

			typeMap.set(puzzleLocation.x, puzzleLocation.y, WorldItemType.Puzzle);
			orderMap.set(puzzleLocation.x, puzzleLocation.y, placedPuzzles++);
		}
	}
}

function _chooseAdditionalPuzzles(totalPuzzleCount: number): void {
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
		if (placedPuzzles >= totalPuzzleCount) {
			doBreak = 1;
		}

		const x = rand() % 10;
		if (i >= 50 || x === 0 || x === 9) {
			y = rand() % 10;
		} else {
			y = (rand() & 1) < 1 ? 9 : 0;
		}

		// asm compares something against 400, 150 and maybe blockade_count
		if (placedPuzzles >= totalPuzzleCount) break;

		const distance = GetDistanceToCenter(x, y);
		if (distance >= 3 || i >= 150) {
			const item = typeMap.get(x, y);
			if (
				(item === WorldItemType.Empty || item === WorldItemType.Candidate) &&
				(x === 0 || typeMap.get(x - 1, y) !== WorldItemType.Puzzle) &&
				(x === 9 || typeMap.get(x + 1, y) !== WorldItemType.Puzzle) &&
				(y === 0 || typeMap.get(x, y - 1) !== WorldItemType.Puzzle) &&
				(y === 9 || typeMap.get(x, y + 1) !== WorldItemType.Puzzle)
			) {
				typeMap.set(x, y, WorldItemType.Puzzle);
				orderMap.set(x, y, placedPuzzles++);
			}

			if (placedPuzzles >= totalPuzzleCount) break;
		}

		if (distance < 3 && i < 150) i--;

		if (doBreak) break;
	}
}

function _mapCountStuff(): void {
	travels = 0;
	blockades = 0;
	puzzles = 0;
	for (let i = 0; i < MapWidth * MapHeight; i++) {
		switch (typeMap[i]) {
			case WorldItemType.Empty:
			case WorldItemType.Island:
			case WorldItemType.Candidate:
				puzzles += 1;
				break;
			case WorldItemType.BlockNorth:
			case WorldItemType.BlockEast:
			case WorldItemType.BlockSouth:
			case WorldItemType.BlockWest:
				blockades += 1;
				break;
			case WorldItemType.TravelStart:
				travels += 1;
				break;
			default:
				break;
		}
	}
}

function _makeSureLastPuzzleIsNotTooCloseToCenter(): void {
	const getDistanceToCenter = GetDistanceToCenter;
	const lastPuzzle = findPuzzleLastPuzzle();
	if (getDistanceToCenter(lastPuzzle.x, lastPuzzle.y) < 3) {
		for (let y = 0; y < MapHeight; y++) {
			for (let x = 0; x < MapWidth; x++) {
				if (
					orderMap.get(x, y) >= 0 &&
					getDistanceToCenter(x, y) >= 3 &&
					(x !== lastPuzzle.x || y !== lastPuzzle.y)
				) {
					orderMap.set(lastPuzzle.x, lastPuzzle.y, orderMap.get(x, y));
					orderMap.set(x, y, placedPuzzles - 1);

					return;
				}
			}
		}
	}
}

function _placeIntermediateWorldThing(): void {
	placedPuzzles = 0;

	_mapCountStuff();

	const puzzlesCount = puzzles;
	const travelCount = travels;
	const blockadesCount = blockades;

	let totalPuzzleCount =
		Math.floor(puzzlesCount / 4) +
		(rand() % (Math.floor(puzzlesCount / 5) + 1)) -
		blockadesCount -
		travelCount -
		2;
	if (totalPuzzleCount < 4) totalPuzzleCount = 4;

	placedPuzzles = 0;

	_choosePuzzlesBehindBlockades();
	_choosePuzzlesOnIslands();
	_chooseAdditionalPuzzles(totalPuzzleCount);
	_makeSureLastPuzzleIsNotTooCloseToCenter();
}

function _tryPlacingTravel(itemIdx: number, iteration: number, lastTime: WorldItemType) {
	if (typeMap[itemIdx] !== WorldItemType.Empty) return;

	if (travels <= placedTravels) return;
	if ((rand() & 7) >= travelThreshold) return;
	if (lastTime === WorldItemType.TravelStart) return;
	if (iteration <= 2) return;

	typeMap[itemIdx] = WorldItemType.TravelStart;
	placedTravels++;
}

function _determinePuzzleLocations(iteration: number, puzzleCountToPlace: number): void {
	remainingCountToPlace = puzzleCountToPlace;

	switch (iteration) {
		case 2:
			min = new Point(3, 3);
			alternate = new Point(6, 6);
			variance = 4;
			probablility = 9;
			threshold = 2;
			travelThreshold = 1;
			break;
		case 3:
			min = new Point(2, 2);
			alternate = new Point(7, 7);
			variance = 6;
			probablility = 4;
			travelThreshold = 3;
			threshold = 2;
			break;
		case 4:
			min = new Point(1, 1);
			alternate = new Point(8, 8);
			variance = 8;
			threshold = 1;
			probablility = 5;
			travelThreshold = 6;
			break;
		default:
			return;
	}

	for (let i = 0; i <= 144 && remainingCountToPlace > 0; i++) {
		let x, y;
		if (rand() % 2) {
			x = rand() % 2 ? min.x : alternate.x;
			y = (rand() % variance) + min.y;
		} else {
			y = rand() % 2 ? min.y : alternate.y;
			x = (rand() % variance) + min.x;
		}

		const itemIdx = x + MapWidth * y;
		if (typeMap[itemIdx] !== WorldItemType.None) continue;

		handleNeighbor(x, y, iteration, -1, 0) ||
			handleNeighbor(x, y, iteration, 1, 0) ||
			handleNeighbor(x, y, iteration, 0, -1) ||
			handleNeighbor(x, y, iteration, 0, 1);

		_tryPlacingTravel(itemIdx, iteration, lastTime);
	}
}

function _determineAdditionalPuzzleLocations(travelsToPlace: number) {
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
		if (typeMap[worldIdx] !== WorldItemType.None) continue;

		const itemBefore = typeMap.get(x - 1, y);
		const itemAfter = typeMap.get(x + 1, y);
		const itemAbove = typeMap.get(x, y - 1);
		const itemBelow = typeMap.get(x, y + 1);

		let yDiff = 0;
		let xDiff = 0;
		if (isVertical && x === 9 && itemBefore !== WorldItemType.KeptFree) {
			xDiff = 1;
			yDiff = 0;
		} else if (isVertical && x === 0 && itemAfter !== WorldItemType.KeptFree) {
			xDiff = -1;
			yDiff = 0;
		} else if (!isVertical && y === 9 && itemAbove !== WorldItemType.KeptFree) {
			xDiff = 0;
			yDiff = 1;
		} else if (!isVertical && y === 0 && itemBelow !== WorldItemType.KeptFree) {
			xDiff = 0;
			yDiff = -1;
		}

		if (xDiff === 0 && yDiff === 0) continue;

		const itemNeighbor = typeMap.get(x - xDiff, y - yDiff);
		if (itemNeighbor === WorldItemType.None) continue;

		switch (itemNeighbor) {
			case WorldItemType.Empty:
			case WorldItemType.TravelStart:
			case WorldItemType.Spaceport:
				typeMap[worldIdx] = WorldItemType.Empty;
				break;
			case WorldItemType.Candidate:
				typeMap[worldIdx] = WorldItemType.Candidate;

				if (!xDiff) {
					if (x > 0) typeMap[worldIdx - 1] = WorldItemType.KeptFree;
					if (x < 9) typeMap[worldIdx + 1] = WorldItemType.KeptFree;
				} else if (!yDiff) {
					if (y > 0) typeMap[worldIdx - MapWidth] = WorldItemType.KeptFree;
					if (y < 9) typeMap[worldIdx + MapWidth] = WorldItemType.KeptFree;
				}

				continue;
			case WorldItemType.BlockEast:
				if (xDiff !== 1) continue;
				if (WorldItemType.None < itemBelow && itemBelow <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < itemAbove && itemAbove <= WorldItemType.BlockNorth) continue;

				typeMap[worldIdx] = WorldItemType.Candidate;

				if (y > 0) typeMap[worldIdx - MapWidth] = WorldItemType.KeptFree;
				if (y < 9) typeMap[worldIdx + MapWidth] = WorldItemType.KeptFree;
				break;
			case WorldItemType.BlockWest:
				if (xDiff !== -1) continue;
				if (WorldItemType.None < itemAbove && itemAbove <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < itemBelow && itemBelow <= WorldItemType.BlockNorth) continue;

				typeMap[worldIdx] = WorldItemType.Candidate;

				if (y > 0) typeMap[worldIdx - MapWidth] = WorldItemType.KeptFree;
				if (y < 9) typeMap[worldIdx + MapWidth] = WorldItemType.KeptFree;
				break;
			case WorldItemType.BlockNorth:
				if (yDiff !== -1) continue;
				if (WorldItemType.None < itemBefore && itemBefore <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < itemAfter && itemAfter <= WorldItemType.BlockNorth) continue;

				typeMap[worldIdx] = WorldItemType.Candidate;

				if (x > 0) typeMap[worldIdx - 1] = WorldItemType.KeptFree;
				if (x < 9) typeMap[worldIdx + 1] = WorldItemType.KeptFree;
				break;
			case WorldItemType.BlockSouth:
				if (yDiff !== 1) continue;
				if (WorldItemType.None < itemBefore && itemBefore <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < itemAfter && itemAfter <= WorldItemType.BlockNorth) continue;

				typeMap[worldIdx] = WorldItemType.Candidate;

				if (x > 0) typeMap[worldIdx - 1] = WorldItemType.KeptFree;
				if (x < 9) typeMap[worldIdx + 1] = WorldItemType.KeptFree;
				break;
			default:
				continue;
		}

		++placedPuzzles;
		--travelsToPlace;
	}
}

class MapGenerator {
	get puzzleCount() {
		return max(...Array.from(orderMap)) + 1;
	}

	get typeMap() {
		return typeMap;
	}

	get orderMap() {
		return orderMap;
	}

	generate(seed: number, size: WorldSize) {
		constructor();
		return generate(seed, size);
	}
}

export default MapGenerator;
