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
let travel_threshold: number;
let last_item: WorldItemType;
let remaining_count_to_place: number;
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

function place_blockade(x: number, y: number, xdif: number, ydif: number): void {
	typeMap.set(x, y, blockadeTypeFor(xdif, ydif));

	typeMap.set(x - ydif, y - xdif, WorldItemType.KeptFree);
	typeMap.set(x + ydif, y + xdif, WorldItemType.KeptFree);
	typeMap.set(x - xdif, y - ydif, WorldItemType.Candidate);
	typeMap.set(x - ydif - xdif, y - ydif - xdif, WorldItemType.KeptFree);
	typeMap.set(x + ydif - xdif, y - ydif + xdif, WorldItemType.KeptFree);

	--remaining_count_to_place;
	placedPuzzles += 2;
	--blockades;
}

function extend_blockade(x: number, y: number, xdif: number, ydif: number): void {
	typeMap.set(x, y, WorldItemType.Candidate);
	typeMap.set(x - ydif, y - xdif, WorldItemType.KeptFree);
	typeMap.set(x + ydif, y + xdif, WorldItemType.KeptFree);

	++placedPuzzles;
	--remaining_count_to_place;
}

function is_free(type: WorldItemType): boolean {
	return type === WorldItemType.None || type === WorldItemType.KeptFree;
}

function is_less_than_candidate(type: number): boolean {
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

function is_blockade(type: WorldItemType): boolean {
	return (
		type === WorldItemType.BlockWest ||
		type === WorldItemType.BlockEast ||
		type === WorldItemType.BlockNorth ||
		type === WorldItemType.BlockSouth
	);
}

function handle_neighbor(x: number, y: number, iteration: number, xdif: number, ydif: number): boolean {
	const item_idx = x + MapWidth * y;

	const neighbor = typeMap.get(x + xdif, y + ydif);
	const neighborOtherAxisBefore = typeMap.get(x + ydif, y + xdif);
	const neighborOtherAxisAfter = typeMap.get(x - ydif, y - xdif);

	if (is_free(neighbor)) return false; // maybe negate is_free

	last_item = typeMap.get(x + xdif, y + ydif);

	const BlockadeType = blockadeTypeFor(xdif, ydif);
	const canPlaceBlockade = is_free(neighborOtherAxisBefore) && is_free(neighborOtherAxisAfter);
	if ((canPlaceBlockade && neighbor === WorldItemType.Candidate) || neighbor === BlockadeType) {
		extend_blockade(x, y, xdif, ydif);
	}

	if (neighbor === WorldItemType.Candidate) return true;
	if (is_blockade(neighbor)) return true;

	const should_place_blockade = blockades > 0 && rand() % probablility < threshold;
	const is_within_blockade_range = GetDistanceToCenter(x + xdif, y + ydif) < iteration;
	const all_neighbors_are_free = neighbors(typeMap, x, y).every(is_less_than_candidate);

	if (should_place_blockade && canPlaceBlockade && is_within_blockade_range) {
		place_blockade(x, y, xdif, ydif);
		return true;
	}

	if (!all_neighbors_are_free) return true;

	if (!should_place_blockade || (ydif && !canPlaceBlockade) || (xdif && is_within_blockade_range)) {
		typeMap[item_idx] = WorldItemType.Empty;
		++placedPuzzles;
		--remaining_count_to_place;
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

function _chooseAdditionalPuzzles(total_puzzle_count: number): void {
	let do_break = 0;
	let maxCount = 5000;
	for (let i = 0; i <= 200; i++) {
		let y;
		maxCount--;
		if (maxCount === 0) {
			break;
		}

		if (i > 200) {
			do_break = 1;
		}
		if (placedPuzzles >= total_puzzle_count) {
			do_break = 1;
		}

		const x = rand() % 10;
		if (i >= 50 || x === 0 || x === 9) {
			y = rand() % 10;
		} else {
			y = (rand() & 1) < 1 ? 9 : 0;
		}

		// asm compares something against 400, 150 and maybe blockade_count
		if (placedPuzzles >= total_puzzle_count) break;

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

			if (placedPuzzles >= total_puzzle_count) break;
		}

		if (distance < 3 && i < 150) i--;

		if (do_break) break;
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
					const replacement_puzzle = orderMap.get(x, y);
					orderMap.set(lastPuzzle.x, lastPuzzle.y, replacement_puzzle);
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

	const puzzles_count = puzzles;
	const travel_count = travels;
	const blockades_count = blockades;

	let total_puzzle_count =
		Math.floor(puzzles_count / 4) +
		(rand() % (Math.floor(puzzles_count / 5) + 1)) -
		blockades_count -
		travel_count -
		2;
	if (total_puzzle_count < 4) total_puzzle_count = 4;

	placedPuzzles = 0;

	_choosePuzzlesBehindBlockades();
	_choosePuzzlesOnIslands();
	_chooseAdditionalPuzzles(total_puzzle_count);
	_makeSureLastPuzzleIsNotTooCloseToCenter();
}

function _tryPlacingTravel(item_idx: number, iteration: number, last_item: WorldItemType) {
	if (typeMap[item_idx] !== WorldItemType.Empty) return;

	if (travels <= placedTravels) return;
	if ((rand() & 7) >= travel_threshold) return;
	if (last_item === WorldItemType.TravelStart) return;
	if (iteration <= 2) return;

	typeMap[item_idx] = WorldItemType.TravelStart;
	placedTravels++;
}

function _determinePuzzleLocations(iteration: number, puzzle_count_to_place: number): void {
	remaining_count_to_place = puzzle_count_to_place;

	switch (iteration) {
		case 2:
			min = new Point(3, 3);
			alternate = new Point(6, 6);
			variance = 4;
			probablility = 9;
			threshold = 2;
			travel_threshold = 1;
			break;
		case 3:
			min = new Point(2, 2);
			alternate = new Point(7, 7);
			variance = 6;
			probablility = 4;
			travel_threshold = 3;
			threshold = 2;
			break;
		case 4:
			min = new Point(1, 1);
			alternate = new Point(8, 8);
			variance = 8;
			threshold = 1;
			probablility = 5;
			travel_threshold = 6;
			break;
		default:
			return;
	}

	for (let i = 0; i <= 144 && remaining_count_to_place > 0; i++) {
		let x, y;
		if (rand() % 2) {
			x = rand() % 2 ? min.x : alternate.x;
			y = (rand() % variance) + min.y;
		} else {
			y = rand() % 2 ? min.y : alternate.y;
			x = (rand() % variance) + min.x;
		}

		const item_idx = x + MapWidth * y;
		if (typeMap[item_idx] !== WorldItemType.None) continue;

		handle_neighbor(x, y, iteration, -1, 0) ||
			handle_neighbor(x, y, iteration, 1, 0) ||
			handle_neighbor(x, y, iteration, 0, -1) ||
			handle_neighbor(x, y, iteration, 0, 1);

		_tryPlacingTravel(item_idx, iteration, last_item);
	}
}

function _determineAdditionalPuzzleLocations(travels_to_place: number) {
	for (let i = 0; i <= 400 && travels_to_place > 0; i++) {
		let x, y;
		const is_vertical = rand() % 2;
		if (is_vertical) {
			x = rand() % 2 ? 0 : 9;
			y = rand() % MapHeight;
		} else {
			y = rand() % 2 ? 0 : 9;
			x = rand() % MapWidth;
		}

		const world_idx = x + MapWidth * y;
		if (typeMap[world_idx] !== WorldItemType.None) continue;

		const item_before = typeMap.get(x - 1, y);
		const item_after = typeMap.get(x + 1, y);
		const item_above = typeMap.get(x, y - 1);
		const item_below = typeMap.get(x, y + 1);

		let y_diff = 0,
			x_diff = 0;
		if (is_vertical && x === 9 && item_before !== WorldItemType.KeptFree) {
			x_diff = 1;
			y_diff = 0;
		} else if (is_vertical && x === 0 && item_after !== WorldItemType.KeptFree) {
			x_diff = -1;
			y_diff = 0;
		} else if (!is_vertical && y === 9 && item_above !== WorldItemType.KeptFree) {
			x_diff = 0;
			y_diff = 1;
		} else if (!is_vertical && y === 0 && item_below !== WorldItemType.KeptFree) {
			x_diff = 0;
			y_diff = -1;
		}

		if (x_diff === 0 && y_diff === 0) continue;

		const item_neighbor = typeMap.get(x - x_diff, y - y_diff);
		if (item_neighbor === WorldItemType.None) continue;

		switch (item_neighbor) {
			case WorldItemType.Empty:
			case WorldItemType.TravelStart:
			case WorldItemType.Spaceport:
				typeMap[world_idx] = WorldItemType.Empty;
				break;
			case WorldItemType.Candidate:
				typeMap[world_idx] = WorldItemType.Candidate;

				if (!x_diff) {
					if (x > 0) typeMap[world_idx - 1] = WorldItemType.KeptFree;
					if (x < 9) typeMap[world_idx + 1] = WorldItemType.KeptFree;
				} else if (!y_diff) {
					if (y > 0) typeMap[world_idx - MapWidth] = WorldItemType.KeptFree;
					if (y < 9) typeMap[world_idx + MapWidth] = WorldItemType.KeptFree;
				}

				continue;
			case WorldItemType.BlockEast:
				if (x_diff !== 1) continue;
				if (WorldItemType.None < item_below && item_below <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < item_above && item_above <= WorldItemType.BlockNorth) continue;

				typeMap[world_idx] = WorldItemType.Candidate;

				if (y > 0) typeMap[world_idx - MapWidth] = WorldItemType.KeptFree;
				if (y < 9) typeMap[world_idx + MapWidth] = WorldItemType.KeptFree;
				break;
			case WorldItemType.BlockWest:
				if (x_diff !== -1) continue;
				if (WorldItemType.None < item_above && item_above <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < item_below && item_below <= WorldItemType.BlockNorth) continue;

				typeMap[world_idx] = WorldItemType.Candidate;

				if (y > 0) typeMap[world_idx - MapWidth] = WorldItemType.KeptFree;
				if (y < 9) typeMap[world_idx + MapWidth] = WorldItemType.KeptFree;
				break;
			case WorldItemType.BlockNorth:
				if (y_diff !== -1) continue;
				if (WorldItemType.None < item_before && item_before <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < item_after && item_after <= WorldItemType.BlockNorth) continue;

				typeMap[world_idx] = WorldItemType.Candidate;

				if (x > 0) typeMap[world_idx - 1] = WorldItemType.KeptFree;
				if (x < 9) typeMap[world_idx + 1] = WorldItemType.KeptFree;
				break;
			case WorldItemType.BlockSouth:
				if (y_diff !== 1) continue;
				if (WorldItemType.None < item_before && item_before <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < item_after && item_after <= WorldItemType.BlockNorth) continue;

				typeMap[world_idx] = WorldItemType.Candidate;

				if (x > 0) typeMap[world_idx - 1] = WorldItemType.KeptFree;
				if (x < 9) typeMap[world_idx + 1] = WorldItemType.KeptFree;
				break;
			default:
				continue;
		}

		++placedPuzzles;
		--travels_to_place;
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
