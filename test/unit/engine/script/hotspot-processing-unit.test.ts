/*
import HotspotProcessingUnit, { HotspotExecutionMode } from "src/engine/script/hotspot-processing-unit";
import { Engine } from "src/engine";
import { Tile, Zone } from "src/engine/objects";
import { Point } from "src/util";
import Sector from "src/engine/sector";

describe("WebFun.Engine.HotspotProcessingUnit", () => {
	let subject: HotspotProcessingUnit;
	let engine: Engine;

	beforeEach(() => {
		engine = { findSectorContainingZone: (): void => void 0, story: { puzzles: [] } } as any;
		subject = new HotspotProcessingUnit(engine);
	});

	it("ignores hotspots on a zone without a puzzle", () => {
		const tile: Tile = {} as any;
		const point = new Point(0, 0);
		const zone: Zone = {} as any;
		const sector: Partial<Sector> = { puzzleIndex: -1, usedAlternateStrain: false };

		engine.currentZone = zone;

		spyOn(engine, "findSectorContainingZone").and.returnValue({ sector: sector as Sector, world: null });
		expect(() => subject.execute(HotspotExecutionMode.PlaceTile, engine, tile, point)).not.toThrow();
	});
});
*/
