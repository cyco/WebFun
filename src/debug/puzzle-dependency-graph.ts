import { Engine } from "src/engine";
import { Point, Rectangle, Size, astar } from "src/util";
import { Zone, Tile } from "src/engine/objects";
import World from "src/engine/world";

import { floor, abs } from "src/std/math";
import Yoda from "src/engine/type/yoda";

class PuzzleDependencyGraph {
	private _engine: Engine;
	private _solution: number[] = null;
	private ignoredTypes = new Set<Zone.Type>([
		Zone.Type.Empty,
		Zone.Type.Load,
		Zone.Type.Lose,
		Zone.Type.None,
		Zone.Type.Room,
		Zone.Type.Town,
		Zone.Type.Unknown,
		Zone.Type.Win,
		Zone.Type.TravelEnd,
		Zone.Type.FindUniqueWeapon,
		null
	]);

	constructor(engine: Engine) {
		this._engine = engine;
	}

	public get visitOrder() {
		if (!this._solution) {
			this._solution = this.solve();
		}

		return this._solution;
	}

	private solve() {
		const engine = this._engine;
		const world = engine.world;
		const start = world.sectors.findIndex(s => s.zoneType === Zone.Type.Town);
		const end = world.sectors.findIndex(s => s.zoneType === Zone.Type.Goal);

		const candidates = world.sectors
			.map((s, idx) => {
				if (this.ignoredTypes.has(s.zoneType)) return -1;
				if (s.findItem && s.findItem.id === Yoda.tileIDs.Locator) return -1;
				return idx;
			})
			.filter(i => i !== -1);
		const distances = this.precomputeDistances([start, ...candidates], world);
		const blockers = this.precomputeBlocker(candidates, world);

		const path = this.solveTSP(
			start,
			end,
			new Set<Tile>([null, ...engine.dagobah.sectors.map(i => i.findItem)]),
			new Set<number>([null]),
			Infinity,
			[],
			0,
			(a, b) => distances[a][b],
			a => blockers[a],
			world,
			candidates
		)[0];

		return this._engine.world.sectors.map((_, i) => path.indexOf(i));
	}

	private precomputeDistances(candidates: number[], world: World) {
		const length = candidates.length;
		const distances = candidates.reduce(
			(d, v) => ((d[v] = {}), d),
			{} as { [_: string]: { [_: string]: number } }
		);
		return candidates.reduce((d, c, idx, array) => {
			for (let i = idx; i < length; i++) {
				d[c][array[i]] = d[array[i]][c] = this.calculateShortestPath(c, array[i], world).length;
			}

			return d;
		}, distances);
	}

	private solveTSP(
		node: number,
		target: number,
		inventory: Set<Tile>,
		solved: Set<number>,
		bestLength: number,
		path: number[],
		pathLength: number,
		d: (s: number, e: number) => number,
		b: (s: number) => number,
		world: World,
		candidates: number[]
	): [number[], number] {
		if (node === target) {
			return [path, pathLength];
		}

		let bestPath = null;

		const neighbors = this.neighbors(world, node, inventory, solved, candidates, b);
		for (let i = 0, len = neighbors.length; i < len; i++) {
			const neighbor = neighbors[i];

			let neighborPath = [...path, neighbor];
			let neighborPathLength = pathLength + d(node, neighbor);
			if (neighborPathLength + candidates.length - 1 >= bestLength) continue;

			const sector = world.sectors[neighbor];

			const neighborInventory = new Set(inventory);
			neighborInventory.add(sector.findItem);
			neighborInventory.add(sector.additionalGainItem);

			const neighborSolved = new Set(solved);
			neighborSolved.add(neighbor);

			const newCandidates = candidates.slice();
			newCandidates.splice(candidates.indexOf(neighbor), 1);
			[neighborPath, neighborPathLength] = this.solveTSP(
				neighbor,
				target,
				neighborInventory,
				neighborSolved,
				bestLength,
				neighborPath,
				neighborPathLength,
				d,
				b,
				world,
				newCandidates
			);

			if (neighborPathLength < bestLength) {
				bestLength = neighborPathLength;
				bestPath = neighborPath;
			}
		}

		return [bestPath, bestLength];
	}

	private calculateShortestPath(startIdx: number, endIdx: number, world: World): number[] {
		return astar(
			startIdx,
			endIdx,
			(candidate: number): number[] => {
				const x = candidate % 10;
				const y = floor(candidate / 10);

				const result: number[] = [];

				if (x > 0 && world.sectors[candidate - 1].zone) result.push(candidate - 1);
				if (x < 9 && world.sectors[candidate + 1].zone) result.push(candidate + 1);
				if (y > 0 && world.sectors[candidate - 10].zone) result.push(candidate - 10);
				if (y < 9 && world.sectors[candidate + 10].zone) result.push(candidate + 10);

				// result is modified during iteration, calculate length before any modification is made
				for (let i = 0, len = result.length; i < len; i++) {
					const sector = world.sectors[result[i]];
					if (
						sector.zoneType === Zone.Type.TravelStart ||
						sector.zoneType === Zone.Type.TravelEnd
					) {
						result.push(this._findCounterpart(world, result[i]));
					}
				}

				return result;
			},
			(n1, n2) => abs((n1 % 10) - (n2 % 10)) + abs(floor(n1 / 10) - floor(n2 / 10)),
			(n: number) => abs((n % 10) - (endIdx % 10)) + abs(floor(n / 10) - floor(endIdx / 10))
		);
	}

	private neighbors(
		world: World,
		_: number,
		inventory: Set<Tile>,
		solved: Set<number>,
		candidates: number[],
		b: (sector: number) => number
	): number[] {
		return candidates.filter(idx => {
			if (solved.has(idx)) return false;

			const blockingSector = b(idx);
			if (blockingSector && !solved.has(blockingSector)) return false;

			const s = world.sectors[idx];
			if (!inventory.has(s.requiredItem)) return false;
			if (!inventory.has(s.additionalRequiredItem)) return false;

			return true;
		});
	}

	private precomputeBlocker(candidates: number[], world: World) {
		const blockers: { [_: string]: number } = {};
		for (const c of candidates) {
			const blocker = this.findBlocker(world, c);
			if (blocker !== null) blockers[c] = blocker;
		}

		return blockers;
	}

	private findBlocker(world: World, sector: number): number {
		const pos = new Point(sector % 10, floor(sector / 10));

		let blocker: number = null;
		blocker = blocker ?? this._findBlocker(world, pos, new Point(-1, 0), Zone.Type.BlockadeEast);
		blocker = blocker ?? this._findBlocker(world, pos, new Point(1, 0), Zone.Type.BlockadeWest);
		blocker = blocker ?? this._findBlocker(world, pos, new Point(0, -1), Zone.Type.BlockadeSouth);
		blocker = blocker ?? this._findBlocker(world, pos, new Point(0, 1), Zone.Type.BlockadeNorth);

		return blocker ? this._findCounterpart(world, blocker) : null;
	}

	private _findBlocker(world: World, start: Point, step: Point, type: Zone.Type): number {
		const current = start.byAdding(step);
		const bounds = new Rectangle(new Point(0, 0), new Size(10, 10));

		do {
			if (!bounds.contains(current)) return null;
			const sector = world.at(current);
			if (sector.zone === null) return null;
			if (sector.zoneType === type || sector.zoneType === Zone.Type.TravelEnd)
				return current.y * 10 + current.x;
			current.add(step);
		} while (true);
	}

	private _findCounterpart(world: World, sectorId: number): number {
		const sector = world.sectors[sectorId];
		if (sector.zoneType !== Zone.Type.TravelEnd && sector.zoneType !== Zone.Type.TravelStart)
			return sectorId;

		const searchType =
			sector.zoneType === Zone.Type.TravelEnd ? Zone.Type.TravelStart : Zone.Type.TravelEnd;

		return world.sectors.findIndex(
			s => s.zoneType === searchType && s.requiredItem === sector.requiredItem
		);
	}
}

export default PuzzleDependencyGraph;
