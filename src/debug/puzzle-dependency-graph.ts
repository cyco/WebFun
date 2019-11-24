import { Engine } from "src/engine";
import { identity, Point, Rectangle, Size } from "src/util";
import { Zone } from "src/engine/objects";
import Sector from "src/engine/sector";
import World from "src/engine/world";

import { floor } from "src/std/math";

class PuzzleDependencyGraph {
	private _engine: Engine;
	private _solution: number[] = null;

	constructor(engine: Engine) {
		this._engine = engine;
	}

	public get visitOrder() {
		if (!this._solution) this._solution = this.solve();
		return this._solution;
	}

	private solve() {
		const inventory = this.initialInventory;

		const engine = this._engine;
		const ignoredType = new Set<Zone.Type>([
			Zone.Type.Empty,
			Zone.Type.Load,
			Zone.Type.Lose,
			Zone.Type.None,
			Zone.Type.Room,
			Zone.Type.Town,
			Zone.Type.Unknown,
			Zone.Type.Win,
			Zone.Type.TravelEnd
		]);
		const solved = new Set<Sector>();

		engine.dagobah.sectors
			.map(s => s.findItem)
			.filter(i => i)
			.forEach(i => inventory.add(i));

		const world = engine.world;

		let lastTarget = 0;
		const pdg: number[] = new Array(100);
		do {
			const current = lastTarget;
			outer: for (let y = 0; y < 10; y++) {
				for (let x = 0; x < 10; x++) {
					const sector = world.at(x, y);
					if (solved.has(sector)) continue;
					if (ignoredType.has(sector.zoneType)) continue;
					if (!sector.zoneType) continue;
					const blockingSector = this._findSectorBlocking(world, sector);
					if (blockingSector && !solved.has(blockingSector)) continue;

					if (
						!sector.requiredItem ||
						(inventory.has(sector.requiredItem) && !sector.additionalRequiredItem) ||
						inventory.has(sector.additionalRequiredItem)
					) {
						solved.add(sector);
						if (sector.findItem) {
							inventory.add(sector.findItem);
						}
						if (sector.additionalGainItem) {
							inventory.add(sector.additionalGainItem);
						}

						lastTarget++;
						pdg[y * 10 + x] = lastTarget;
						if (sector.zoneType === Zone.Type.TravelStart) {
							const counterpart = this._findCounterpart(world, sector);
							const idx = world.sectors.indexOf(counterpart);
							pdg[idx] = lastTarget;
						}

						break outer;
					}
				}
			}
			if (current === lastTarget) break;
		} while (true);

		return pdg;
	}

	private _findSectorBlocking(world: World, sector: Sector): Sector {
		const idx = world.sectors.indexOf(sector);
		const pos = new Point(idx % 10, floor(idx / 10));

		let blocker: Sector = null;
		blocker = blocker ?? this._findBlocker(world, pos, new Point(-1, 0), Zone.Type.BlockadeWest);
		blocker = blocker ?? this._findBlocker(world, pos, new Point(1, 0), Zone.Type.BlockadeEast);
		blocker = blocker ?? this._findBlocker(world, pos, new Point(0, -1), Zone.Type.BlockadeNorth);
		blocker = blocker ?? this._findBlocker(world, pos, new Point(0, 1), Zone.Type.BlockadeSouth);

		return blocker ? this._findCounterpart(world, blocker) : null;
	}

	private _findBlocker(world: World, start: Point, step: Point, type: Zone.Type): Sector {
		const current = start.byAdding(step);
		const bounds = new Rectangle(new Point(0, 0), new Size(10, 10));

		do {
			if (!bounds.contains(current)) return null;
			const sector = world.at(current);
			if (sector.zone === null) return;
			if (sector.zoneType === type || sector.zoneType === Zone.Type.TravelEnd) return sector;
			current.add(step);
		} while (true);
	}

	private _findCounterpart(world: World, sector: Sector): Sector {
		if (sector.zoneType !== Zone.Type.TravelEnd && sector.zoneType !== Zone.Type.TravelStart)
			return sector;

		const searchType =
			sector.zoneType === Zone.Type.TravelEnd ? Zone.Type.TravelStart : Zone.Type.TravelEnd;

		return world.sectors.find(s => s.zoneType === searchType && s.requiredItem === sector.requiredItem);
	}

	private get initialInventory() {
		return new Set(this._engine.dagobah.sectors.map(s => s.findItem).filter(identity));
	}
}

export default PuzzleDependencyGraph;
