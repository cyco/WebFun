import { HorizontalPointRange, Point, PointRange, rand, VerticalPointRange } from "src/util";
import WorldItemType from "./world-item-type";
import Map from "./map";

const enum Island {
	East = 3,
	North = 1,
	South = 2,
	West = 0
}

type Run = { length: number; start: number };

class IslandBuilder {
	private typeMap: Map;

	constructor(world: Map) {
		this.typeMap = world;
	}

	public placeIslands(count: number) {
		for (let i = 0; i < count; i++) {
			this._placeIsland();
		}
	}

	private at(point: Point, value?: number) {
		const index = point.x + 10 * point.y;
		if (value !== undefined) this.typeMap[index] = value;
		else return this.typeMap[index];
	}

	private _placeIsland() {
		for (let i = 0; i <= 200; i++) {
			switch (rand() % 4) {
				case Island.West:
					if (this._placeIslandWest()) return;
					break;
				case Island.North:
					if (this._placeIslandNorth()) return;
					break;
				case Island.South:
					if (this._placeIslandSouth()) return;
					break;
				case Island.East:
					if (this._placeIslandEast()) return;
					break;
			}
		}
	}

	private _findRun(range: PointRange, neighbor: Point): Run {
		let start = 0,
			length = 0,
			currentRun = 0;

		let i = 0;
		range.iterate((point: Point) => {
			const currentItem = this.at(point);
			const neighborItem = this.at(Point.add(point, neighbor));
			if (currentItem || (neighborItem && neighborItem !== WorldItemType.KeptFree.rawValue)) {
				if (length < currentRun) {
					length = currentRun;
					start = i - currentRun;
				}
				currentRun = 0;
			} else currentRun++;
			i++;
		});

		if (length < currentRun) {
			length = currentRun;
			start = 10 - currentRun;
		}

		return {
			start: start,
			length: length
		};
	}

	private _buildIsland(range: PointRange) {
		range.iterate((point: Point) => this.at(point, WorldItemType.Island.rawValue));
		const end = rand() % 2 ? range.from : range.to;
		this.at(end, WorldItemType.TravelEnd.rawValue);
	}

	private _verifyShortRun(run: Run): boolean {
		if (run.length < 3) return false;
		else if (run.length === 3) {
			if (0 < run.start && run.start < 7) return false;
			if (run.start === 0) run.length = 2;
			if (run.start === 7) run.length = 2;
		} else if (run.length >= 4) run.length = Math.min(run.length - 2, 4);

		if (run.start > 0 && run.start + run.length < 10) run.start++;

		return true;
	}

	private _verifyLongRun(run: Run) {
		if (run.length < 4) return false;
		run.length = Math.min(run.length - 2, 4);

		if (run.start > 0 && run.start + run.length < 10) run.start++;
		return true;
	}

	private _placeIslandWest() {
		let range = new VerticalPointRange(0, 9, 0);
		const run = this._findRun(range, new Point(1, 0));
		if (!this._verifyShortRun(run)) return false;

		range = new VerticalPointRange(run.start, run.start + run.length - 1, 0);
		this._buildIsland(range);
		return true;
	}

	private _placeIslandNorth() {
		let range = new HorizontalPointRange(0, 9, 0);
		const run = this._findRun(range, new Point(0, 1));
		if (!this._verifyShortRun(run)) return false;

		range = new HorizontalPointRange(run.start, run.start + run.length - 1, 0);
		this._buildIsland(range);

		return true;
	}

	private _placeIslandSouth() {
		let range = new HorizontalPointRange(0, 9, 9);
		const run = this._findRun(range, new Point(0, -1));
		if (!this._verifyLongRun(run)) return false;

		range = new HorizontalPointRange(run.start, run.start + run.length - 1, 9);
		this._buildIsland(range);

		return 1;
	}

	private _placeIslandEast() {
		let range = new VerticalPointRange(0, 9, 9);
		const run = this._findRun(range, new Point(-1, 0));
		if (!this._verifyLongRun(run)) return false;

		range = new VerticalPointRange(run.start, run.start + run.length - 1, 9);
		this._buildIsland(range);

		return 1;
	}
}

export default IslandBuilder;
