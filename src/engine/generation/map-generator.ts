import { HorizontalPointRange, Point, rand, randmod, Range, srand, VerticalPointRange } from "src/util";
import { WorldSize } from "../types";
import GetDistanceToCenter from "./distance-to-center";
import IslandBuilder from "./island-builder";
import WorldItemType from "./world-item-type";
import Map from "./map";

const IslandOrientation = {
	Left: 1,
	Right: 3,
	Up: 2,
	Down: 4
};

type IslandOrientationType = number;

let min_x: number;
let alternate_x: number;
let min_y: number;
let alternate_y: number;
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
let config;

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

function blockadeTypeForCheck(xdiff: number, ydiff: number): WorldItemType {
	return blockadeTypeFor(xdiff, ydiff);
}

function _determineCounts(): void {
	travels = rand() % 3;
	blockades = rand() % 4;

	placedPuzzles = 0;
	placedTravels = 0;
}

function getIslandOrientation(x: number, y: number, typeMap: Map): IslandOrientationType {
	if (typeMap.get(x - 1, y) === WorldItemType.Island.rawValue) return IslandOrientation.Left;
	if (typeMap.get(x + 1, y) === WorldItemType.Island.rawValue) return IslandOrientation.Right;
	if (typeMap.get(x, y - 1) === WorldItemType.Island.rawValue) return IslandOrientation.Up;
	if (typeMap.get(x, y + 1) === WorldItemType.Island.rawValue) return IslandOrientation.Down;

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
	typeMap.set(x, y, blockadeTypeFor(xdif, ydif).rawValue);

	typeMap.set(x - ydif, y - xdif, WorldItemType.KeptFree.rawValue);
	typeMap.set(x + ydif, y + xdif, WorldItemType.KeptFree.rawValue);
	typeMap.set(x - xdif, y - ydif, WorldItemType.Candidate.rawValue);
	typeMap.set(x - ydif - xdif, y - ydif - xdif, WorldItemType.KeptFree.rawValue);
	typeMap.set(x + ydif - xdif, y - ydif + xdif, WorldItemType.KeptFree.rawValue);

	--remaining_count_to_place;
	placedPuzzles += 2;
	--blockades;
}

function extend_blockade(x: number, y: number, xdif: number, ydif: number): void {
	typeMap.set(x, y, WorldItemType.Candidate.rawValue);
	typeMap.set(x - ydif, y - xdif, WorldItemType.KeptFree.rawValue);
	typeMap.set(x + ydif, y + xdif, WorldItemType.KeptFree.rawValue);

	++placedPuzzles;
	--remaining_count_to_place;
}

function is_free(type: WorldItemType): boolean {
	return type === WorldItemType.None || type === WorldItemType.KeptFree;
}

function is_less_than_candidate(type: number): boolean {
	return type < WorldItemType.Candidate.rawValue;
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
	let item_idx = x + 10 * y;

	let neighbor = WorldItemType.fromNumber(typeMap.get(x + xdif, y + ydif));
	let neighborOtherAxisBefore = WorldItemType.fromNumber(typeMap.get(x + ydif, y + xdif));
	let neighborOtherAxisAfter = WorldItemType.fromNumber(typeMap.get(x - ydif, y - xdif));

	if (is_free(neighbor)) return false; // maybe negate is_free

	last_item = WorldItemType.fromNumber(typeMap.get(x + xdif, y + ydif));

	const BlockadeType = blockadeTypeForCheck(xdif, ydif);
	const canPlaceBlockade = is_free(neighborOtherAxisBefore) && is_free(neighborOtherAxisAfter);
	if ((canPlaceBlockade && neighbor === WorldItemType.Candidate) || neighbor === BlockadeType) {
		extend_blockade(x, y, xdif, ydif);
	}

	if (neighbor === WorldItemType.Invalid) return true;
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
		typeMap[item_idx] = WorldItemType.Empty.rawValue;
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

	config = [];
}

function _initializeTypeMap(spaceportX: number, spaceportY: number) {
	typeMap = <any>new Uint16Array(100);
	typeMap[44] = WorldItemType.Empty.rawValue;
	typeMap[45] = WorldItemType.Empty.rawValue;
	typeMap[54] = WorldItemType.Empty.rawValue;
	typeMap[55] = WorldItemType.Empty.rawValue;

	typeMap[spaceportX + 10 * spaceportY] = WorldItemType.Spaceport.rawValue;
}

function _initializeOrderMap() {
	orderMap = <any>new Int16Array(100);
	for (let i = 0, len = orderMap.length; i < len; i++) {
		orderMap[i] = -1;
	}
}

function generate(seed: number, size: WorldSize) {
	if (seed >= 0) srand(seed);

	_determineCounts();

	rand(); // waste a random number

	let rand1 = randmod(2) + 4;
	let rand2 = randmod(2) + 4;
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

	const islandBuilder = new IslandBuilder(<any>typeMap);
	islandBuilder.placeIslands(placedTravels);

	_placeIntermediateWorldThing();

	return typeMap;
}

function findPuzzleLastPuzzle() {
	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			if (orderMap.get(x, y) === placedPuzzles - 1) {
				return new Point(x, y);
			}
		}
	}
	return null;
}

function _choosePuzzlesBehindBlockades() {
	const bounds = {
		width: 10,
		height: 10
	};
	let smallStep;
	let largeStep;

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			switch (WorldItemType.fromNumber(typeMap.get(x, y))) {
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
			if (typeMap.get(smallStepped.x, smallStepped.y) !== WorldItemType.Candidate.rawValue) continue;

			if (
				!largeStepped.isInBounds(bounds) ||
				typeMap.get(largeStepped.x, largeStepped.y) !== WorldItemType.Candidate.rawValue
			) {
				point = smallStepped;
			} else {
				point = largeStepped;
			}

			typeMap.set(point.x, point.y, WorldItemType.Puzzle.rawValue);
			orderMap.set(point.x, point.y, placedPuzzles++);
		}
	}
}

function _choosePuzzlesOnIslands() {
	const bounds = {
		width: 10,
		height: 10
	};

	let range;
	let step;
	let puzzleLocation;
	const iteration = (point: Point, control: any) => {
		const nextPoint = Point.add(point, control.step);
		if (
			!nextPoint.isInBounds(bounds) ||
			typeMap.get(nextPoint.x, nextPoint.y) !== WorldItemType.Island.rawValue
		) {
			control.stop = true;
			puzzleLocation = point;
		}
	};

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			if (typeMap.get(x, y) !== WorldItemType.TravelEnd.rawValue) continue;

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

			typeMap.set(puzzleLocation.x, puzzleLocation.y, WorldItemType.Puzzle.rawValue);
			orderMap.set(puzzleLocation.x, puzzleLocation.y, placedPuzzles++);
		}
	}
}

function _chooseAdditionalPuzzles(total_puzzle_count: number): void {
	let do_break = 0;
	for (let i = 0; i <= 200; i++) {
		let x, y;

		if (i > 200) {
			do_break = 1;
		}
		if (placedPuzzles >= total_puzzle_count) {
			do_break = 1;
		}

		x = rand() % 10;
		if (i >= 50 || x === 0 || x === 9) {
			y = rand() % 10;
		} else {
			y = (rand() & 1) < 1 ? 9 : 0;
		}

		// asm compares something against 400, 150 and maybe blockade_count
		if (placedPuzzles >= total_puzzle_count) break;

		let distance = GetDistanceToCenter(x, y);
		if (distance >= 3 || i >= 150) {
			let item = WorldItemType.fromNumber(typeMap.get(x, y));
			if (
				(item === WorldItemType.Empty || item === WorldItemType.Candidate) &&
				(x === 0 || typeMap.get(x - 1, y) !== WorldItemType.Puzzle.rawValue) &&
				(x === 9 || typeMap.get(x + 1, y) !== WorldItemType.Puzzle.rawValue) &&
				(y === 0 || typeMap.get(x, y - 1) !== WorldItemType.Puzzle.rawValue) &&
				(y === 9 || typeMap.get(x, y + 1) !== WorldItemType.Puzzle.rawValue)
			) {
				typeMap.set(x, y, WorldItemType.Puzzle.rawValue);
				orderMap.set(x, y, placedPuzzles++);
			}

			if (placedPuzzles >= total_puzzle_count) break;
		}

		if (distance < 3 && i < 150) i--;

		if (do_break) break;
	}
}

function _mapCountStuff(): number {
	travels = 0;
	blockades = 0;
	puzzles = 0;
	for (let i = 0; i < 100; i++) {
		switch (WorldItemType.fromNumber(typeMap[i])) {
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
	return 0;
}

function _makeSureLastPuzzleIsNotTooCloseToCenter(): void {
	const getDistanceToCenter = GetDistanceToCenter;
	const lastPuzzle = findPuzzleLastPuzzle();
	if (getDistanceToCenter(lastPuzzle.x, lastPuzzle.y) < 3) {
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (
					orderMap.get(x, y) >= 0 &&
					getDistanceToCenter(x, y) >= 3 &&
					(x !== lastPuzzle.x || y !== lastPuzzle.y)
				) {
					let replacement_puzzle = orderMap.get(x, y);
					orderMap.set(lastPuzzle.x, lastPuzzle.y, replacement_puzzle);
					orderMap.set(x, y, placedPuzzles - 1);

					return;
				}
			}
		}
	}
}

function _placeIntermediateWorldThing(): number {
	placedPuzzles = 0;

	_mapCountStuff();

	let puzzles_count = puzzles;
	let travel_count = travels;
	let blockades_count = blockades;

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

	return placedPuzzles;
}

function _tryPlacingTravel(item_idx: number, iteration: number, last_item: WorldItemType) {
	if (typeMap[item_idx] !== WorldItemType.Empty.rawValue) return;

	if (travels <= placedTravels) return;
	if ((rand() & 7) >= travel_threshold) return;
	if (last_item === WorldItemType.TravelStart) return;
	if (iteration <= 2) return;

	typeMap[item_idx] = WorldItemType.TravelStart.rawValue;
	placedTravels++;
}

function _determinePuzzleLocations(iteration: number, puzzle_count_to_place: number) {
	remaining_count_to_place = puzzle_count_to_place;

	switch (iteration) {
		case 2:
			min_x = 3;
			alternate_x = 6;
			min_y = 3;
			alternate_y = 6;
			variance = 4;
			probablility = 9;
			threshold = 2;
			travel_threshold = 1;
			break;
		case 3:
			min_x = 2;
			alternate_x = 7;
			min_y = 2;
			alternate_y = 7;
			variance = 6;
			probablility = 4;
			travel_threshold = 3;
			threshold = 2;
			break;
		case 4:
			min_x = 1;
			alternate_x = 8;
			min_y = 1;
			alternate_y = 8;
			variance = 8;
			threshold = 1;
			probablility = 5;
			travel_threshold = 6;
			break;
		default:
			return 0;
	}

	for (let i = 0; i <= 144 && remaining_count_to_place > 0; i++) {
		let x, y;
		if (rand() % 2) {
			x = rand() % 2 ? min_x : alternate_x;
			y = (rand() % variance) + min_y;
		} else {
			y = rand() % 2 ? min_y : alternate_y;
			x = (rand() % variance) + min_x;
		}

		let item_idx = x + 10 * y;
		if (typeMap[item_idx]) continue;

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
		let is_vertical = rand() % 2;
		if (is_vertical) {
			x = rand() % 2 ? 0 : 9;
			y = rand() % 10;
		} else {
			y = rand() % 2 ? 0 : 9;
			x = rand() % 10;
		}

		let world_idx = x + 10 * y;
		if (typeMap[world_idx] !== 0) continue;

		let item_before = WorldItemType.fromNumber(typeMap.get(x - 1, y));
		let item_after = WorldItemType.fromNumber(typeMap.get(x + 1, y));
		let item_above = WorldItemType.fromNumber(typeMap.get(x, y - 1));
		let item_below = WorldItemType.fromNumber(typeMap.get(x, y + 1));

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

		let item_neighbor = WorldItemType.fromNumber(typeMap.get(x - x_diff, y - y_diff));
		if (item_neighbor === WorldItemType.None) continue;
		if (item_neighbor === WorldItemType.Invalid) continue;

		switch (item_neighbor) {
			case WorldItemType.Empty:
			case WorldItemType.TravelStart:
			case WorldItemType.Spaceport:
				typeMap[world_idx] = WorldItemType.Empty.rawValue;
				break;
			case WorldItemType.Candidate:
				typeMap[world_idx] = WorldItemType.Candidate.rawValue;

				if (!x_diff) {
					if (x > 0) typeMap[world_idx - 1] = WorldItemType.KeptFree.rawValue;
					if (x < 9) typeMap[world_idx + 1] = WorldItemType.KeptFree.rawValue;
				} else if (!y_diff) {
					if (y > 0) typeMap[world_idx - 10] = WorldItemType.KeptFree.rawValue;
					if (y < 9) typeMap[world_idx + 10] = WorldItemType.KeptFree.rawValue;
				}

				continue;
			case WorldItemType.BlockEast:
				if (x_diff !== 1) continue;
				if (WorldItemType.None < item_below && item_below <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < item_above && item_above <= WorldItemType.BlockNorth) continue;

				typeMap[world_idx] = WorldItemType.Candidate.rawValue;

				if (y > 0) typeMap[world_idx - 10] = WorldItemType.KeptFree.rawValue;
				if (y < 9) typeMap[world_idx + 10] = WorldItemType.KeptFree.rawValue;
				break;
			case WorldItemType.BlockWest:
				if (x_diff !== -1) continue;
				if (WorldItemType.None < item_above && item_above <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < item_below && item_below <= WorldItemType.BlockNorth) continue;

				typeMap[world_idx] = WorldItemType.Candidate.rawValue;

				if (y > 0) typeMap[world_idx - 10] = WorldItemType.KeptFree.rawValue;
				if (y < 9) typeMap[world_idx + 10] = WorldItemType.KeptFree.rawValue;
				break;
			case WorldItemType.BlockNorth:
				if (y_diff !== -1) continue;
				if (WorldItemType.None < item_before && item_before <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < item_after && item_after <= WorldItemType.BlockNorth) continue;

				typeMap[world_idx] = WorldItemType.Candidate.rawValue;

				if (x > 0) typeMap[world_idx - 1] = WorldItemType.KeptFree.rawValue;
				if (x < 9) typeMap[world_idx + 1] = WorldItemType.KeptFree.rawValue;
				break;
			case WorldItemType.BlockSouth:
				if (y_diff !== 1) continue;
				if (WorldItemType.None < item_before && item_before <= WorldItemType.BlockNorth) continue;
				if (WorldItemType.None < item_after && item_after <= WorldItemType.BlockNorth) continue;

				typeMap[world_idx] = WorldItemType.Candidate.rawValue;

				if (x > 0) typeMap[world_idx - 1] = WorldItemType.KeptFree.rawValue;
				if (x < 9) typeMap[world_idx + 1] = WorldItemType.KeptFree.rawValue;
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
		return Math.max.apply(null, orderMap) + 1;
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
