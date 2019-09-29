import HotspotExecutor from "src/engine/script/hotspot-executor";
import { Engine } from "src/engine";
import { Tile, Zone } from "src/engine/objects";
import { Point } from "src/util";
import Sector from "src/engine/sector";

describe("WebFun.Engine.HotspotExecutor", () => {
	let subject: HotspotExecutor;
	let engine: Engine;

	beforeEach(() => {
		engine = { findSectorContainingZone: (): void => void 0, story: { puzzles: [] } } as any;
		subject = new HotspotExecutor(engine);
	});

	it("ignores hotspots on a zone without a puzzle", () => {
		const tile: Tile = {} as any;
		const point = new Point(0, 0);
		const zone: Zone = {} as any;
		const sector: Partial<Sector> = { puzzleIndex: -1, usedAlternateStrain: false };

		spyOn(engine, "findSectorContainingZone").and.returnValue({ sector: sector as Sector, world: null });

		expect(() => subject.triggerPlaceHotspots(tile, point, zone)).not.toThrow();
	});
});
